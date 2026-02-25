// src/services/api.js
import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://noonyar.ir', // آدرس پایه سرور شما
    baseURL: '/api', // آدرس پایه سرور شما
    headers: {
        'Content-Type': 'application/json',
    },
    // بسیار مهم: برای اینکه کوکی‌های HttpOnly (رفرش توکن و اکسس توکن) توسط مرورگر ست شوند
    withCredentials: true,
});

// اینترسپتور برای لاگ کردن خطاها (اختیاری ولی مفید برای دیباگ)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // مدیریت خطاهای عمومی (مثل قطع اینترنت)
        if (!error.response) {
            console.error('Network Error');
        }
        return Promise.reject(error);
    },
);

export default api;
