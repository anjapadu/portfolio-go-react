package controllers

import (
	"fmt"
	"gyanceportfolio/models"
	"gyanceportfolio/streams"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func FindProductAuctions(context *gin.Context) {
	var products []models.ProductAuction
	subQuery1 := models.DB.Model(&models.Bid{}).Where("product_auction_id = product_auctions.id").Select("COUNT(1)")
	subQuery2 := models.DB.Model(&models.Comment{}).Where("product_auction_id = product_auctions.id").Select("COUNT(1)")
	models.DB.Debug().Select("(?) as bid_count, (?) as comments_count, *", subQuery1, subQuery2).Preload("Photos").Order("updated_at desc").Find(&products)
	context.JSON(http.StatusOK, products)
}

func FindProductById(context *gin.Context) {
	var product models.ProductAuction
	subQuery1 := models.DB.Model(&models.Bid{}).Where("product_auction_id = product_auctions.id").Select("COUNT(1)")
	subQuery2 := models.DB.Model(&models.Comment{}).Where("product_auction_id = product_auctions.id").Select("COUNT(1)")
	models.DB.Debug().Select("(?) as bid_count, (?) as comments_count, *", subQuery1, subQuery2).Preload("Photos").Preload("Comments").Where("id = ?", context.Param("id")).Find(&product)
	context.JSON(http.StatusOK, product)
}

func StreamProductDataById(c *gin.Context) {
	v, ok := c.Get("clientChan2")
	if !ok {
		return
	}
	clientChan, ok := v.(streams.ClientChan)
	if !ok {
		return
	}
	c.Stream(func(w io.Writer) bool {
		// Stream message to client from message channel
		if msg, ok := <-clientChan; ok {
			prefix := c.Param("id")
			if strings.HasPrefix(msg, prefix) {
				c.SSEvent("message", msg)
			}
			return true
		}
		return false
	})
}

func StreamProductsPriceUpdate(c *gin.Context) {
	v, ok := c.Get("clientChan")
	if !ok {
		return
	}
	clientChan, ok := v.(streams.ClientChan)
	if !ok {
		return
	}
	c.Stream(func(w io.Writer) bool {
		// Stream message to client from message channel
		if msg, ok := <-clientChan; ok {
			fmt.Println("SENT MESSAGE HERE", msg)
			c.SSEvent("message", msg)
			return true
		}
		return false
	})
}
