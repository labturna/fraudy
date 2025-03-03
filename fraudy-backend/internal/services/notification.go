package services

import (
	"fmt"
	"net/smtp"
	"encoding/json"
	"strings"
	"fraudy-backend/internal/database"
	"fraudy-backend/internal/models"
)

func SendEmailNotification(userID int, alert models.Alert) error {
	var config models.NotificationConfig
	result := database.DB.Where("user_id = ? AND notification_type = ?", userID, "email").First(&config)
	if result.Error != nil {
		return fmt.Errorf("❌ Error fetching email config for user ID %d: %v", userID, result.Error)
	}

	var toEmails []string
	if err := json.Unmarshal([]byte(config.RecipientEmails), &toEmails); err != nil {
		return fmt.Errorf("❌ Error parsing recipient emails: %v", err)
	}

	fmt.Println("📩 Parsed Recipient Emails:", toEmails)

	addr := fmt.Sprintf("%s:%s", config.SMTPServer, config.SMTPPort)
	auth := smtp.PlainAuth("", config.EmailSender, config.EmailPassword, config.SMTPServer)

	// 📌 HTML Email Template
	subject := "🚨 Fraud Alert Triggered!"
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<style>
				.container {
					font-family: Arial, sans-serif;
					background-color: #f4f4f4;
					padding: 20px;
					border-radius: 8px;
					max-width: 600px;
					margin: auto;
				}
				.header {
					background-color: #d9534f;
					color: white;
					padding: 10px;
					text-align: center;
					font-size: 20px;
					font-weight: bold;
					border-radius: 5px 5px 0 0;
				}
				.content {
					padding: 15px;
					background-color: white;
					border-radius: 0 0 5px 5px;
				}
				.footer {
					margin-top: 10px;
					font-size: 12px;
					color: gray;
					text-align: center;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">🚨 Fraud Alert Triggered!</div>
				<div class="content">
					<p><strong>Alert Name:</strong> %s</p>
					<p><strong>Rule Type:</strong> %s</p>
					<p><strong>Wallet ID:</strong> %s</p>
					<p><strong>Triggered At:</strong> %s</p>
					<p>Please review this alert in your <a href="http://fraudy-app.com/dashboard">Fraudy Dashboard</a>.</p>
				</div>
				<div class="footer">© 2025 Fraudy Team</div>
			</div>
		</body>
		</html>
	`, alert.AlertName, alert.RuleType, alert.WalletID, alert.CreatedAt)

	// 📩 Email Headers
	message := fmt.Sprintf("MIME-Version: 1.0\r\n"+
		"Content-Type: text/html; charset=\"UTF-8\"\r\n"+
		"From: %s\r\n"+
		"To: %s\r\n"+
		"Subject: %s\r\n\r\n"+
		"%s",
		config.EmailSender,
		strings.Join(toEmails, ", "),
		subject,
		body,
	)

	err := smtp.SendMail(addr, auth, config.EmailSender, toEmails, []byte(message))
	if err != nil {
		return fmt.Errorf("❌ SMTP error: %s", err)
	}

	fmt.Println("✅ Email notification sent successfully!")
	return nil
}
