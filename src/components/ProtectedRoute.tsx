// src/components/ProtectedRoute.tsx
import React from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute component
 *
 * Wraps routes that require authentication.
 * 
 * Behavior:
 * - If authentication is loading, shows a loading placeholder.
 * - If the user is not authenticated (no token), redirects to the login page.
 * - If authenticated, renders the child components.
 *
 * Props:
 * - children: the component(s) to render if the user is authenticated
 *
 * Example:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div style={{ minHeight: "60vh" }}>Cargando...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
