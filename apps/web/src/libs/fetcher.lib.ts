import axios from 'axios';

const BASE_URL = "http://localhost:4000/api";
export const fetcher = axios.create({ baseURL: BASE_URL, timeout: 10000, withCredentials: true });

// Response interceptor for API calls
fetcher
.interceptors
.response
.use((response) => {
    return response
}, async function (error) {
    const request = error.config;

    if (error.response.status === 401 && !request._retry) {
        request._retry = true;
        await axios.get('auth/refresh', { baseURL: BASE_URL, timeout: 10000, withCredentials: true })
        return fetcher(request);
    }

    return Promise.reject(error);
});