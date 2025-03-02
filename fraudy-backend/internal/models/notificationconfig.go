package models

import "gorm.io/gorm"

type NotificationConfig struct {
	gorm.Model
	UserID          int    `gorm:"not null"`
	ConfigName      string `gorm:"size:255;not null"`
	NotificationType string `gorm:"size:50;not null"` // slack, email, telegram, discord
	SlackWebhook    string `gorm:"size:255"`
	EmailSender     string `gorm:"size:255"`
	EmailPassword   string `gorm:"size:255"`
	SMTPServer      string `gorm:"size:255"`
	SMTPPort        string `gorm:"size:10"`
	RecipientEmails string `gorm:"type:jsonb"`
	TelegramChatID  string `gorm:"size:255"`
	DiscordChannel  string `gorm:"size:255"`
}
