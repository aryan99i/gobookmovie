package booking

import (
	"errors"
	"time"
)

var (
	SeatAlreadyOccupied = errors.New("Seat is already occupied!")
)

type Booking struct {
	ID        string
	UserId    string
	MovieId   string
	SeatId    string
	Status    string
	ExpiresAt time.Time
}

type BookingStore interface {
	Book(b Booking) (Booking, error)
	ListBookings(MovieId string) []Booking
}
