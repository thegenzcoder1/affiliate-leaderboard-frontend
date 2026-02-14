export default function Pagination({ offset, pageSize, total, onPrev, onNext }) {
  const start = total === 0 ? 0 : offset + 1;
  const end = Math.min(offset + pageSize, total);
  const hasPrev = offset > 0;
  const hasNext = offset + pageSize < total;

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-slate-600 dark:text-slate-300">
        Showing <span className="font-semibold">{start}</span>–<span className="font-semibold">{end}</span> of <span className="font-semibold">{total}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="rounded-md border border-amber-200/60 bg-white/80 px-3 py-2 text-sm
            text-slate-700 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed
            dark:bg-slate-900/60 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="rounded-md bg-amber-900 px-3 py-2 text-sm font-semibold text-white
            hover:bg-[#641823] disabled:opacity-50 disabled:cursor-not-allowed
            dark:bg-amber-500 dark:hover:bg-amber-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}