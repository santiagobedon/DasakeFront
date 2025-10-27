// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

/**
 * User type represents the user object stored in context
 * - id: unique identifier
 * - firstName, lastName: optional personal info
 * - email: optional email
 * - age: optional age
 * - createdAt, updatedAt: optional timestamps
 */
type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * AuthContextType defines the context state and actions
 * - user: currently authenticated user or null
 * - token: JWT string or null
 * - loading: indicates if auth state is being loaded
 * - login: function to log in with email/password
 * - logout: function to log out
 * - signup: function to register a new user
 * - refreshMe: function to refresh current user info
 * - updateProfile: function to update user profile
 */
type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (payload: {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  refreshMe: () => Promise<void>;
  updateProfile: (payload: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * useAuth hook
 * 
 * Returns the authentication context
 * Throws an error if used outside AuthProvider
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/**
 * AuthProvider component
 *
 * Provides authentication state and actions to its children
 * - Stores token and user in localStorage for persistence
 * - Handles login, signup, logout, refreshMe, and updateProfile
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      if (token) {
        try {
          await refreshMe();
        } catch (err) {
          console.error("error al refrescar usuario:", err);
          logout();
        }
      }
      setLoading(false);
    }
    init();
  }, [token]);

  /**
   * refreshMe
   *
   * Fetches the current user info from the API and updates state/localStorage
   * Logs out if the token is invalid or expired
   */
  async function refreshMe() {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data.user ?? res.data;
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      return userData;
    } catch (err: any) {
      if (import.meta.env.DEV) console.error("error en refreshMe:", err);

      if (err.response?.status === 401) {
        logout();
      } else {
        console.warn("no se pudo refrescar el usuario, status:", err.response?.status);
      }
    }
  }

  /**
   * updateProfile
   *
   * Updates user profile on the API and updates local state/localStorage
   */
  async function updateProfile(payload: Partial<User>) {
    if (!token) return;
    const res = await api.put("/users/me", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      const updatedUser = res.data.user ?? res.data;
      setUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
  }

  /**
   * login
   *
   * Authenticates with email and password, stores token and user info
   */
  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });

    if (res.status === 200 && res.data.token) {
      const t = res.data.token as string;
      localStorage.setItem("auth_token", t);
      setToken(t);

      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("auth_user", JSON.stringify(res.data.user));
      }

      return;
    }
    throw res;
  }

  /**
   * signup
   *
   * Registers a new user with the API
   */
  async function signup(payload: {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const apiPayload = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      age: payload.age,
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
    };

    const res = await api.post("/users", apiPayload);
    if (res.status === 201) return;
    throw res;
  }

  /**
   * logout
   *
   * Clears auth token and user from state and localStorage
   */
  function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    signup,
    refreshMe,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
