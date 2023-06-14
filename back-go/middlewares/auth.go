package middlewares

import (
	"gyanceportfolio/auth"

	"github.com/gin-gonic/gin"
)

func Auth(roles ...string) gin.HandlerFunc {
	return func(context *gin.Context) {
		tokenString := context.GetHeader("Authorization")
		if tokenString == "" {
			context.JSON(401, gin.H{"error": "unauthorized"})
			context.Abort()
			return
		}
		claims, err := auth.ValidateToken(tokenString, roles)
		if err != nil {
			context.JSON(401, gin.H{"error": err.Error()})
			context.Abort()
			return
		}
		context.Set("claims", claims)
		context.Next()
	}
}
