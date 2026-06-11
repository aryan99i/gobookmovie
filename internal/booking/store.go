package booking

type Store struct {
	bookings map[string]Booking
}

func NewStore() *Store {
	return &Store{
		bookings: make(map[string]Booking),
	}

}

func (s *Store) Book(b Booking) error {
	if _, exists := s.bookings[b.SeatId]; exists {
		return SeatAlreadyOccupied
	}

	s.bookings[b.SeatId] = b
	return nil

}
func (s *Store) ListBookings(MovieId string) []Booking {
	ans := make([]Booking, 0)

	for _, v := range s.bookings {
		if v.MovieId == MovieId {
			ans = append(ans, v)
		}

	}
	return ans

}
