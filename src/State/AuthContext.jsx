// src/state/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, loginUser } from '../services/auth.service';
import { clearJwt, getJwt } from '../api/client';

const AuthContext = createContext(null);

const LS_KEY = 'silkshop_user'; // existing local cache for user profile UI

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, username, role, displayName, ... }
  const [loading, setLoading] = useState(true);

  // Boot: if JWT present, prefer server /me → hydrate; otherwise fallback to legacy local cache
  useEffect(() => {
    (async () => {
      try {
        if (getJwt()) {
          const me = await getMe();
          const hydrated = mapUserFromApi(me);
          // If backend later returns a role, you can map it here
          hydrated.role = hydrated.role || 'user';
          setUser(hydrated);
          localStorage.setItem(LS_KEY, JSON.stringify(hydrated));
        } else {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) setUser(JSON.parse(raw));
        }
      } catch {
        // token invalid/expired
        clearJwt();
        setUser(null);
        localStorage.removeItem(LS_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---- Real sign-in for USER tab ----
  const signinUser = async (username, password) => {
    const { token } = await loginUser({ username, password });
    if (!token) throw new Error('No token received');
    const me = await getMe();
    const hydrated = mapUserFromApi(me);
    hydrated.role = 'user'; // if /user returns role, replace accordingly
    setUser(hydrated);
    localStorage.setItem(LS_KEY, JSON.stringify(hydrated));
  };

  // ---- your existing methods remain unchanged ----

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_KEY);
    clearJwt(); // also clear API token
  };
  const updateUser = (patch) => { /* unchanged in your file */ };

  return (
    <AuthContext.Provider value={{
      user, setUser, loading, updateUser, logout,
      signinUser, // <-- keep only this; admin path now only creates users (no login)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Map /leaderboard/user → UI model
function mapUserFromApi(me) {
  return {
    // Core identity
    id: me?.instagramUsername || '',       // no explicit id in response, so use username as stable id
    username: me?.instagramUsername || '',
    displayName: me?.instagramUsername || '',

    // Role: set by signinUser (or from backend later if available)
    role: '',

    followersCount: me?.followersCount ?? 0,
    orderPoints: me?.orderPoints ?? 0,
    premiumPoints: me?.premiumPoints ?? 0,
    consistencyPoints: me?.consistencyPoints ?? 0,
    totalPoints: me?.totalPoints ?? 0,
  };
}