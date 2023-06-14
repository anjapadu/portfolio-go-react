package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Bid struct {
	ID               uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	UserID           uuid.UUID
	ProductAuctionID uuid.UUID       `json:"productAuctionId"`
	Amount           decimal.Decimal `json:"amount" gorm:"null;type:decimal(20,2)"`
	CreatedAt        time.Time       `json:"createdAt"`
	UpdatedAt        time.Time       `json:"updatedAt"`
}
