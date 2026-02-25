<template>
    <div
        class="min-h-screen flex items-center justify-center bg-[#1e1e1e] font-sans"
    >
        <div
            class="bg-[#2d2d2d] text-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.3)] p-8 md:p-10 w-full max-w-[400px] border border-[#3d3d3d] relative overflow-hidden"
        >
            <h2
                class="text-2xl font-bold text-center mb-8 text-gray-100 tracking-tight"
            >
                {{
                    step === 'PHONE_INPUT'
                        ? 'ورود / ثبت‌نام'
                        : 'تایید شماره همراه'
                }}
            </h2>

            <form @submit.prevent="handleSubmit" novalidate>
                <div v-if="step === 'PHONE_INPUT'" class="space-y-6">
                    <div class="relative">
                        <label
                            for="phone"
                            class="block text-sm font-medium text-[#b3b3b3] mb-3 text-right px-1"
                        >
                            .شماره موبایل خود را وارد کنید
                        </label>

                        <div class="relative group" dir="ltr">
                            <input
                                id="phone"
                                type="tel"
                                :value="phone"
                                @input="handlePhoneInput"
                                placeholder="0912 345 6789"
                                maxlength="11"
                                inputmode="numeric"
                                autocomplete="tel"
                                class="w-full h-14 px-4 text-center bg-[#363636] border-2 rounded-xl text-xl text-white tracking-widest placeholder:text-[#666] focus:outline-none transition-all duration-300 shadow-inner"
                                :class="[
                                    phoneError
                                        ? 'border-red-500/50 focus:border-red-500 bg-red-500/5'
                                        : 'border-[#4d4d4d] focus:border-[#4caf50] focus:shadow-[0_0_15px_rgba(76,175,80,0.1)]',
                                ]"
                            />
                        </div>

                        <p
                            v-if="phoneError"
                            class="mt-2 text-xs text-red-400 text-center font-medium"
                        >
                            {{ phoneError }}
                        </p>
                    </div>
                </div>

                <div v-else class="space-y-8 animate-fade-in">
                    <div class="text-center">
                        <p class="text-sm text-[#b3b3b3] mb-2">
                            .کد فعال سازی ارسال شده را وارد کنید
                        </p>
                        <span dir="ltr" class="font-mono text-white mx-3">{{
                            phone
                        }}</span>
                        <button
                            type="button"
                            @click="changePhone"
                            class="text-xs text-[#4caf50] hover:text-[#45a049] hover:underline transition-colors cursor-pointer"
                        >
                            ویرایش شماره
                        </button>
                    </div>

                    <div class="flex justify-between gap-3 px-2" dir="ltr">
                        <input
                            v-for="(digit, index) in otpDigits"
                            :key="index"
                            type="text"
                            inputmode="numeric"
                            maxlength="1"
                            :value="digit"
                            @input="(e) => handleOtpInput(index, e)"
                            @keydown="(e) => handleOtpKeydown(index, e)"
                            @paste="handleOtpPaste"
                            class="otp-input w-14 h-14 md:w-16 md:h-16 text-center bg-[#363636] border-2 rounded-2xl text-2xl font-bold text-white focus:outline-none transition-all duration-200 shadow-lg"
                            :class="[
                                hasOtpVisualError
                                    ? 'border-red-500 text-red-100 bg-red-500/10 animate-shake'
                                    : digit
                                      ? 'border-[#4caf50] text-[#4caf50] bg-[#4caf50]/5 shadow-[0_0_10px_rgba(76,175,80,0.2)]'
                                      : 'border-[#4d4d4d] focus:border-[#4caf50] focus:-translate-y-1',
                            ]"
                        />
                    </div>

                    <p
                        v-if="otpError"
                        class="text-xs text-red-400 text-center font-bold"
                    >
                        {{ otpError }}
                    </p>

                    <div class="text-center text-sm">
                        <div v-if="timer > 0" class="text-[#888]">
                            ارسال مجدد تا
                            <span
                                class="text-[#4caf50] font-mono text-base mx-1 font-bold"
                            >
                                {{ Math.floor(timer / 60) }}:{{
                                    (timer % 60).toString().padStart(2, '0')
                                }}
                            </span>
                        </div>
                        <button
                            v-else
                            type="button"
                            @click="resendCode"
                            class="text-[#4caf50] hover:text-[#45a049] cursor-pointer transition-colors text-sm font-medium flex items-center justify-center gap-1 mx-auto"
                        >
                            <span>ارسال مجدد کد</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    :disabled="
                        isLoading ||
                        (step === 'OTP_VERIFICATION' && !isOtpComplete) ||
                        (step === 'PHONE_INPUT' && !isPhoneValid)
                    "
                    class="w-full h-14 mt-8 bg-gradient-to-r from-[#4caf50] to-[#43a047] hover:from-[#43a047] hover:to-[#388e3c] disabled:from-[#3d3d3d] disabled:to-[#3d3d3d] disabled:text-[#666] disabled:cursor-not-allowed cursor-pointer text-white text-lg font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#4caf50]/20 flex items-center justify-center relative overflow-hidden active:scale-[0.98]"
                >
                    <span
                        v-if="isLoading"
                        class="absolute inset-0 flex items-center justify-center bg-black/20"
                    >
                        <svg
                            class="animate-spin h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    </span>
                    <span :class="{ 'opacity-0': isLoading }">
                        {{
                            step === 'PHONE_INPUT' ? 'دریافت کد تایید' : 'ورود'
                        }}
                    </span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();

const {
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
    resendCode,
} = useAuth();

const handleSubmit = () => {
    if (step.value === 'PHONE_INPUT') {
        sendOtp();
    } else {
        verifyOtp(router);
    }
};
</script>

<style scoped>
/* Shake Animation */
@keyframes shake {
    0%,
    100% {
        transform: translateX(0);
    }
    20% {
        transform: translateX(-4px);
    }
    40% {
        transform: translateX(4px);
    }
    60% {
        transform: translateX(-4px);
    }
    80% {
        transform: translateX(4px);
    }
}
.animate-shake {
    animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

/* Fade In Animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}
</style>
