// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
};

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
  updateProfile: (payload: Partial<User>) => Promise<void>; //  agregado
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

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


  async function refreshMe() {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // algunos backends devuelven { user: {...} } y otros devuelven {...} directo
      const userData = res.data.user ?? res.data;
      setUser(userData);

      // persistimos en localStorage por si recarga la pagina
      localStorage.setItem("auth_user", JSON.stringify(userData));

     return userData;
   } catch (err: any) {
      if (import.meta.env.DEV) console.error("error en refreshMe:", err);

      // si el token expira o el servidor falla:
      if (err.response?.status === 401) {
        // token invalido → cerramos sesion
        logout();
      } else {
        console.warn("no se pudo refrescar el usuario, status:", err.response?.status);
      }
    }
  }


  async function updateProfile(payload: Partial<User>) {
    if (!token) return;
    const res = await api.put("/users/me", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      const updatedUser = res.data.user ?? res.data;
      setUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
  }

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
    updateProfile, // 👈 agregado aquí también
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
