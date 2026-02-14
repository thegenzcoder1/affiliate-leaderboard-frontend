import { Navigate } from 'react-router-dom';
import { useAuth } from '../State/AuthContext.jsx';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-svh grid place-items-center bg-white dark:bg-slate-950">
        <div className="text-slate-700 dark:text-slate-200">Loading…</div>
      </div>
    );
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}