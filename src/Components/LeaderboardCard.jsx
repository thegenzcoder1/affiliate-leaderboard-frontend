export default function LeaderboardCard({ item }) {
  const rankColors = item.rank === 1
    ? 'from-yellow-300 to-amber-400'
    : item.rank === 2
    ? 'from-slate-200 to-slate-300'
    : item.rank === 3
    ? 'from-amber-600 to-amber-700'
    : 'from-rose-100 to-amber-100 dark:from-slate-800 dark:to-slate-700';

  return (
    <div className="rounded-xl border border-amber-200/60 bg-white/90 p-4 shadow-sm
        dark:bg-slate-900/70 dark:border-slate-700">
      {/* Header: Rank badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ${rankColors}
              ring-2 ring-amber-200 dark:ring-slate-700 grid place-items-center text-sm font-bold text-slate-900`}>
            #{item.rank}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {item.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{item.city}</div>
          </div>
        </div>
        <div className="text-amber-900 dark:text-amber-300 font-extrabold">
          {item.points.toLocaleString()} pts
        </div>
      </div>
    </div>
  );
}