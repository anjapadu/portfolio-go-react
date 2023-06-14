package streams

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

type ClientChan chan string

func (stream *Event) ServeHTTP(clientChanName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Initialize client channel
		clientChan := make(ClientChan)
		// Send new connection to event server
		stream.NewClients <- clientChan
		defer func() {
			// Send closed connection to event server
			stream.ClosedClients <- clientChan
		}()
		c.Set(clientChanName, clientChan)
		c.Next()
	}
}

func NewServer(name string) (event *Event) {
	event = &Event{
		Message:       make(chan string),
		NewClients:    make(chan chan string),
		ClosedClients: make(chan chan string),
		TotalClients:  make(map[chan string]bool),
	}

	go event.listen(name)
	return
}

type Event struct {
	Message       chan string
	NewClients    chan chan string
	ClosedClients chan chan string
	TotalClients  map[chan string]bool
}

// It Listens all incoming requests from clients.
// Handles addition and removal of clients and broadcast messages to clients.
func (stream *Event) listen(name string) {
	for {
		select {
		// Add new available client
		case client := <-stream.NewClients:
			stream.TotalClients[client] = true
			log.Printf("Client added to %s. %d registered clients", name, len(stream.TotalClients))
			fmt.Println(client)

		// Remove closed client
		case client := <-stream.ClosedClients:
			delete(stream.TotalClients, client)
			close(client)
			log.Printf("Removed client to %s. %d registered clients", name, len(stream.TotalClients))

		// Broadcast message to client
		case eventMsg := <-stream.Message:
			for clientMessageChan := range stream.TotalClients {
				clientMessageChan <- eventMsg
			}
		}
	}
}
