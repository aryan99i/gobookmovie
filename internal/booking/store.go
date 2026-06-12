package booking

type Store struct {
	bookings map[string]Booking
}

func NewStore() *Store {
	return &Store{
		bookings: make(map[string]Booking),
	}

}

func (s *Store) Book(b Booking) (Booking, error) {
	if _, exists := s.bookings[b.SeatId]; exists {
		return Booking{}, SeatAlreadyOccupied
	}

	s.bookings[b.SeatId] = b
	return b, nil

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
