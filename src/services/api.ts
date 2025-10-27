/**
 * api
 *
 * Axios instance pre-configured for DasakeMovies backend.
 * - `baseURL` points to the API server.
 * - `withCredentials: false` because the backend does not rely on cookies.
 * - Default headers include JSON content type and accept.
 * - Timeout set to 10 seconds.
 *
 * Request interceptor:
 * - Automatically attaches `Authorization` header if `auth_token` exists in localStorage.
 */

import axios from "axios";

const API_BASE_URL = "https://dasakemovies.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
