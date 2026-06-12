export default function SeatGrid({ movie, seatStatuses, userID, onHoldSeat }) {
  const statusMap = {};
  seatStatuses.forEach((s) => {
    statusMap[s.seat_id] = s;
  });

  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const rows = [];

  for (let r = 0; r < movie.rows; r++) {
    const seats = [];
    for (let s = 1; s <= movie.seats_per_row; s++) {
      const seatID = `${rowLabels[r]}${s}`;
      const info = statusMap[seatID];
      
      let stateClass = "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:scale-110 cursor-pointer border border-zinc-700";
      let isAvailable = true;

      if (info) {
        if (info.confirmed) {
          stateClass = "bg-red-900/80 text-red-300 border-red-800 cursor-not-allowed";
          isAvailable = false;
        } else if (info.booked && info.user_id === userID) {
          stateClass = "bg-amber-500 text-amber-950 font-bold border-amber-600 cursor-default shadow-[0_0_10px_rgba(245,158,11,0.3)]";
          isAvailable = false;
        } else if (info.booked) {
          stateClass = "bg-orange-800 text-orange-200 border-orange-700 cursor-not-allowed opacity-60";
          isAvailable = false;
        }
      }

      seats.push(
        <button
          key={seatID}
          onClick={() => isAvailable && onHoldSeat(seatID)}
          disabled={!isAvailable}
          className={`w-10 h-9 rounded-t-lg rounded-b-sm text-xs font-mono transition-all duration-200 ${stateClass}`}
        >
          {s}
        </button>
      );
    }

    rows.push(
      <div key={`row-${r}`} className="flex items-center gap-2">
        <div className="w-6 text-center text-xs text-zinc-600 font-bold">{rowLabels[r]}</div>
        {seats}
        <div className="w-6 text-center text-xs text-zinc-600 font-bold">{rowLabels[r]}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-[300px] bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/80 shadow-xl backdrop-blur-sm">
      <div className="text-center text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500 mb-3 font-semibold">
        Screen
      </div>
      <div className="h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent rounded-full mx-8 mb-10 shadow-[0_2px_20px_rgba(14,165,233,0.3)]" />
      
      <div className="flex flex-col items-center gap-3">
        {rows}
      </div>

      <div className="flex justify-center flex-wrap gap-6 mt-12 pt-6 border-t border-zinc-800/60">
        <LegendItem colorClass="bg-zinc-800 border border-zinc-700" label="Available" />
        <LegendItem colorClass="bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" label="Your Hold" />
        <LegendItem colorClass="bg-orange-800 opacity-60" label="Other Hold" />
        <LegendItem colorClass="bg-red-900/80" label="Confirmed" />
      </div>
    </div>
  );
}

function LegendItem({ colorClass, label }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400">
      <div className={`w-4 h-3.5 rounded-t-sm rounded-b-[1px] ${colorClass}`} />
      {label}
    </div>
  );
}
