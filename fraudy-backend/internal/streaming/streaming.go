package streaming

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"fraudy-backend/internal/database"
	"fraudy-backend/internal/models"
	"fraudy-backend/internal/services"

	"github.com/stellar/go/clients/horizonclient"
	"github.com/stellar/go/protocols/horizon"
)

var (
	monitoredWallets = make(map[string]string)
	mu               sync.Mutex
	failedTxCache    = make(map[string][]string)
	failedTxLock     sync.Mutex
)

func getMonitoredWallets() (map[string]string, error) {
	var alerts []models.Alert
	result := database.DB.Select("wallet_id, rule_type").Find(&alerts)
	if result.Error != nil {
		return nil, result.Error
	}

	walletRules := make(map[string]string)
	for _, alert := range alerts {
		walletRules[alert.WalletID] = alert.RuleType
	}

	return walletRules, nil
}

func MonitorNewWallets(ctx context.Context) {
	for {
		wallets, err := getMonitoredWallets()
		if err != nil {
			log.Printf("❌ Error fetching monitored WalletIDs: %v\n", err)
			time.Sleep(10 * time.Second)
			continue
		}

		mu.Lock()
		for wallet, ruleType := range wallets {
			if _, exists := monitoredWallets[wallet]; !exists {
				monitoredWallets[wallet] = ruleType
				go StreamTransactionsForWallet(ctx, wallet, ruleType)
			}
		}
		mu.Unlock()
		time.Sleep(10 * time.Second)

		processStoredTransactions()
	}
}

func StreamTransactionsForWallet(ctx context.Context, wallet string, ruleType string) {
	client := horizonclient.DefaultTestNetClient
	request := horizonclient.TransactionRequest{
		ForAccount:    wallet,
		Cursor:        "now",
		Order:         horizonclient.OrderAsc,
		IncludeFailed: true,
	}

	fmt.Printf("🛰️ Now monitoring transactions for WalletID: %s with rule: %s\n", wallet, ruleType)
	err := client.StreamTransactions(ctx, request, func(tx horizon.Transaction) {
		fmt.Printf("🔄 New Transaction: %s | Account: %s\n", tx.Hash, tx.Account)

		exists, _ := RedisClient.Exists(context.Background(), fmt.Sprintf("transaction:%s", tx.Hash)).Result()
		if exists == 0 {
			err := storeTransaction(tx)
			if err != nil {
				log.Printf("❌ Error storing transaction in Redis: %v\n", err)
			}
		} else {
			fmt.Printf("⚠️ Transaction %s already exists in Redis, skipping...\n", tx.Hash)
		}
	})

	if err != nil {
		log.Printf("❌ Error streaming transactions for WalletID %s: %v\n", wallet, err)
	}
}

func storeTransaction(tx horizon.Transaction) error {
	txJSON, err := json.Marshal(tx)
	if err != nil {
		fmt.Println("❌ Error serializing transaction:", err)
		return err
	}

	key := fmt.Sprintf("transaction:%s", tx.Hash)
	err = RedisClient.Set(context.Background(), key, txJSON, 30*time.Minute).Err()
	if err != nil {
		fmt.Println("❌ Error storing transaction in Redis:", err)
	} else {
		fmt.Printf("✅ Stored transaction in Redis: %s\n", tx.Hash)
	}
	return err
}

func processStoredTransactions() {
	ctx := context.Background()
	keys, err := RedisClient.Keys(ctx, "transaction:*").Result()
	if err != nil {
		log.Println("❌ Error fetching stored transactions from Redis:", err)
		return
	}

	if len(keys) == 0 {
		fmt.Println("⚠️ No stored transactions found in Redis!")
		return
	}

	walletRules, err := getMonitoredWallets()
	if err != nil {
		log.Println("❌ Error fetching wallet rules:", err)
		return
	}

	for _, key := range keys {
		txJSON, err := RedisClient.Get(ctx, key).Result()
		if err != nil {
			log.Printf("❌ Error retrieving transaction from Redis (Key: %s): %v\n", key, err)
			continue
		}

		var tx horizon.Transaction
		if err := json.Unmarshal([]byte(txJSON), &tx); err != nil {
			log.Printf("❌ Error unmarshalling transaction JSON (Key: %s): %v\n", key, err)
			continue
		}

		ruleType, exists := walletRules[tx.Account]
		if !exists {
			fmt.Printf("⚠️ No rule found for Wallet: %s\n", tx.Account)
			continue
		}

		var userID int
		database.DB.Table("alerts").Select("user_id").Where("wallet_id = ?", tx.Account).Scan(&userID)

		switch ruleType {
		case "doubleSpend":
			detectDoubleSpend(tx)
		case "highFailureRate":
			detectHighFailureRate(tx, userID)
		default:
			fmt.Printf("⚠️ No fraud detection logic for rule: %s\n", ruleType)
		}
	}
}

func detectDoubleSpend(tx horizon.Transaction) {
	fmt.Printf("🚨 Running Double Spend Detection for Transaction: %s\n", tx.Hash)
}

func detectHighFailureRate(tx horizon.Transaction, userID int) {
	ctx := context.Background()
	processedKey := fmt.Sprintf("processed_tx:%s", tx.Hash)
	exists, _ := RedisClient.Exists(ctx, processedKey).Result()
	if exists > 0 {
		fmt.Printf("⚠️ Skipping already processed transaction: %s\n", tx.Hash)
		return
	}
	RedisClient.Set(ctx, processedKey, "processed", 30*time.Minute)

	failedTxLock.Lock()
	defer failedTxLock.Unlock()

	account := tx.Account

	if !tx.Successful {
		failedTxCache[account] = append(failedTxCache[account], tx.Hash)
		fmt.Printf("❌ Failed Transaction Detected: %s | Account: %s | Total Failures: %d\n",
			tx.Hash, account, len(failedTxCache[account]))
	}

	if len(failedTxCache[account]) >= 10 {
		fmt.Printf("🚨 HIGH FAILURE RATE DETECTED! Account: %s | Failed Tx Count: %d\n",
			account, len(failedTxCache[account]))

		// Convert to JSON array string
		preferencesJSON, err := json.Marshal(failedTxCache[account])
		if err != nil {
			fmt.Println("❌ Error marshalling notification preferences:", err)
			return
		}

		fraud := models.FraudActivity{
			Account:      account,
			Type:         "highFailureRate",
			FailureCount: len(failedTxCache[account]),
		}
		database.DB.Create(&fraud)

		// Fetch user's email config
		var config models.NotificationConfig
		result := database.DB.Where("user_id = ? AND notification_type = ?", userID, "email").First(&config)
		if result.Error != nil {
			fmt.Printf("⚠️ No email config found for user ID %d\n", userID)
			return
		}

		alert := models.Alert{
			UserID:                 userID,
			AlertName:              "High Failure Rate Alert",
			RuleType:               "highFailureRate",
			WalletID:               account,
			NotificationPreferences: string(preferencesJSON),
		}

		err = services.SendEmailNotification(userID, alert)
		if err != nil {
			fmt.Println("❌ Failed to send email notification:", err)
		}

		failedTxCache[account] = nil
	}
}

