import { useState, useEffect } from "react";
import MovieList from "./components/MovieList";
import SeatGrid from "./components/SeatGrid";
import Checkout from "./components/Checkout";

function App() {
  const [userID] = useState(() => crypto.randomUUID().replace(/-/g, "").slice(0, 12));
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeSession, setActiveSession] = useState(null); // { sessionID, movieID, seatID, expiresAt }
  const [seatStatuses, setSeatStatuses] = useState([]);
  const [checkoutStatus, setCheckoutStatus] = useState(null); // { msg, type }

  useEffect(() => {
    fetch("/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data || []))
      .catch((err) => console.error(err));
  }, []);

  const fetchSeats = () => {
    if (!selectedMovie) return;
    fetch(`/movies/${selectedMovie.id}/seats`)
      .then((res) => {
        if (res.status === 204) return [];
        return res.json();
      })
      .then((data) => setSeatStatuses(data || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 2000);
    return () => clearInterval(interval);
  }, [selectedMovie]);

  const releaseActiveSession = async () => {
    if (!activeSession) return;
    try {
      const res = await fetch(`/sessions/${activeSession.sessionID}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userID }),
      });
      if (!res.ok) {
        throw new Error("Failed to release seat");
      }
      setActiveSession(null);
      setCheckoutStatus(null);
    } catch (e) {
      console.error(e);
      showStatus(e.message, "error");
    }
  };

  const handleMovieSelect = (movie) => {
    releaseActiveSession();
    setSelectedMovie(movie);
  };

  const showStatus = (msg, type) => {
    setCheckoutStatus({ msg, type });
    setTimeout(() => {
      setCheckoutStatus((prev) => (prev?.msg === msg ? null : prev));
    }, 3000);
  };

  const holdSeat = async (seatID) => {
    if (activeSession) return;
    try {
      const res = await fetch(`/movies/${selectedMovie.id}/seats/${seatID}/hold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userID }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to hold seat");

      setActiveSession({
        sessionID: data.session_id,
        movieID: data.movieID || selectedMovie.id,
        seatID: data.seat_id,
        expiresAt: new Date(data.expires_at),
      });
      fetchSeats();
    } catch (err) {
      showStatus(err.message, "error");
    }
  };

  const confirmSeat = async () => {
    if (!activeSession) return;
    try {
      const res = await fetch(`/sessions/${activeSession.sessionID}/confirm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userID }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to confirm");
      }
      setActiveSession(null);
      fetchSeats();
      showStatus("Confirmed!", "success");
    } catch (err) {
      showStatus(err.message, "error");
    }
  };

  const releaseSeat = async () => {
    if (!activeSession) return;
    await releaseActiveSession();
    fetchSeats();
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center pb-4 mb-8 border-b border-zinc-800">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Cinema Booking</h1>
        <div className="text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800 shadow-inner">
          user: <span className="font-mono text-zinc-300">{userID}</span>
        </div>
      </header>

      <MovieList movies={movies} selectedMovie={selectedMovie} onSelect={handleMovieSelect} />

      {selectedMovie && (
        <div className="flex flex-col lg:flex-row gap-8 items-start mt-10">
          <SeatGrid
            movie={selectedMovie}
            seatStatuses={seatStatuses}
            userID={userID}
            onHoldSeat={holdSeat}
          />
          
          <Checkout
            session={activeSession}
            status={checkoutStatus}
            onConfirm={confirmSeat}
            onRelease={releaseSeat}
            onExpire={() => {
              setActiveSession(null);
              fetchSeats();
              showStatus("Hold expired", "error");
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
