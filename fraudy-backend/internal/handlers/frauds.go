package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"fraudy-backend/internal/database"
	"fraudy-backend/internal/models"
)

func GetFraudActivities(w http.ResponseWriter, r *http.Request) {
	var fraudActivities []models.FraudActivity
	result := database.DB.Order("created_at DESC").Find(&fraudActivities)
	if result.Error != nil {
		http.Error(w, "Failed to fetch fraud activities", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(fraudActivities)
	fmt.Println("✅ Fraud activities fetched successfully!")
}
