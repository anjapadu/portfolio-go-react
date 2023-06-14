package models

import (
	"time"

	"github.com/google/uuid"
)

type Comment struct {
	ID               uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	User             User      `json:"user"`
	UserID           uuid.UUID `json:"userId"`
	ProductAuctionID uuid.UUID `json:"productAuctionId"`
	Text             string    `json:"text"`
	CreatedAt        time.Time `json:"createdAt"`
	IsComment        bool      `json:"isComment" gorm:"-" `
}
