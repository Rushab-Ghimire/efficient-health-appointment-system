// src/api.js
import axios from 'axios';

const apiClient = axios.create({
  // --- THIS IS THE FIX ---
  // Set the baseURL to the absolute root of your Django server.
  // The trailing slash is important.
  baseURL: 'http://127.0.0.1:8000/',
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// This interceptor is perfectly written and is a great feature.
// It will automatically add the auth token to every request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;