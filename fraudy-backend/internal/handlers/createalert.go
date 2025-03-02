package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"fraudy-backend/internal/database"
	"fraudy-backend/internal/models"
)

// CreateAlert handles creating a new alert
func CreateAlert(w http.ResponseWriter, r *http.Request) {
    var req models.Alert
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    userID, ok := r.Context().Value("user_id").(int)
    if !ok {
        fmt.Println("❌ Could not extract user_id from JWT")
        http.Error(w, "Unauthorized: Unable to extract user ID", http.StatusUnauthorized)
        return
    }
    alert := models.Alert{
        UserID:                 userID, 
        AlertName:              req.AlertName,
        RuleType:               req.RuleType,
        WalletID:               req.WalletID,
        NotificationPreferences: req.NotificationPreferences,
        TransactionThreshold: req.TransactionThreshold,
        TimeFrame:             req.TimeFrame,
        TransactionStatus:         req.TransactionStatus,
    }
    fmt.Printf("📝 Saving Alert: %+v\n", alert)
    result := database.DB.Create(&alert)
    if result.Error != nil {
        fmt.Println("❌ Error saving alert:", result.Error)
        http.Error(w, "Error saving alert", http.StatusInternalServerError)
        return
    }

    fmt.Println("✅ Alert saved successfully:", alert)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"message": "Alert created successfully"})
}
