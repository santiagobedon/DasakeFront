import axios from "axios";

const API_BASE_URL = "https://dasakemovies.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // necesario porque el backend usa credenciales
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
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
