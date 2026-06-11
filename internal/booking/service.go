package booking

type Service struct {
	st *ConcurrentStore
}

func NewService(st *ConcurrentStore) *Service {
	return &Service{st}
}

func (s *Service) Book(b Booking) error {
	return s.st.Book(b)

}

func (s *Service) ListBookings(MovieId string) []Booking {
	return s.st.ListBookings(MovieId)
}
