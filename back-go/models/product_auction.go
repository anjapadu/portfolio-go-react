package models

import (
	"time"

	"github.com/google/uuid"
)

type Status string

const (
	SCHEDULED Status = "SCHEDULED"
	STARTED   Status = "STARTED"
	SOLD      Status = "SOLD"
	CANCELLED Status = "CANCELLED"
)

type Type string

const (
	BLIND  Type = "BLIND"
	NORMAL Type = "NORMAL"
)

type Category string

const (
	TICKETS      Category = "TICKETS"
	ART          Category = "ART"
	JEWELRY      Category = "JEWELRY"
	COLLECTIBLES Category = "COLLECTIBLES"
	FURNITURE    Category = "FURNITURE"
	ANTIQUES     Category = "ANTIQUES"
	ELECTRONICS  Category = "ELECTRONICS"
	BEAUTY       Category = "BEAUTY"
	GAMES        Category = "GAMES"
	HOME         Category = "HOME"
	WATCHES      Category = "WATCHES"
)

type ProductAuction struct {
	Photos       []ProductPhoto `json:"photos"`
	Comments     []Comment      `json:"comments"`
	Bids         []Bid          `json:"bids"`
	Category     Category       `json:"category" gorm:"type:product_category_enum;default:null"`
	ID           uuid.UUID      `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Name         string         `json:"name" gorm:"notNull"`
	Description  string         `json:"description" gorm:"notNull"`
	StartPrice   float32        `json:"startPrice" gorm:"notNull;type:decimal(20,2);"`
	CurrentPrice float32        `json:"currentPrice" gorm:"notNull;type:decimal(20,2)"`
	EndPrice     float32        `json:"endPrice" gorm:"null;type:decimal(20,2)"`
	Type         Type           `json:"type" gorm:"notNull;type:auction_type_enum;default:'NORMAL'"`
	Status       Status         `json:"status" gorm:"notNull;type:product_status_enum;default:'STARTED'"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`

	BidCount      int32 `json:"bidCount" gorm:"->"`
	CommentsCount int32 `json:"commentsCount" gorm:"->"`
}
