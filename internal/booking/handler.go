package booking

import (
	"encoding/json"
	"goprojv2/internal/utils"
	"log"
	"net/http"
	"time"
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc}
}

func (h *Handler) ListSeats(w http.ResponseWriter, r *http.Request) {
	movieId := r.PathValue("movieId")

	bookings := h.svc.ListBookings(movieId)

	seats := make([]seatInfo, 0, len(bookings))
	for _, b := range bookings {
		seats = append(seats, seatInfo{
			SeatId:    b.SeatId,
			UserId:    b.UserId,
			Booked:    true,
			Confirmed: b.Status == "confirmed",
		})
	}

	utils.WriteJSON(w, http.StatusOK, seats)

}

type seatInfo struct {
	SeatId    string `json:"seat_id"`
	UserId    string `json:"user_id"`
	Booked    bool   `json:"booked"`
	Confirmed bool   `json:"confirmed"`
}

type holdSeatRequest struct {
	UserID string `json:"user_id"`
}

func (h *Handler) HoldSeat(w http.ResponseWriter, r *http.Request) {
	movieID := r.PathValue("movieId")
	seatID := r.PathValue("seatId")

	var req holdSeatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println(err)
		return
	}

	data := Booking{
		UserId:  req.UserID,
		SeatId:  seatID,
		MovieId: movieID,
	}

	session, err := h.svc.Book(data)
	if err != nil {
		log.Println(err)
		return
	}

	type holdResponse struct {
		SessionID string `json:"session_id"`
		MovieID   string `json:"movieID"`
		SeatID    string `json:"seat_id"`
		ExpiresAt string `json:"expires_at"`
	}

	utils.WriteJSON(w, http.StatusCreated, holdResponse{
		SeatID:    seatID,
		MovieID:   session.MovieId,
		SessionID: session.ID,
		ExpiresAt: session.ExpiresAt.Format(time.RFC3339),
	})
}
