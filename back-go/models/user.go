package models

import (
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Roles     []Role    `json:"roles,omitempty" gorm:"many2many:user_roles;"`
	Bids      []Bid     `json:"bids,omitempty"`
	ID        uuid.UUID `json:"id,omitempty" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	FirstName string    `json:"firstName,omitempty" gorm:"notNull"`
	LastName  string    `json:"lastName,omitempty" gorm:"notNull"`
	Email     string    `json:"email,omitempty" gorm:"uniqueIndex;notNull"`
	Birthday  string    `json:"birthday,omitempty" gorm:"default:null"`
	Password  string    `json:"password,omitempty" gorm:"notNull"`
	CreatedAt string    `json:"-"`
	UpdatedAt string    `json:"-"`
}

func (user *User) HashPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}
	user.Password = string(bytes)
	return nil
}

func (user *User) CheckPassword(providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
	if err != nil {
		return err
	}
	return nil
}
