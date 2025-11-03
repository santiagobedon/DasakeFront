import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Recover from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import AboutUs from "../pages/aboutus/AboutUs"; // About Us page
import ProtectedRoute from "../components/ProtectedRoute";
import ChangePassword from "../pages/Change-password/Change-Password";
import MovieDetail from "../pages/MovieDetail/MovieDetail";
/**
 * AppRoutes component
 *
 * Defines all routes of the application.
 * - Redirects root "/" and unknown paths to /login.
 * - Includes protected routes for authenticated users.
 * - Separates public routes (login, register, recover/reset password).
 * - Includes a new About Us page route.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      {/* About Us page */}
      <Route
        path="/aboutus"
        element={
          <ProtectedRoute>
            <AboutUs />
          </ProtectedRoute>
        }
      />
      {/* Movie Detail page */}
      <Route
        path="/movie/:id"
        element={
          <ProtectedRoute>
            <MovieDetail />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirects unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    
  );
}
