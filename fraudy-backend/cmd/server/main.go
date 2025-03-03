package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"fraudy-backend/internal/database"
	"fraudy-backend/internal/models"
	"fraudy-backend/internal/handlers"
	"fraudy-backend/internal/middleware"
	"fraudy-backend/internal/streaming"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ Warning: No .env file found")
	}
	fmt.Println("🔑 Loaded JWT Secret in main.go:", os.Getenv("JWT_SECRET"))
	ctx := context.Background()
	streaming.InitRedis()
	_, err := streaming.RedisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("❌ Redis connection failed: %v", err)
	} else {
		fmt.Println("✅ Connected to Redis successfully!")
	}
	database.ConnectDatabase()
	if err := database.DB.AutoMigrate(&models.User{}, &models.Alert{}, &models.FraudActivity{}, &models.NotificationConfig{}); err != nil {
        log.Fatal("Migration failed:", err)
    }
	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	go streaming.MonitorNewWallets(ctx)

	r := mux.NewRouter()
	r.HandleFunc("/register", handlers.RegisterUser).Methods("POST")
	r.HandleFunc("/login", handlers.LoginUser).Methods("POST")
	// JWT Authentication Middleware
	api := r.PathPrefix("/api").Subrouter()
	api.Use(middleware.JWTAuthMiddleware)
	api.HandleFunc("/create-alert", handlers.CreateAlert).Methods("POST")
	api.HandleFunc("/alerts", handlers.GetUserAlerts).Methods("GET")
	api.HandleFunc("/notification-configs", handlers.GetUserNotificationConfigs).Methods("GET")
	api.HandleFunc("/notification-configs", handlers.CreateNotificationConfig).Methods("POST")
	api.HandleFunc("/notification-configs/{id}", handlers.DeleteNotificationConfig).Methods("DELETE")
	api.HandleFunc("/fraud-activities", handlers.GetFraudActivities).Methods("GET")

	handler := corsOptions.Handler(r)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("🚀 Server running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
