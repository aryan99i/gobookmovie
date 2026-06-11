package booking

import (
	"sync"
)

type ConcurrentStore struct {
	bookings map[string]Booking
	sync.RWMutex
}

func NewConcurrentStore() *ConcurrentStore {
	return &ConcurrentStore{
		bookings: make(map[string]Booking),
	}

}

func (s *ConcurrentStore) Book(b Booking) error {
	s.Lock()
	defer s.Unlock()

	if _, exists := s.bookings[b.SeatId]; exists {
		return SeatAlreadyOccupied
	}

	s.bookings[b.SeatId] = b

	return nil

}

func (s *ConcurrentStore) ListBookings(MovieId string) []Booking {

	s.RLock()
	defer s.RUnlock()
	ans := make([]Booking, 0)

	for _, v := range s.bookings {
		if v.MovieId == MovieId {
			ans = append(ans, v)
		}

	}
	return ans

}
