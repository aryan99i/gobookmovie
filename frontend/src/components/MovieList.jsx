export default function MovieList({ movies, selectedMovie, onSelect }) {
  return (
    <div className="flex flex-wrap gap-4">
      {movies.map((m) => {
        const isSelected = selectedMovie?.id === m.id;
        return (
          <div
            key={m.id}
            onClick={() => onSelect(m)}
            className={`cursor-pointer min-w-[200px] p-5 rounded-xl border transition-all duration-200 shadow-sm
              ${
                isSelected
                  ? "bg-zinc-800 border-sky-400 shadow-sky-900/20"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/80"
              }`}
          >
            <h3 className={`font-semibold text-lg mb-1 ${isSelected ? "text-sky-300" : "text-zinc-200"}`}>
              {m.title}
            </h3>
            <p className="text-xs text-zinc-500">
              {m.rows} rows &times; {m.seats_per_row} seats
            </p>
          </div>
        );
      })}
    </div>
  );
}
