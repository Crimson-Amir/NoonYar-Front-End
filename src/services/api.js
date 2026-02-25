// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const setTokenCookie = (key, value, maxAge) => {
    if (!value || typeof document === 'undefined') return;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

export const persistAuthTokens = (accessToken = '', refreshToken = '') => {
    setTokenCookie('access_token', accessToken, 60 * 60 * 24);
    setTokenCookie('refresh_token', refreshToken, 60 * 60 * 24 * 14);
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error('Network Error');
        }
        return Promise.reject(error);
    },
);

export default api;
