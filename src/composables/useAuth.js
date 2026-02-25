// src/composables/useAuth.js
import { ref, computed, nextTick } from 'vue';
import api, { persistAuthTokens } from '../services/api';

export function useAuth() {
    // --- State ---
    const phone = ref('');
    const phoneError = ref('');
    const step = ref('PHONE_INPUT');
    const otpDigits = ref(['', '', '', '']);
    const otpError = ref('');
    const hasOtpVisualError = ref(false);
    const timer = ref(0);
    const isLoading = ref(false);
    let timerInterval = null;

    // --- Computed ---
    // چک می‌کند که تمام خانه‌ها پر باشند و عدد باشند
    const isOtpComplete = computed(() =>
        otpDigits.value.every((d) => d !== '' && /\d/.test(d)),
    );

    const isPhoneValid = computed(() => {
        return /^09\d{9}$/.test(phone.value);
    });

    // --- Helpers ---
    const validatePhone = (number) => /^09\d{9}$/.test(number);

    const startTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
        timer.value = 120;
        timerInterval = setInterval(() => {
            timer.value--;
            if (timer.value <= 0) clearInterval(timerInterval);
        }, 1000);
    };

    const resetOtpState = () => {
        otpDigits.value = ['', '', '', ''];
        otpError.value = '';
        hasOtpVisualError.value = false;
        // فوکوس روی اولین خانه
        nextTick(() => {
            const inputs = document.querySelectorAll('.otp-input');
            if (inputs[0]) inputs[0].focus();
        });
    };

    // --- API Actions ---
    const sendOtp = async () => {
        phoneError.value = '';
        if (!validatePhone(phone.value)) {
            phoneError.value = 'شماره باید با ۰۹ شروع شده و ۱۱ رقم باشد';
            return;
        }

        isLoading.value = true;
        try {
            await api.post('/auth/enter-number', {
                phone_number: phone.value,
            });
            step.value = 'OTP_VERIFICATION';
            startTimer();
            resetOtpState();
        } catch (error) {
            if (error.response?.status === 400) {
                phoneError.value = 'فرمت شماره تلفن صحیح نیست.';
            } else {
                phoneError.value = 'خطای شبکه. لطفا مجددا تلاش کنید.';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const verifyOtp = async (router) => {
        if (!isOtpComplete.value) return;

        isLoading.value = true;
        otpError.value = '';
        const code = otpDigits.value.join('');

        try {
            const response = await api.post('/auth/verify-otp', {
                phone_number: phone.value,
                code: code,
            });

            const { step: userStatus } = response.data;
            persistAuthTokens(
                response.data?.access_token || response.data?.access || '',
                response.data?.refresh_token || response.data?.refresh || '',
            );

            if (userStatus === 'login') {
                window.location.href = '/dashboard';
            } else if (userStatus === 'sign-up') {
                router.push({ path: '/signup', query: { phone: phone.value } });
            }
        } catch (error) {
            otpError.value = 'کد وارد شده اشتباه است.';
            hasOtpVisualError.value = true;

            // بعد از ۱ ثانیه انیمیشن لرزش را قطع می‌کنیم اما رنگ قرمز می‌ماند تا کاربر تایپ کند
            setTimeout(() => {
                hasOtpVisualError.value = true; // نگه داشتن وضعیت خطا
            }, 300);
        } finally {
            isLoading.value = false;
        }
    };

    // --- Input Handlers (Logic Improved) ---

    const handlePhoneInput = (e) => {
        // فقط اعداد انگلیسی را نگه دار
        const val = e.target.value.replace(/[^0-9]/g, '');
        phone.value = val;
        e.target.value = val;
        phoneError.value = '';
    };

    const handleOtpInput = (index, e) => {
        const val = e.target.value;
        // اگر خطا داشتیم و کاربر شروع به تایپ کرد، خطا را پاک کن
        if (hasOtpVisualError.value) {
            hasOtpVisualError.value = false;
            otpError.value = '';
        }

        // اگر کاربر عدد وارد کرد
        if (val && /\d/.test(val)) {
            // فقط رقم آخر را بگیر (اگر کاربر تند تایپ کرد)
            otpDigits.value[index] = val.slice(-1);

            // پرش به خانه بعدی
            if (index < 3) {
                nextTick(() => {
                    const inputs = document.querySelectorAll('.otp-input');
                    inputs[index + 1].focus();
                });
            }
        } else {
            // اگر کاراکتر غیر عددی بود پاکش کن
            otpDigits.value[index] = '';
        }
    };

    // مدیریت پیشرفته Backspace
    const handleOtpKeydown = (index, e) => {
        if (e.key === 'Backspace') {
            if (hasOtpVisualError.value) {
                hasOtpVisualError.value = false;
                otpError.value = '';
            }

            if (otpDigits.value[index]) {
                // اگر خانه پر است، آن را خالی کن و همانجا بمان
                otpDigits.value[index] = '';
            } else if (index > 0) {
                // اگر خانه خالی است، برو به قبلی و آن را خالی کن
                e.preventDefault(); // جلوگیری از رفتار پیش‌فرض
                otpDigits.value[index - 1] = '';
                nextTick(() => {
                    const inputs = document.querySelectorAll('.otp-input');
                    inputs[index - 1].focus();
                });
            }
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 4);
        const chars = data.split('');

        hasOtpVisualError.value = false;
        otpError.value = '';

        chars.forEach((c, i) => (otpDigits.value[i] = c));

        nextTick(() => {
            const inputs = document.querySelectorAll('.otp-input');
            const focusIndex = Math.min(chars.length, 3);
            inputs[focusIndex].focus();
        });
    };

    const changePhone = () => {
        step.value = 'PHONE_INPUT';
        clearInterval(timerInterval);
        otpDigits.value = ['', '', '', ''];
        hasOtpVisualError.value = false;
        otpError.value = '';
    };

    return {
        phone,
        phoneError,
        step,
        otpDigits,
        otpError,
        hasOtpVisualError,
        timer,
        isLoading,
        isOtpComplete,
        isPhoneValid,
        sendOtp,
        verifyOtp,
        handlePhoneInput,
        handleOtpInput,
        handleOtpPaste,
        handleOtpKeydown,
        changePhone,
        resendCode: sendOtp,
    };
}
