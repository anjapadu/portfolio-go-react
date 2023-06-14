package models

import (
	"github.com/google/uuid"
)

type Role struct {
	ID       uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	RoleName string    `json:"roleName" gorm:"notNull"`
}
