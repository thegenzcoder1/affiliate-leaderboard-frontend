// src/Components/Navbar.jsx
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
import BrandLogo from "./BrandLogo.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin', { replace: true });
  };

  // Build /profile/:username when we have a user, else fall back to /profile (which can redirect)
  const profileHref = user?.username
    ? `/profile/${encodeURIComponent(user.username)}`
    : '/profile';

  const itemClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors
     ${isActive
      ? 'bg-amber-200 text-slate-900 dark:bg-slate-700 dark:text-amber-100'
      : 'text-slate-800 hover:bg-amber-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-amber-200/60 backdrop-blur
        bg-white/80 dark:bg-slate-900/60 dark:border-slate-700">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            {/* Shrink for the navbar; e.g., ~120px wide */}
            <BrandLogo width={120} height={44} />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={itemClasses} end>
              Home
            </NavLink>
            <NavLink to={profileHref} className={itemClasses}>
              My Profile
            </NavLink>
            <NavLink to="/contact" className={itemClasses}>
              Contact
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={itemClasses}>
                Admin
              </NavLink>
            )}
          </div>

          {/* Right (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <div className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold">
                  {user.username}
                </span>
                <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-900 dark:bg-slate-800 dark:text-amber-200">
                  {user.role}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="rounded-md bg-amber-900 px-3 py-2 text-sm font-semibold text-white hover:bg-[#641823]
                dark:bg-amber-500 dark:hover:bg-amber-400 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2
              text-slate-700 hover:bg-amber-100 hover:text-slate-900
              dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              {open ? (
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-3">
            <div className="space-y-1">
              <NavLink
                to="/"
                className={itemClasses}
                end
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>

              {/* Use profileHref in mobile as well */}
              <NavLink
                to={profileHref}
                className={itemClasses}
                onClick={() => setOpen(false)}
              >
                My Profile
              </NavLink>

              <NavLink
                to="/contact"
                className={itemClasses}
                onClick={() => setOpen(false)}
              >
                Contact
              </NavLink>

              <div className="border-t border-amber-200/60 dark:border-slate-700 pt-2 mt-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-md bg-amber-900 px-3 py-2 text-sm font-semibold text-white hover:bg-[#641823]
                    dark:bg-amber-500 dark:hover:bg-amber-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}