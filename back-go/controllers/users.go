package controllers

import (
	"gyanceportfolio/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateUserInput struct {
	FirstName string    `json:"firstName" binding:"required"`
	LastName  string    `json:"lastName" binding:"required"`
	Email     string    `json:"email" binding:"required"`
	Birthday  time.Time `json:"birthday"`
	Password  string    `json:"password" binding:"required"`
}

func RegisterUser(context *gin.Context) {
	var user models.User

	if err := context.ShouldBindJSON(&user); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()
		return
	}
	var count int64
	models.DB.Model(&user).Where("email =  ?", user.Email).Count(&count)
	if count > 0 {
		context.JSON(http.StatusConflict, gin.H{"error": "This email is already registered"})
		return
	}
	if err := user.HashPassword(user.Password); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()
		return
	}
	var role models.Role
	models.DB.Debug().Where("role_name = ?", "BUYER").First(&role)
	user.Roles = []models.Role{role}
	record := models.DB.Create(&user)
	if record.Error != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": record.Error.Error()})
		context.Abort()
		return
	}
	context.JSON(http.StatusCreated, gin.H{"success": true})
}
