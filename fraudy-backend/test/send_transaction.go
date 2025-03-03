package main

import (
	"fmt"
	"log"
	"time"

	"github.com/stellar/go/clients/horizonclient"
	"github.com/stellar/go/keypair"
	"github.com/stellar/go/network"
	"github.com/stellar/go/txnbuild"
)

// Sender and Receiver Account Keys
const senderSecret = "" // Sender Secret Key
const receiverPublic = "GBPUZMFJIUJ5ZVJR4YIJ4QA2CIRQGAZUWOOP4UJ5K7W7W5EEQRMEFLJZ" // Receiver Public Key

func main() {
	client := horizonclient.DefaultTestNetClient

	// Parse the sender secret key
	senderKP, err := keypair.ParseFull(senderSecret)
	if err != nil {
		log.Fatalf("❌ Error parsing sender secret key: %v", err)
	}

	// Send the transaction 3 times
	for i := 1; i <= 3; i++ {
		fmt.Printf("\n📡 Sending Transaction #%d...\n", i)

		// Fetch latest sequence number before each transaction
		accountRequest := horizonclient.AccountRequest{AccountID: senderKP.Address()}
		senderAccount, err := client.AccountDetail(accountRequest)
		if err != nil {
			log.Fatalf("❌ Error fetching sender account details: %v", err)
		}

		// 3️⃣ Create the payment transaction
		paymentTx, err := txnbuild.NewTransaction(
			txnbuild.TransactionParams{
				SourceAccount:        &senderAccount,
				IncrementSequenceNum: true,
				BaseFee:              txnbuild.MinBaseFee,
				Preconditions:        txnbuild.Preconditions{TimeBounds: txnbuild.NewTimeout(300)},
				Operations: []txnbuild.Operation{
					&txnbuild.Payment{
						Destination: receiverPublic,
						Amount:      "10", // Amount to send (XLM)
						Asset:       txnbuild.NativeAsset{},
					},
				},
			},
		)

		if err != nil {
			log.Fatalf("❌ Error building transaction: %v", err)
		}

		//  Sign the transaction
		paymentTx, err = paymentTx.Sign(network.TestNetworkPassphrase, senderKP)
		if err != nil {
			log.Fatalf("❌ Error signing transaction: %v", err)
		}

		//  Submit the transaction
		resp, err := client.SubmitTransaction(paymentTx)
		if err != nil {
			log.Printf("❌ Error submitting transaction #%d: %v", i, err)
			log.Println("🔄 Retrying after 5 seconds...")
			time.Sleep(5 * time.Second) // Retry delay before next attempt
			continue
		}

		fmt.Println("✅ Transaction Successful!")
		fmt.Println("🔗 Transaction Hash:", resp.Hash)

		// ⏳ Wait 5 seconds before sending the next transaction
		time.Sleep(5 * time.Second)
	}
}
