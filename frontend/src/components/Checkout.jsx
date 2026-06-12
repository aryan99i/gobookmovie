import { useState, useEffect } from "react";

export default function Checkout({ session, status, onConfirm, onRelease, onExpire }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!session) return;
    
    const updateTimer = () => {
      const now = Date.now();
      const expires = session.expiresAt.getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setRemaining(diff);
      
      if (diff <= 0) {
        onExpire();
      }
    };

    updateTimer();
    const intv = setInterval(updateTimer, 1000);
    return () => clearInterval(intv);
  }, [session, onExpire]);

  if (!session && !status) return null;

  return (
    <div className="w-[320px] shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-sky-500/10 blur-3xl rounded-full pointer-events-none" />

      {session && (
        <>
          <h3 className="text-sky-400 font-semibold mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Checkout
          </h3>
          
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between border-b border-zinc-800/50 pb-2">
              <span className="text-zinc-500">Movie</span>
              <span className="text-zinc-200 font-medium">{session.movieID}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/50 pb-2">
              <span className="text-zinc-500">Seat</span>
              <span className="text-amber-400 font-bold">{session.seatID}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-zinc-500">Session</span>
              <span className="text-zinc-400 font-mono text-xs">{session.sessionID.slice(0, 8)}...</span>
            </div>
          </div>

          <div className="bg-zinc-950/50 rounded-xl p-4 mb-6 border border-zinc-800/50">
            <div className="text-center text-xs text-zinc-500 uppercase tracking-widest mb-1">Time Remaining</div>
            <div className={`text-4xl font-bold font-mono text-center tracking-tight transition-colors duration-300 ${remaining < 60 ? 'text-red-500' : 'text-amber-500'}`}>
              {String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(5,150,105,0.2)]"
            >
              Confirm
            </button>
            <button
              onClick={onRelease}
              className="flex-1 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 border border-zinc-700 hover:border-red-500/50 text-zinc-300 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Release
            </button>
          </div>
        </>
      )}

      {status && (
        <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.msg}
        </div>
      )}
    </div>
  );
}
