// src/services/api.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dasakemovies.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // backend returns token in JSON body (not cookies)
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

// attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

