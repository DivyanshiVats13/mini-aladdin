import axios from 'axios';

/**
 * Axios instance pre-configured for the Mini Aladdin API Gateway.
 * In development, Vite proxies /api/* to localhost:8080.
 */
const axiosClient = axios.create({
  baseURL: '/api',
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
