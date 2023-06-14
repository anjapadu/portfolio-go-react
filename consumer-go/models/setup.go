package models

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	database, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  "user=postgres password=12345678 dbname=marketplace port=5432 sslmode=disable host=127.0.0.1",
		PreferSimpleProtocol: true,
	}), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}
	if err != nil {
		return
	}

	DB = database
}
