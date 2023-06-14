package models

import (
	"time"

	"github.com/google/uuid"
)

type ProductPhoto struct {
	ID               uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Url              string    `json:"url" gorm:"notNull"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
	ProductAuctionID uuid.UUID `json:"productAuctionId"`
}
