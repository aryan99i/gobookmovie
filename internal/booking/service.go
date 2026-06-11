package booking

type Service struct {
	store Store
}

func NewService(store Store) *Service {
	return &Service{store}
}

func (s *Service) Book(b Booking) error {
	return s.store.Book(b)

}

func (s *Service) ListBookings(MovieId string) []Booking {
	return s.store.ListBookings(MovieId)
}
