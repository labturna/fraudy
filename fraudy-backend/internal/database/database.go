package database

import (
	"fmt"
	"log"
	"os"
	"time"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	var db *gorm.DB
	var err error

	// 10 kez tekrar deneyecek, her seferinde 2 saniye bekleyecek
	for i := 1; i <= 10; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			DB = db
			fmt.Println("✅ Database connected successfully!")
			return
		}

		fmt.Printf("❌ Database connection failed (Attempt %d/10): %s\n", i, err)
		time.Sleep(2 * time.Second)
	}

	log.Fatal("🚨 Could not connect to the database after multiple attempts")
}
