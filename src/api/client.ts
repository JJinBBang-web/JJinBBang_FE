// src/api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
