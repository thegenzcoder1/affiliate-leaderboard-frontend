// src/Pages/MyProfile.jsx
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getMe } from '../services/auth.service';
import { updateFollowersCount } from '../services/profile.service';

export default function MyProfile() {
  const { username: paramUsername } = useParams();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [me, setMe] = useState({
    instagramUsername: '',
    followersCount: 0,
    orderPoints: 0,
    premiumPoints: 0,
    consistencyPoints: 0,
    totalPoints: 0,
    leaderboardPlace: null,
  });

  // Followers edit state
  const [editingFollowers, setEditingFollowers] = useState(false);
  const [followersDraft, setFollowersDraft] = useState(0);
  const [savingFollowers, setSavingFollowers] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [originalFollowers, setOriginalFollowers] = useState(0); // keep original to revert after submit

  // NEW: confirmation modal toggle
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const res = await getMe(); // GET /leaderboard/user
        if (!mounted) return;
        const next = {
          instagramUsername: res?.instagramUsername || '',
          followersCount: res?.followersCount ?? 0,
          orderPoints: res?.orderPoints ?? 0,
          premiumPoints: res?.premiumPoints ?? 0,
          consistencyPoints: res?.consistencyPoints ?? 0,
          totalPoints: res?.totalPoints ?? 0,
          leaderboardPlace:
            typeof res?.leaderboardPlace === 'number' ? res.leaderboardPlace : null,
        };
        setMe(next);
        setFollowersDraft(next.followersCount);
        setOriginalFollowers(next.followersCount);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || 'Failed to load profile.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <section className="rounded-2xl border border-amber-200/60 bg-white/80 backdrop-blur
            shadow-xl shadow-amber-900/5 dark:bg-slate-900/60 dark:border-slate-700 p-6 md:p-8">
          <div className="text-slate-700 dark:text-slate-300">Loading…</div>
        </section>
      </main>
    );
  }

  if (err) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <section className="rounded-2xl border border-amber-200/60 bg-white/80 backdrop-blur
            shadow-xl shadow-amber-900/5 dark:bg-slate-900/60 dark:border-slate-700 p-6 md:p-8">
          <div className="text-red-600 dark:text-red-400">{err}</div>
        </section>
      </main>
    );
  }

  // Normalize URL if /profile/:username doesn't match the current user
  if (paramUsername && me.instagramUsername && paramUsername !== me.instagramUsername) {
    return <Navigate to={`/profile/${encodeURIComponent(me.instagramUsername)}`} replace />;
  }

  // Followers edit handlers
  const onFollowersChange = (e) => {
    // Only non-negative integers
    const raw = e.target.value.replace(/[^\d]/g, '');
    const val = raw === '' ? '' : Math.max(0, parseInt(raw, 10));
    setFollowersDraft(val);
  };

  const onFollowersSave = async () => {
    // This actually calls the API and then reverts visual value (submit-for-approval behavior)
    if (typeof followersDraft !== 'number' || isNaN(followersDraft)) return;
    if (followersDraft === me.followersCount) return;

    setSavingFollowers(true);
    setSaveMsg('');
    setErr('');
    try {
      await updateFollowersCount(me.instagramUsername, followersDraft);

      // Revert UI to original value because update goes for approval
      setFollowersDraft(originalFollowers);
      setMe(prev => ({ ...prev, followersCount: originalFollowers }));
      setEditingFollowers(false);

      setSaveMsg('Followers update submitted for approval.');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to update followers.');
    } finally {
      setSavingFollowers(false);
    }
  };

  const onFollowersCancel = () => {
    setFollowersDraft(me.followersCount);
    setEditingFollowers(false);
    setErr('');
  };

  const isFollowersChanged =
    typeof followersDraft === 'number' && followersDraft !== me.followersCount;
  const isFollowersValid =
    followersDraft !== '' && typeof followersDraft === 'number' && followersDraft >= 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <section className="rounded-2xl border border-amber-200/60 bg-white/80 backdrop-blur
          shadow-xl shadow-amber-900/5 dark:bg-slate-900/60 dark:border-slate-700 p-6 md:p-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500
                ring-2 ring-amber-200 dark:ring-slate-700 grid place-items-center text-slate-900 font-bold">
              #{me.leaderboardPlace}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-amber-900 dark:text-amber-300">
                My Profile
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {me.instagramUsername || '—'}
              </p>
            </div>
          </div>
        </header>

        {/* Banners */}
        {saveMsg && (
          <div className="mt-4 rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200">
            {saveMsg}
          </div>
        )}
        {err && (
          <div className="mt-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-300">
            {err}
          </div>
        )}

        {/* Metrics */}
        <h2 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Leaderboard Stats
        </h2>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Followers (editable with confirm popup) */}
          <EditableFollowersCard
            label="Followers"
            value={me.followersCount}
            editing={editingFollowers}
            draft={followersDraft}
            onEdit={() => { setEditingFollowers(true); setFollowersDraft(me.followersCount); }}
            onChange={onFollowersChange}
            onCancel={onFollowersCancel}
            // Instead of saving directly, open the confirmation popup
            onOpenConfirm={() => setConfirmOpen(true)}
            saveDisabled={!isFollowersValid || !isFollowersChanged || savingFollowers}
            saving={savingFollowers}
          />

          {/* Other read-only metrics */}
          <Metric label="Order Points" value={me.orderPoints} />
          <Metric label="Premium Points" value={me.premiumPoints} />
          <Metric label="Consistency Points" value={me.consistencyPoints} />
          <Metric label="Total Points" value={me.totalPoints} />
          <Metric label="Leaderboard Place" value={me.leaderboardPlace ?? '—'} />
        </div>

        {/* Confirmation Modal */}
        {confirmOpen && (
          <ConfirmModal
            oldValue={me.followersCount}
            newValue={followersDraft}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={async () => {
              setConfirmOpen(false);
              await onFollowersSave();
            }}
          />
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-amber-200/60 bg-white/70 p-4
      dark:bg-slate-900/60 dark:border-slate-700">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}

function EditableFollowersCard({
  label,
  value,
  editing,
  draft,
  onEdit,
  onChange,
  onCancel,
  onOpenConfirm,
  saveDisabled,
  saving,
}) {
  return (
    <div className="rounded-lg border border-amber-200/60 bg-white/70 p-4
      dark:bg-slate-900/60 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </div>

        {!editing && (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit followers"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            title="Edit"
          >
            {/* Pencil icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M14.06 4.69l3.75 3.75" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        )}
      </div>

      {!editing ? (
        <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{value}</div>
      ) : (
        <div className="mt-2 space-y-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={draft}
            onChange={onChange}
            className="w-full rounded-md border border-amber-200 bg-white/90 px-3 py-2 text-sm
              text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400
              dark:bg-slate-800/90 dark:text-slate-100 dark:placeholder-slate-400 dark:border-slate-700 dark:focus:ring-slate-500"
            placeholder="Enter followers count"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-amber-200/60 bg-white/80 px-3 py-2 text-sm
                text-slate-700 hover:bg-amber-100 dark:bg-slate-900/60 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onOpenConfirm} // open the confirmation modal
              disabled={saveDisabled}
              className="rounded-md bg-amber-900 px-3 py-2 text-sm font-semibold text-white
                hover:bg-[#641823] disabled:opacity-60 disabled:cursor-not-allowed
                dark:bg-amber-500 dark:hover:bg-amber-400 transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Simple confirmation modal */
function ConfirmModal({ oldValue, newValue, onCancel, onConfirm }) {
  const displayOld = typeof oldValue === 'number' ? oldValue.toLocaleString() : oldValue ?? '—';
  const displayNew = typeof newValue === 'number' ? newValue.toLocaleString() : newValue ?? '—';

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl border border-amber-200/60 bg-white p-6 shadow-xl
        dark:bg-slate-900 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Submit followers change?
        </h3>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          You’re about to submit the followers change for approval.
        </p>

        <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          <div><span className="font-medium">Current:</span> {displayOld}</div>
          <div><span className="font-medium">New:</span> {displayNew}</div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-amber-200/60 bg-white/80 px-3 py-2 text-sm
              text-slate-700 hover:bg-amber-100 dark:bg-slate-900/60 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-amber-900 px-3 py-2 text-sm font-semibold text-white
              hover:bg-[#641823] dark:bg-amber-500 dark:hover:bg-amber-400"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
}