package main

import (
	"goprojv2/internal/adapters/redis"
	"goprojv2/internal/booking"
	"goprojv2/internal/utils"
	"log"
	"net/http"
)

func main() {

	mux := http.NewServeMux()

	mux.HandleFunc("GET /movies", listMovies)

	store := booking.NewRedisStore(redis.NewClient("localhost:6379"))
	svc := booking.NewService(store)

	bookingHandler := booking.NewHandler(svc)

	mux.HandleFunc("GET /movies/{movieId}/seats", bookingHandler.ListSeats)
	mux.HandleFunc("POST /movies/{movieId}/seats/{seatId}/hold", bookingHandler.HoldSeat)

	if err := http.ListenAndServe(":8000", mux); err != nil {
		log.Fatal("Error with server")
	}
}

type MovieResponse struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Rows        int    `json:"rows"`
	SeatsPerRow int    `json:"seats_per_row"`
}

var movies = []MovieResponse{
	{ID: "inception", Title: "Inception", Rows: 5, SeatsPerRow: 8},
	{ID: "dune", Title: "Dune: Part Two", Rows: 4, SeatsPerRow: 6},
}

func listMovies(w http.ResponseWriter, r *http.Request) {
	utils.WriteJSON(w, http.StatusOK, movies)
}
