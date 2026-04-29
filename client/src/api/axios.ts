/// <reference types="vite/client" />
import axios from 'axios';

// Инициализация axios с дефолтными настройками
export const apiClient = axios.create({
  // import.meta.env используется в Vite
  baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Интерсепторы
apiClient.interceptors.request.use((config) => {
  // Забираем токен из localStorage, если будет авторизация
  const token = localStorage.getItem('token'); 
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
