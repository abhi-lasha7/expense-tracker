import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

// Categories endpoints
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (name, type) => api.post('/categories', { name, type }),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Transactions endpoints
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  create: (amount, description, date, categoryId) =>
    api.post('/transactions', { amount, description, date, categoryId }),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Summary endpoint
export const summaryAPI = {
  getMonthly: (month) => api.get(`/summary?month=${month}`),
};

export default api;