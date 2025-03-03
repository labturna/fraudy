package handlers

import (
	"encoding/json"
	"net/http"
	"fraudy-backend/internal/database"
	"fraudy-backend/internal/models"
	"github.com/gorilla/mux"
)

type NotificationConfigRequest struct {
	ConfigName      string   `json:"config_name"`
	NotificationType string   `json:"notification_type"` // slack, email, telegram, discord
	SlackWebhook    string   `json:"slack_webhook,omitempty"`
	EmailSender     string   `json:"email_sender,omitempty"`
	EmailPassword   string   `json:"email_password,omitempty"`
	SMTPServer      string   `json:"smtp_server,omitempty"`
	SMTPPort        string   `json:"smtp_port,omitempty"`
	RecipientEmails []string `json:"recipient_emails,omitempty"`
	TelegramChatID  string   `json:"telegram_chat_id,omitempty"`
	DiscordChannel  string   `json:"discord_channel,omitempty"`
}

func CreateNotificationConfig(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized: Unable to extract user ID", http.StatusUnauthorized)
		return
	}

	var req NotificationConfigRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	// Convert recipient emails to JSON string
	recipientEmailsJSON, err := json.Marshal(req.RecipientEmails)
	if err != nil {
		http.Error(w, "Error encoding recipient emails", http.StatusInternalServerError)
		return
	}

	config := models.NotificationConfig{
		UserID:          userID,
		ConfigName:      req.ConfigName,
		NotificationType: req.NotificationType,
		SlackWebhook:    req.SlackWebhook,
		EmailSender:     req.EmailSender,
		EmailPassword:   req.EmailPassword,
		SMTPServer:      req.SMTPServer,
		SMTPPort:        req.SMTPPort,
		RecipientEmails: string(recipientEmailsJSON),
		TelegramChatID:  req.TelegramChatID,
		DiscordChannel:  req.DiscordChannel,
	}

	result := database.DB.Create(&config)
	if result.Error != nil {
		http.Error(w, "Error saving notification config", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Notification configuration saved successfully"})
}

func GetUserNotificationConfigs(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized: Unable to extract user ID", http.StatusUnauthorized)
		return
	}

	var configs []models.NotificationConfig
	result := database.DB.Where("user_id = ?", userID).Find(&configs)

	if result.Error != nil {
		http.Error(w, "Error fetching configurations", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(configs)
}

func DeleteNotificationConfig(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized: Unable to extract user ID", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	configID := vars["id"]

	var config models.NotificationConfig
	result := database.DB.Where("id = ? AND user_id = ?", configID, userID).First(&config)
	if result.Error != nil {
		http.Error(w, "Configuration not found or unauthorized", http.StatusNotFound)
		return
	}

	// Delete the configuration
	database.DB.Delete(&config)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Notification configuration deleted successfully"})
}
