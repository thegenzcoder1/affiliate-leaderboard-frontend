// src/Pages/SignIn.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
import { createLeaderboardUser } from '../services/auth.service'; // service where createLeaderboardUser lives
import BrandLogo from '../Components/BrandLogo.jsx';

export default function SignIn() {
  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'admin'
  const [showPwd, setShowPwd] = useState({ user: false, admin: false });

  const [userForm, setUserForm] = useState({ username: '', password: '' });
  const [adminForm, setAdminForm] = useState({ username: '', password: '', email: '', token: '' });

  const [loading, setLoading] = useState({ user: false, admin: false });
  const [error, setError] = useState({ user: '', admin: '' });
  const [success, setSuccess] = useState({ user: '', admin: '' });

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const { signinUser } = useAuth();

  // Handlers
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError((p) => ({ ...p, user: '' }));
    setSuccess((p) => ({ ...p, user: '' }));
    setLoading((p) => ({ ...p, user: true }));

    try {
      await signinUser(userForm.username, userForm.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError((p) => ({
        ...p,
        user: err?.response?.data?.message || 'Failed to sign in. Please try again.',
      }));
    } finally {
      setLoading((p) => ({ ...p, user: false }));
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError((p) => ({ ...p, admin: '' }));
    setSuccess((p) => ({ ...p, admin: '' }));
    setLoading((p) => ({ ...p, admin: true }));

    try {
      const res = await createLeaderboardUser({
        username: adminForm.username,
        password: adminForm.password,
        email: adminForm.email,
        adminToken: adminForm.token, // used as 'admin-token' header
      });

      setSuccess((p) => ({
        ...p,
        admin: res?.message || 'User created successfully.',
      }));

      // Optional: keep token but clear the new user fields if you plan to create multiple
      setAdminForm(prev => ({ ...prev, username: '', password: '', email: '' }));

    } catch (err) {
      setError((p) => ({
        ...p,
        admin:
          err?.response?.data?.message ||
          'Failed to create user. Please verify Admin Token and try again.',
      }));
    } finally {
      setLoading((p) => ({ ...p, admin: false }));
    }
  };

  return (
    <div
      className="relative isolate min-h-svh overflow-hidden 
      bg-gradient-to-br from-rose-50 to-amber-50 
      dark:from-slate-900 dark:to-slate-950
      flex items-center justify-center px-4 py-12"
    >
      {/* Silk-like radial accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-25
        [background-image:radial-gradient(40%_30%_at_10%_10%,rgba(198,163,79,0.25),transparent),
                           radial-gradient(35%_25%_at_90%_10%,rgba(122,31,42,0.18),transparent),
                           radial-gradient(60%_50%_at_50%_100%,rgba(67,56,202,0.15),transparent)]"
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header with Logo */}
        <header className="text-center mb-8">
          <div className="mx-auto inline-flex items-center gap-2">
            <BrandLogo size={36} radius={10} />
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Leaderboard
          </p>
        </header>

        <div
          className="rounded-2xl border border-amber-200/60 bg-white/80 backdrop-blur
            shadow-xl shadow-amber-900/5
            dark:bg-slate-900/60 dark:border-slate-700"
        >
          {/* Tab / Segmented Toggle */}
          <div className="p-2">
            <div
              className="relative grid grid-cols-2 rounded-xl bg-amber-100/70 p-1
                dark:bg-slate-800"
            >
              {/* Active background pill */}
              <div
                className={`absolute inset-y-1 my-auto h-[calc(100%-0.5rem)] w-1/2 rounded-lg transition-all duration-300
                bg-gradient-to-br from-amber-400 to-amber-500
                dark:from-slate-700 dark:to-slate-600
                ${activeTab === 'admin' ? 'translate-x-full' : 'translate-x-0'}`}
                aria-hidden
              />
              <button
                type="button"
                onClick={() => setActiveTab('user')}
                className={`relative z-10 px-4 py-2 text-sm font-semibold rounded-lg transition-colors
                  ${
                    activeTab === 'user'
                      ? 'text-slate-900 dark:text-amber-100'
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                aria-pressed={activeTab === 'user'}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`relative z-10 px-4 py-2 text-sm font-semibold rounded-lg transition-colors
                  ${
                    activeTab === 'admin'
                      ? 'text-slate-900 dark:text-amber-100'
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                aria-pressed={activeTab === 'admin'}
              >
                Create User
              </button>
            </div>
          </div>

          {/* Forms */}
          <div className="p-6 md:p-8">
            {activeTab === 'user' ? (
              <form onSubmit={handleUserSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="userUsername"
                    className="block text-sm font-medium 
                      text-slate-700 dark:text-slate-200 mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="userUsername"
                    name="username"
                    value={userForm.username}
                    onChange={handleUserChange}
                    autoComplete="username"
                    required
                    className="w-full px-4 py-2 rounded-lg border
                      border-amber-200 focus:outline-none
                      focus:ring-2 focus:ring-amber-400 focus:border-transparent
                      bg-white/90 text-slate-900 placeholder-slate-400
                      dark:bg-slate-800/90 dark:text-slate-100 dark:placeholder-slate-400
                      dark:border-slate-700 dark:focus:ring-slate-500"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="userPassword"
                      className="block text-sm font-medium 
                        text-slate-700 dark:text-slate-200"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPwd((p) => ({ ...p, user: !p.user }))}
                      className="text-xs font-medium text-silk-maroon hover:underline
                        dark:text-amber-300"
                    >
                      {showPwd.user ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPwd.user ? 'text' : 'password'}
                    id="userPassword"
                    name="password"
                    value={userForm.password}
                    onChange={handleUserChange}
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-2 rounded-lg border
                      border-amber-200 focus:outline-none
                      focus:ring-2 focus:ring-amber-400 focus:border-transparent
                      bg-white/90 text-slate-900 placeholder-slate-400
                      dark:bg-slate-800/90 dark:text-slate-100 dark:placeholder-slate-400
                      dark:border-slate-700 dark:focus:ring-slate-500"
                    placeholder="Enter your password"
                  />
                </div>

                {error.user && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error.user}</p>
                )}
                {success.user && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {success.user}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading.user}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-900
                    text-white font-semibold py-2.5
                    hover:bg-[#641823] transition-colors
                    disabled:opacity-60 disabled:cursor-not-allowed
                    dark:bg-amber-500 dark:hover:bg-amber-400"
                >
                  {loading.user ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="adminUsername"
                    className="block text-sm font-medium 
                      text-slate-700 dark:text-slate-200 mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="adminUsername"
                    name="username"
                    value={adminForm.username}
                    onChange={handleAdminChange}
                    autoComplete="username"
                    required
                    className="w-full px-4 py-2 rounded-lg border
                      border-amber-200 focus:outline-none
                      focus:ring-2 focus:ring-amber-400 focus:border-transparent
                      bg-white/90 text-slate-900 placeholder-slate-400
                      dark:bg-slate-800/90 dark:text-slate-100 dark:placeholder-slate-400
                      dark:border-slate-700 dark:focus:ring-slate-500"
                    placeholder="Enter new user’s instagram username"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="adminPassword"
                      className="block text-sm font-medium 
                        text-slate-700 dark:text-slate-200"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPwd((p) => ({ ...p, admin: !p.admin }))}
                      className="text-xs font-medium text-silk-maroon hover:underline
                        dark:text-amber-300"
                    >
                      {showPwd.admin ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPwd.admin ? 'text' : 'password'}
                    id="adminPassword"
                    name="password"
                    value={adminForm.password}
                    onChange={handleAdminChange}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-2 rounded-lg border
                      border-amber-200 focus:outline-none
                      focus:ring-2 focus:ring-amber-400 focus:border-transparent
                      bg-white/90 text-slate-900 placeholder-slate-400
                      dark:bg-slate-800/90 dark:text-slate-100 dark:placeholder-slate-400
                      dark:border-slate-700 dark:focus:ring-slate-500"
                    placeholder="Set a password for the new user"
                  />
                </div>

                {/* NEW Email field */}
                <div>
                  <label
                    htmlFor="adminEmail"
                    className="block text-sm font-medium 
                      text-slate-700 dark:text-slate-200 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="email"
                    value={adminForm.email}
                    onChange={handleAdminChange}
                    autoComplete="email"
                    required
                    className="w-full px-4 py-2 rounded-lg border
                      border-amber-200 focus:outline-none
                      focus:ring-2 focus:ring-amber-400 focus:border-transparent
                      bg-white/90 text-slate-900 placeholder-slate-400
                      dark:bg-slate-800/90 dark:text-slate-100 dark:placeholder-slate-400
                      dark:border-slate-700 dark:focus:ring-slate-500"
                    placeholder="Enter new user’s email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adminToken"
                    className="block text-sm font-medium 
                      text-slate-700 dark:text-slate-200 mb-2"
                  >
                    Admin Token
                  </label>
                  <input
                    type="text"
                    id="adminToken"
                    name="token"
                    value={adminForm.token}
                    onChange={handleAdminChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    className="w-full px-4 py-2 rounded-lg border
                      border-amber-200 focus:outline-none
                      focus:ring-2 focus:ring-amber-400 focus:border-transparent
                      bg-white/90 text-slate-900 placeholder-slate-400
                      dark:bg-slate-800/90 dark:text-slate-100 dark:placeholder-slate-400
                      dark:border-slate-700 dark:focus:ring-slate-500"
                    placeholder="Enter Admin Token"
                  />
                </div>

                {error.admin && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error.admin}</p>
                )}
                {success.admin && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {success.admin}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    loading.admin ||
                    !adminForm.username ||
                    !adminForm.password ||
                    !adminForm.email ||
                    !adminForm.token
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg
                    bg-amber-900 text-white font-semibold py-2.5
                    hover:bg-[#641823] transition-colors
                    disabled:opacity-60 disabled:cursor-not-allowed
                    dark:bg-amber-500 dark:hover:bg-amber-400"
                >
                  {loading.admin ? 'Creating…' : 'Create User'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} Kancheepuram SM Silks.
        </p>
      </div>
    </div>
  );
}
