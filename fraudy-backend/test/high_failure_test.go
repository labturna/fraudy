package test

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stellar/go/clients/horizonclient"
	"github.com/stellar/go/keypair"
	"github.com/stellar/go/network"
	"github.com/stellar/go/txnbuild"
)

// Stellar Test Accounts
const senderPublic = "GD3DH2HMP5H6LJZEU5FHF2NPM7IXJCUNFFU7CUER74NR6VNHWKVLYRSR"
const senderPrivate = "SB6Y76GHUIWDZWJO4W2MVY4JD4I7XTV4CPKI4KUQYVIMQXYLF7JXGHGZ"
const receiverPublic = "GBPUZMFJIUJ5ZVJR4YIJ4QA2CIRQGAZUWOOP4UJ5K7W7W5EEQRMEFLJZ"

var failedTxCache = make(map[string][]string)
func detectHighFailureRateMock(account string) bool {
	if len(failedTxCache[account]) >= 10 {
		fmt.Printf("🚨 HIGH FAILURE RATE DETECTED! Account: %s | Failed Tx Count: %d\n",
			account, len(failedTxCache[account]))
		return true
	}
	return false
}

func TestHighFailureRateDetection(t *testing.T) {
	client := horizonclient.DefaultTestNetClient
	accountRequest := horizonclient.AccountRequest{AccountID: senderPublic}
	senderAccount, err := client.AccountDetail(accountRequest)
	if err != nil {
		t.Fatalf("❌ Error fetching sender account: %v", err)
	}
	sequenceNumber := senderAccount.Sequence
	senderSimpleAccount := txnbuild.NewSimpleAccount(senderPublic, sequenceNumber)
	failCount := 0
	for i := 0; i < 10; i++ {
		txParams := txnbuild.TransactionParams{
			SourceAccount:        &senderSimpleAccount,
			IncrementSequenceNum: true,
			BaseFee:              txnbuild.MinBaseFee,
			Preconditions:        txnbuild.Preconditions{TimeBounds: txnbuild.NewTimeout(300)},
			Operations: []txnbuild.Operation{
				&txnbuild.Payment{
					Destination: receiverPublic,
					Amount:      "1000000000", 
					Asset:       txnbuild.NativeAsset{},
				},
			},
		}

		tx, err := txnbuild.NewTransaction(txParams)
		if err != nil {
			t.Fatalf("❌ Error building transaction: %v", err)
		}

		// Sign Transaction
		senderKP, _ := keypair.ParseFull(senderPrivate)
		tx, err = tx.Sign(network.TestNetworkPassphrase, senderKP)
		if err != nil {
			t.Fatalf("❌ Error signing transaction: %v", err)
		}

		// Compute Hash
		txHash, _ := tx.Hash(network.TestNetworkPassphrase)
		txHashStr := fmt.Sprintf("%x", txHash)

		// 🔹 Submit Transaction (Should Fail)
		_, err = client.SubmitTransaction(tx)
		if err != nil {
			fmt.Printf("❌ Failed Transaction %d | Hash: %s\n", i+1, txHashStr)
			failedTxCache[senderPublic] = append(failedTxCache[senderPublic], txHashStr)
			failCount++
		} else {
			t.Fatalf("❌ Unexpectedly, transaction succeeded! This should be failing.")
		}

		// Sleep to avoid spam rate limits
		time.Sleep(500 * time.Millisecond)
	}

	// 🚨 Detect high failure rate
	isHighFailure := detectHighFailureRateMock(senderPublic)

	// Assertions
	assert.True(t, isHighFailure, "High failure rate should be detected in memory")
	assert.Equal(t, 10, failCount, "Exactly 10 transactions should have failed")

	fmt.Println("✅ High Failure Rate Test Passed (No Database Write)!")
}
