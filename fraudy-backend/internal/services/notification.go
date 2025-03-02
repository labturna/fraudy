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
	if err := json.Unmarshal([]byte(alert.NotificationPreferences), &toEmails); err != nil {
		return fmt.Errorf("❌ Error parsing notification preferences: %v", err)
	}
	addr := fmt.Sprintf("%s:%s", config.SMTPServer, config.SMTPPort)
	auth := smtp.PlainAuth("", config.EmailSender, config.EmailPassword, config.SMTPServer)
	subject := "🚨 Fraud Alert Triggered!"
	body := fmt.Sprintf(
		"Hello,\n\nA fraud alert has been triggered!\n\nAlert Name: %s\nRule Type: %s\nWallet ID: %s\nTriggered At: %s\n\nBest regards,\nFraudy Team",
		alert.AlertName, alert.RuleType, alert.WalletID, alert.CreatedAt,
	)

	message := fmt.Sprintf("From: %s\nTo: %s\nSubject: %s\n\n%s",
		config.EmailSender,
		strings.Join(toEmails, ", "),
		subject,
		body,
	)

	err := smtp.SendMail(addr, auth, config.EmailSender, toEmails, []byte(message))
	if err != nil {
		fmt.Printf("smtp error: %s", err)
	}
	fmt.Println("✅ Email notification sent successfully!")
	return nil
}
