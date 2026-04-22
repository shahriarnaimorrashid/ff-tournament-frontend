// src/utils/axios.js
import axios from 'axios';

// আপনার ব্যাকএন্ড URL এখানে সেট করুন (লোকাল বা প্রোডাকশন)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tournament-backend-szrn.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15 সেকেন্ড টাইমআউট
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// গ্লোবাল রেসপন্স এরর হ্যান্ডলিং (ঐচ্ছিক)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timeout: Backend might be down');
    }
    if (!error.response) {
      console.warn('Network error: Backend unreachable');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;