import axios from 'axios';

/**
 * Axios instance pre-configured for the Mini Aladdin API.
 * 
 * In development: Vite proxies /api/* to localhost:8080 (monolith).
 * In production: VITE_API_URL env var points to the Render backend URL.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach JWT token ──
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ma_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ──
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ma_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
