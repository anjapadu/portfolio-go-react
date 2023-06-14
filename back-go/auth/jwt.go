package auth

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/exp/slices"
)

var jwtKey = []byte("supersecretkey")

type JWTClaim struct {
	Roles    []string `json:"roles"`
	Email    string   `json:"email"`
	FirsName string   `json:"firstName"`
	LastName string   `json:"lasttName"`
	ID       string   `json:"useId"`
	jwt.StandardClaims
}

func GenerateJWT(email string, roles []string, firstName string, lastName string, id string) (tokenString string, err error) {
	expirationTime := time.Now().Add(1 * time.Hour)
	claims := &JWTClaim{
		Email:    email,
		Roles:    roles,
		FirsName: firstName,
		LastName: lastName,
		ID:       id,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString(jwtKey)
	return
}
func ValidateToken(signedToken string, roles []string) (claims *JWTClaim, err error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JWTClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKey), nil
		},
	)
	if err != nil {
		return
	}
	claims, ok := token.Claims.(*JWTClaim)
	if !ok {
		err = errors.New("couldn't parse claims")
		return
	}
	if claims.ExpiresAt < time.Now().Local().Unix() {
		err = errors.New("token expired")
		return
	}
	if len(roles) > 0 {
		if !HasPermission(roles, claims.Roles) {
			err = errors.New("unauthorized")
			return
		}
	}
	return claims, nil
}

func HasPermission(roles []string, userRoles []string) bool {
	for _, userRole := range userRoles {
		hasPermission := slices.Contains(roles, userRole)
		if hasPermission {
			return true
		}
	}
	return false
}
