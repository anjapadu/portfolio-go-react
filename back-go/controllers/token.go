package controllers

import (
	"gyanceportfolio/auth"
	"gyanceportfolio/helpers"
	"gyanceportfolio/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TokenRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func GenerateToken(context *gin.Context) {
	var request TokenRequest
	var user models.User
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()
		return
	}
	// check if email exists and password is correct
	// record := models.DB.Preload("Roles").Debug().Where("email = ?", request.Email).Find(&user)
	record := models.DB.Debug().Preload("Roles").
		Joins("join user_roles ur on ur.user_id = users.id ").
		Joins("join roles on roles.id= ur.role_id").
		Where("email = ?", request.Email).
		Find(&user)
	if record.Error != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": record.Error.Error()})
		context.Abort()
		return
	}
	credentialError := user.CheckPassword(request.Password)
	if credentialError != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		context.Abort()
		return
	}
	rolesFn := func(item models.Role) string {
		return item.RoleName
	}
	roles := helpers.Map(user.Roles, rolesFn)
	tokenString, err := auth.GenerateJWT(user.Email, roles.([]string), user.FirstName, user.LastName, user.ID.String())
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()
		return
	}
	context.JSON(http.StatusOK, gin.H{"token": tokenString})
}
