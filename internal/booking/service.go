package booking

type Service struct {
	st BookingStore
}

func NewService(st BookingStore) *Service {
	return &Service{st}
}

func (s *Service) Book(b Booking) (Booking, error) {
	return s.st.Book(b)

}

func (s *Service) ListBookings(MovieId string) []Booking {
	return s.st.ListBookings(MovieId)
}
