package controllers

import (
	"encoding/json"
	"fmt"
	"gyanceportfolio/models"
	"gyanceportfolio/streams"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type User struct {
	ID        string `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}
type Comment struct {
	User             User   `json:"user"`
	ID               string `json:"id"`
	Text             string `json:"text"`
	UserID           string `json:"userId"`
	ProductAuctionID string `json:"productAuctionId"`
	CreatedAt        string `json:"createdAt"`
}

func FindComments(c *gin.Context) {
	var comments []Comment
	models.DB.Debug().Joins("User").Where("product_auction_id = ?", c.Param("id")).Order("comments.created_at DESC").Find(&comments)
	c.JSON(http.StatusOK, comments)
}

type Marshaler interface {
	MarshalJSON() ([]byte, error)
}

type CommentInput struct {
	Text      string `json:"text"`
	UserId    string `json:"userId"`
	ProductId string `json:"productId"`
}

type CommentCount struct {
	CommentsCount int64 `json:"commentsCount"`
}

func CreateComment(streamProductId *streams.Event, streamProducts *streams.Event) gin.HandlerFunc {
	fn := func(context *gin.Context) {
		var commentInput CommentInput
		if err := context.ShouldBindJSON(&commentInput); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			context.Abort()
			return
		}
		var comment models.Comment
		comment.Text = commentInput.Text
		comment.UserID = uuid.MustParse(commentInput.UserId)
		comment.ProductAuctionID = uuid.MustParse((commentInput.ProductId))
		models.DB.Create(&comment)
		var user models.User
		models.DB.Debug().Select("first_name", "last_name", "id").Where("id = ?", comment.UserID).First(&user)
		var count int64
		models.DB.Model(&models.Comment{}).Where("product_auction_id = ?", commentInput.ProductId).Count(&count)
		comment.User = user
		// models.DB.Joins("User").Where("id = ?", comment.)
		comment.IsComment = true
		stringJson, _ := json.Marshal(&comment)
		var commentCount CommentCount
		commentCount.CommentsCount = count
		countStringJson, _ := json.Marshal(&commentCount)
		streamProductId.Message <- fmt.Sprintf("%s|%s", comment.ProductAuctionID, stringJson)
		streamProducts.Message <- fmt.Sprintf("%s|%s", comment.ProductAuctionID, countStringJson)
		context.JSON(http.StatusCreated, gin.H{"success": true, "comment": &comment})
	}
	return gin.HandlerFunc(fn)
}
