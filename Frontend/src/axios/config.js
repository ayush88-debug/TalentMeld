import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true, // This ensures cookies are sent with every request
});

export default api;