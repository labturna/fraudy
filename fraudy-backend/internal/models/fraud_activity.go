package models

import "gorm.io/gorm"

type FraudActivity struct {
	gorm.Model
	Account        string `gorm:"size:100;not null"`
	Type          string `gorm:"size:50;not null"`  
	TransactionHash string `gorm:"size:100;not null"` 
	Sequence       string `gorm:"size:50;not null"`  
	FailureCount   int    
}
