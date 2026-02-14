import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';

export default function AppLayout() {
  return (
    <div className="min-h-svh bg-gradient-to-br from-rose-50 to-amber-50 dark:from-slate-900 dark:to-slate-950">
      {/* Common navigation for all pages in this layout */}
      <Navbar />
      {/* Page content goes here */}
      <Outlet />
    </div>
  );
}