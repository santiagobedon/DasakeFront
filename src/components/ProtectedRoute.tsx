// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div style={{ minHeight: "60vh" }}>Cargando...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
