package booking

import (
	"errors"
)

var (
	SeatAlreadyOccupied = errors.New("Seat is already occupied!")
)

type Booking struct {
	ID      string
	UserId  string
	MovieId string
	SeatId  string
	Status  string
}

type BookingStore interface {
	Book(b Booking) error
	ListBookings(MovieId string) []Booking
}
