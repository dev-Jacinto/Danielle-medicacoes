import axios from 'axios';

const  baseURL = import.meta.env.vite_API_URL || 'http://localhost:3001/api';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
export default api;


