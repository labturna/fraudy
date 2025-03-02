package models

import (
	"gorm.io/gorm"
)

type Alert struct {
	gorm.Model
	UserID                 int           `gorm:"not null"`
	AlertName              string         `gorm:"size:255;not null"`
	RuleType               string         `gorm:"size:50;not null"` 
	NotificationPreferences string         `gorm:"type:jsonb"` 
	WalletID           string  `gorm:"size:255;not null"`
	TransactionThreshold float64 `gorm:"not null"`
	TimeFrame          int     `gorm:"not null"` 
	TransactionStatus  bool    `gorm:"not null"`
}

