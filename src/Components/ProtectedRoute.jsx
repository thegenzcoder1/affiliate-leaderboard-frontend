import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../State/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-svh grid place-items-center bg-white dark:bg-slate-950">
        <div className="text-slate-700 dark:text-slate-200">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
}