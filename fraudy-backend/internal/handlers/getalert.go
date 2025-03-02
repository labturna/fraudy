package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"fraudy-backend/internal/database"
	"fraudy-backend/internal/models"
)

func GetUserAlerts(w http.ResponseWriter, r *http.Request) {
    userID, ok := r.Context().Value("user_id").(int)
    if !ok {
        fmt.Println("❌ Could not extract user_id from context") // Debugging
        http.Error(w, "Unauthorized: Unable to extract user ID", http.StatusUnauthorized)
        return
    }
    var alerts []models.Alert
    result := database.DB.Where("user_id = ?", userID).Find(&alerts)

    if result.Error != nil {
        fmt.Println("❌ Error fetching alerts:", result.Error) // Debugging
        http.Error(w, "Error fetching alerts", http.StatusInternalServerError)
        return
    }

    // Send response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(alerts)
}

