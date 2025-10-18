import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true, // This ensures cookies are sent with every request
});

export default api;