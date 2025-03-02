package services

import (
	"fraudy-backend/internal/database"
	"fraudy-backend/internal/models"
)

func CreateUser(user *models.User) error {
	return database.DB.Create(user).Error
}
