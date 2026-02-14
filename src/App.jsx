// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Pages/Home.jsx";
import MyProfile from "./Pages/MyProfile.jsx";
import AdminRoute from "./Components/AdminRoute.jsx";
import Contact from "./Pages/Contact.jsx";
import Admin from "./Pages/Admin.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import { useAuth } from "./state/AuthContext.jsx";

// Helper: redirect /profile → /profile/:username
function ProfileRedirect() {
  const { user } = useAuth();
  const target = user?.username
    ? `/profile/${encodeURIComponent(user.username)}`
    : "/signin";
  return <Navigate to={target} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/signin" element={<SignIn />} />

      {/* All other pages share the AppLayout (navbar, outlet, etc.) */}
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Redirect plain /profile to /profile/:username */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileRedirect />
            </ProtectedRoute>
          }
        />

        {/* Canonical profile route with param */}
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}