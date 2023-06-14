package controllers

import (
	"encoding/json"
	"fmt"
	"gyanceportfolio/auth"
	"gyanceportfolio/rabbit"
	"gyanceportfolio/streams"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BidStruct struct {
	NewPrice  float32 `json:"newPrice"`
	ProductId string  `json:"productId"`
	UserId    string  `json:"userId"`
}

func Bid(context *gin.Context) {
	var newBid BidStruct
	context.ShouldBindJSON(&newBid)
	claims, _ := context.Get("claims")
	fmt.Println(claims)
	newBid.UserId = claims.(*auth.JWTClaim).ID
	newBid.ProductId = context.Param("id")
	stringBid, _ := json.Marshal(newBid)
	rabbit.SendToQueue(string(stringBid))
	context.Status(http.StatusOK)
}

type NewBidAccepted struct {
	UserID    string  `json:"userId"`
	ProductID string  `json:"productId"`
	NewPrice  float32 `json:"newPrice"`
	BidCount  int     `json:"bidCount"`
}

type BidStreamProductsData struct {
	CurrentPrice float32 `json:"currentPrice"`
	BidCount     int     `json:"bidCount"`
}

func BidAccepted(streamProductId *streams.Event, streamProducts *streams.Event) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		var data NewBidAccepted
		c.BindJSON(&data)
		responseObject, _ := json.Marshal(data)
		streamProductId.Message <- fmt.Sprintf("%s|%s", data.ProductID, responseObject)
		var bidStreamProductsData BidStreamProductsData
		bidStreamProductsData.BidCount = data.BidCount
		bidStreamProductsData.CurrentPrice = data.NewPrice
		responseData, _ := json.Marshal(bidStreamProductsData)
		streamProducts.Message <- fmt.Sprintf("%s|%s", data.ProductID, responseData)
	}

	return gin.HandlerFunc(fn)
}
