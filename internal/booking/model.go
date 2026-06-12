package booking

import (
	"context"
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

	Confirm(ctx context.Context, sessionID string, userID string) (Booking, error)
	Release(ctx context.Context, sessionID string, userID string) error
}
