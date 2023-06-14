package main

import (
	"encoding/json"
	"fmt"
	"gyanceportfolio/models"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/shopspring/decimal"
)

type Photos struct {
	url string
}

type Product struct {
	Name         string
	Description  string
	CurrentPrice decimal.Decimal
	StartPrice   decimal.Decimal
	photos       Photos
}

func main() {
	models.ConnectDatabase()
	// Create user
	models.DB.Exec("TRUNCATE TABLE users CASCADE;")
	models.DB.Exec("TRUNCATE TABLE product_auctions CASCADE;")
	models.DB.Exec("TRUNCATE TABLE roles CASCADE;")
	// Create roles
	roles := []models.Role{
		{RoleName: "BUYER"},
		{RoleName: "SELLER"},
		{RoleName: "ADMIN"},
	}
	for _, element := range roles {
		models.DB.Create(&element)
	}
	var buyer models.Role
	var seller models.Role

	models.DB.Where("role_name = ?", "BUYER").First(&buyer)
	models.DB.Where("role_name = ?", "SELLER").First(&seller)

	user := models.User{FirstName: "Gustavo", LastName: "Yance", Password: "ferret", Email: "gusyancab@gmail.com", Roles: []models.Role{
		buyer,
		seller,
	}}
	user.HashPassword(user.Password)
	models.DB.Create(&user)

	absPath, _ := filepath.Abs("./seeds/products.json")
	jsonFile, err := os.Open(absPath)
	if err != nil {
		fmt.Println(err)
	}
	defer jsonFile.Close()
	byteResult, _ := ioutil.ReadAll(jsonFile)
	var products []models.ProductAuction
	json.Unmarshal(byteResult, &products)
	for _, element := range products {
		models.DB.Create((&element))
	}
}
