package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"gyanceconsumego/models"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/shopspring/decimal"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

type BidStruct struct {
	NewPrice  float32 `json:"newPrice"`
	ProductId string  `json:"productId"`
	UserId    string  `json:"userId"`
}

type NewBidAccepted struct {
	UserID    string  `json:"userId"`
	ProductID string  `json:"productId"`
	NewPrice  float32 `json:"newPrice"`
	BidCount  int     `json:"bidCount"`
}

func main() {
	models.ConnectDatabase() // new
	conn, err := amqp.Dial("amqp://rabbit:12345678@localhost:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()
	msgs, err := ch.Consume(
		"bids-queue", // queue
		"",           // consumer
		true,         // auto-ack
		false,        // exclusive
		false,        // no-local
		true,         // no-wait
		nil,          // args
	)
	failOnError(err, "Failed to register a consumer")
	var forever chan struct{}
	go func() {
		for d := range msgs {
			log.Printf("New bid [x] %s", d.Body)
			var bidObject BidStruct
			json.Unmarshal(d.Body, &bidObject)
			var product models.ProductAuction
			models.DB.Preload("Bids").Where("id = ?", bidObject.ProductId).First(&product)
			fmt.Println(product)
			if bidObject.NewPrice <= product.CurrentPrice {
				fmt.Println("Bid invalid price.")
			} else {
				models.DB.Debug().Model(&models.ProductAuction{}).Preload("Bids").Where("id = ?", product.ID).Update("current_price", bidObject.NewPrice)
				productUUID, _ := uuid.Parse(bidObject.ProductId)
				userUUID, _ := uuid.Parse(bidObject.UserId)
				bid := models.Bid{
					UserID:           userUUID,
					ProductAuctionID: productUUID,
					Amount:           decimal.NewFromFloat32(bidObject.NewPrice),
				}
				models.DB.Create(&bid)
				newBidAccepted := NewBidAccepted{
					UserID:    bidObject.UserId,
					ProductID: bidObject.ProductId,
					NewPrice:  bidObject.NewPrice,
					BidCount:  len(product.Bids) + 1,
				}
				marshalled, _ := json.Marshal(newBidAccepted)
				req, err := http.NewRequest("POST", "http://localhost:4000/api/bid-accepted", bytes.NewReader(marshalled))
				if err != nil {
					log.Fatalf("impossible to build request: %s", err)
				}
				req.Header.Set("Content-Type", "application/json")
				client := http.Client{Timeout: 10 * time.Second}
				res, err := client.Do(req)
				if err != nil {
					log.Fatalf("impossible to send request: %s", err)
				}
				log.Printf("status Code: %d", res.StatusCode)
				defer res.Body.Close()
				resBody, err := io.ReadAll(res.Body)
				if err != nil {
					log.Fatalf("impossible to read all body of response: %s", err)
				}
				log.Printf("response: %s", string(resBody))
			}
		}
	}()
	log.Printf(" [*] Waiting for logs. To exit press CTRL+C")
	<-forever
}
