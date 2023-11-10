package main

import (
	"gyanceportfolio/auth"
	"gyanceportfolio/controllers"
	"gyanceportfolio/middlewares"
	"gyanceportfolio/models"
	"gyanceportfolio/streams"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	streamProducts := streams.NewServer("product_list")
	streamProductId := streams.NewServer("product_by_id")
	models.ConnectDatabase()
	api := r.Group("/api")
	{
		api.POST("/bid-accepted", controllers.BidAccepted(streamProductId, streamProducts))
		api.GET("/price-update", HeadersMiddleware(), streamProducts.ServeHTTP("clientChan"), controllers.StreamProductsPriceUpdate)
		api.GET("/stream/product/:id", HeadersMiddleware(), streamProductId.ServeHTTP("clientChan2"), controllers.StreamProductDataById)
		api.GET("/products-simple", controllers.FindProductAuctionsSimple)
		api.GET("/products", controllers.FindProductAuctions)
		api.POST("/comment", middlewares.Auth("BUYER", "SELLER", "ADMIN"), controllers.CreateComment(streamProductId, streamProducts))
		api.GET("/product/:id", controllers.FindProductById)
		api.GET("/product/:id/comments", controllers.FindComments)
		api.POST("/log-in", controllers.GenerateToken)
		api.POST("/sign-up", controllers.RegisterUser)
		api.POST("/bid/:id", middlewares.Auth("BUYER"), controllers.Bid)
		api.GET("/validate", middlewares.Auth(), func(c *gin.Context) {
			claims, _ := c.Get("claims")
			fullName := (claims.(*auth.JWTClaim)).FirsName + " " + (claims.(*auth.JWTClaim)).LastName
			c.JSON(http.StatusOK, gin.H{"fullName": fullName, "email": (claims.(*auth.JWTClaim)).Email, "id": (claims.(*auth.JWTClaim)).ID})
		})
	}
	r.Run(":4000")
}

func HeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Content-Type", "text/event-stream")
		c.Writer.Header().Set("Cache-Control", "no-cache")
		c.Writer.Header().Set("Connection", "keep-alive")
		c.Writer.Header().Set("Transfer-Encoding", "chunked")
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Next()
	}
}
