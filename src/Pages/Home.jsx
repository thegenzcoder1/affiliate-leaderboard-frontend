// src/Pages/Home.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../Components/Pagination.jsx';
import { fetchLeaderboard } from '../services/leaderboard.service';

const PAGE_SIZE = 10;

export default function Home() {
  const [params, setParams] = useSearchParams();
  const offset = Math.max(0, parseInt(params.get('offset') || '0', 10) || 0);

  const [items, setItems] = useState([]);  // raw items from API
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Navigate via query string (same UX you already have)
  const go = (newOffset) => {
    const clamped = Math.max(0, Math.min(newOffset, Math.max(0, total - PAGE_SIZE)));
    setParams({ offset: String(clamped) }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const onPrev = () => go(offset - PAGE_SIZE);
  const onNext = () => go(offset + PAGE_SIZE);

  // Fetch page data from API whenever offset changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const res = await fetchLeaderboard({ offset, limit: PAGE_SIZE });
        const serverItems = Array.isArray(res?.data) ? res.data : [];
        if (!mounted) return;
        setItems(serverItems);
        setTotal(res?.pagination?.total ?? serverItems.length);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || 'Failed to load leaderboard.');
        setItems([]);
        setTotal(0);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [offset]);

  // Guard: ensure offset isn’t beyond last page if user types a random value
  useEffect(() => {
    const maxOffset = Math.max(0, total - PAGE_SIZE);
    if (offset > maxOffset && total >= 0) {
      setParams({ offset: String(maxOffset) }, { replace: true });
    }
  }, [offset, total, setParams]);

  // --- UI states ---
  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-2xl border border-amber-200/60 bg-white/80 backdrop-blur shadow-xl shadow-amber-900/5 dark:bg-slate-900/60 dark:border-slate-700 p-6 md:p-8">
          <header className="mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-900 dark:text-amber-300">Leaderboard</h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">Business Partner Leader Board.</p>
          </header>
          <div className="text-slate-700 dark:text-slate-300">Loading…</div>
        </section>
      </main>
    );
  }

  if (err) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-2xl border border-amber-200/60 bg-white/80 backdrop-blur shadow-xl shadow-amber-900/5 dark:bg-slate-900/60 dark:border-slate-700 p-6 md:p-8">
          <header className="mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-900 dark:text-amber-300">Leaderboard</h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">Business Partner Leader Board.</p>
          </header>
          <div className="text-red-600 dark:text-red-400">{err}</div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-2xl border border-amber-200/60 bg-white/80 backdrop-blur shadow-xl shadow-amber-900/5 dark:bg-slate-900/60 dark:border-slate-700 p-6 md:p-8">
        <header className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-amber-900 dark:text-amber-300">Leaderboard</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">Business Partner Leader Board.</p>
        </header>

        {/* 
          Layout strategy:
          - Mobile: 1 column list
          - MD/LG: 2 columns grid
          - XL+: column-flow with 2 rows per column (max 2 cards per column).
                 With 10 per page, you'll see ~5 columns × 2 rows.
        */}
        <div
          className="
          grid gap-4 
          grid-cols-1 
          sm:grid-cols-1 
          md:grid-cols-2 
          "
        >
          {items.map((u, idx) => {
            const rank = offset + idx + 1;
            return (
              <div
                key={`${u.instagramUsername || 'user'}-${rank}`}
                className="rounded-xl border border-amber-200/60 bg-white/90 p-4 shadow-sm
          dark:bg-slate-900/70 dark:border-slate-700"
              >
                {/* Header: Username + Rank */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-500
                ring-2 ring-amber-200 dark:ring-slate-700 grid place-items-center text-sm font-bold text-slate-900"
                    >
                      #{rank}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {u.instagramUsername || '—'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Followers: {u.followersCount ?? 0}
                      </div>
                    </div>
                  </div>
                  <div className="text-amber-900 dark:text-amber-300 font-extrabold">
                    {typeof u.totalPoints === 'number' ? u.totalPoints : 0} pts
                  </div>
                </div>

                {/* Body: all details */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Detail label="Order Points" value={u.orderPoints ?? 0} />
                  <Detail label="Premium Points" value={u.premiumPoints ?? 0} />
                  <Detail label="Consistency Points" value={u.consistencyPoints ?? 0} />
                  <Detail label="Total Points" value={u.totalPoints ?? 0} />
                </div>
              </div>
            );
          })}
        </div>

        <Pagination
          offset={offset}
          pageSize={PAGE_SIZE}
          total={total}
          onPrev={onPrev}
          onNext={onNext}
        />
      </section>
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg border border-amber-200/60 bg-white/70 p-3
      dark:bg-slate-900/60 dark:border-slate-700">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}