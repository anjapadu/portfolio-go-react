package models

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {

	// https://github.com/go-gorm/postgres
	database, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  "user=postgres password=12345678 dbname=marketplace port=5432 sslmode=disable host=127.0.0.1",
		PreferSimpleProtocol: true, // disables implicit prepared statement usage
	}), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}
	database.Debug().Exec(`
	DO $$ BEGIN
		CREATE TYPE product_category_enum AS ENUM ('TICKETS', 'ART', 'JEWELRY', 'COLLECTIBLES', 'FURNITURE', 'ANTIQUES', 'ELECTRONICS', 'BEAUTY', 'GAMES', 'HOME', 'WATCHES');
	EXCEPTION
		WHEN duplicate_object THEN null;
	END $$;`)
	database.Debug().Exec(`
	DO $$ BEGIN
		CREATE TYPE product_status_enum AS ENUM ('SCHEDULED', 'STARTED', 'SOLD', 'CANCELLED');
	EXCEPTION
		WHEN duplicate_object THEN null;
	END $$;`)
	database.Debug().Exec(`
	DO $$ BEGIN
		CREATE TYPE auction_type_enum AS ENUM ('NORMAL', 'BLIND');
	EXCEPTION
		WHEN duplicate_object THEN null;
	END $$;`)
	database.Debug().Exec(`
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
	`)
	err = database.AutoMigrate(&User{}, &Role{}, &ProductAuction{}, &ProductPhoto{}, &Bid{}, &Comment{})
	if err != nil {
		return
	}

	DB = database
}
