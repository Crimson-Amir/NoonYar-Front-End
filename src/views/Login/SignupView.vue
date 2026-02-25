<template>
    <div
        class="min-h-screen flex items-center justify-center bg-[#1e1e1e] font-sans p-4"
    >
        <transition name="fade">
            <div
                v-if="notification.show"
                :class="[
                    'fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px]',
                    notification.type === 'error'
                        ? 'bg-[#2d2d2d] border-r-4 border-red-500 text-red-100'
                        : 'bg-[#2d2d2d] border-r-4 border-green-500 text-green-100',
                ]"
            >
                <span class="text-sm font-medium">{{
                    notification.message
                }}</span>
                <button
                    @click="closeNotification"
                    class="mr-auto text-xl opacity-70 hover:opacity-100 transition-opacity"
                >
                    &times;
                </button>
            </div>
        </transition>

        <div
            class="bg-[#2d2d2d] text-white rounded-[15px] shadow-2xl p-8 md:p-10 w-full max-w-[400px] border border-[#3d3d3d]"
        >
            <h2 class="text-2xl font-bold text-center mb-8 text-gray-100">
                تکمیل اطلاعات
            </h2>

            <form @submit.prevent="handleSignupSubmit" class="space-y-5">
                <div dir="rtl">
                    <label
                        class="block text-sm font-medium text-[#b3b3b3] mb-2 text-right"
                        >نام *</label
                    >
                    <input
                        v-model="form.firstName"
                        type="text"
                        class="w-full px-4 py-3 bg-[#3d3d3d] border-2 border-[#4d4d4d] rounded-xl text-white focus:border-[#4caf50] focus:bg-[#363636] focus:outline-none transition-all"
                        :class="{ 'border-red-500': errors.firstName }"
                        @input="errors.firstName = false"
                    />
                </div>

                <div dir="rtl">
                    <label
                        class="block text-sm font-medium text-[#b3b3b3] mb-2 text-right"
                        >نام خانوادگی *</label
                    >
                    <input
                        v-model="form.lastName"
                        type="text"
                        class="w-full px-4 py-3 bg-[#3d3d3d] border-2 border-[#4d4d4d] rounded-xl text-white focus:border-[#4caf50] focus:bg-[#363636] focus:outline-none transition-all"
                        :class="{ 'border-red-500': errors.lastName }"
                        @input="errors.lastName = false"
                    />
                </div>

                <div dir="rtl">
                    <label
                        class="block text-sm font-medium text-[#b3b3b3] mb-2 text-right"
                        >رمز عبور *</label
                    >
                    <input
                        v-model="form.password"
                        type="password"
                        autocomplete="new-password"
                        class="w-full px-4 py-3 bg-[#3d3d3d] border-2 border-[#4d4d4d] rounded-xl text-white focus:border-[#4caf50] focus:bg-[#363636] focus:outline-none transition-all"
                        :class="{ 'border-red-500': errors.password }"
                        @input="errors.password = false"
                    />
                </div>

                <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full py-3 mt-4 bg-[#4caf50] hover:bg-[#43a047] disabled:bg-[#3d3d3d] disabled:text-[#666] disabled:cursor-not-allowed text-white text-lg font-medium rounded-xl transition-all duration-200 shadow-lg relative overflow-hidden"
                >
                    <span v-if="isLoading">در حال ثبت...</span>
                    <span v-else>تکمیل ثبت‌نام</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { signUp, isLoading } = useAuth();

// استیت فرم
const form = reactive({
    firstName: '',
    lastName: '',
    password: '',
    phone: '', // از کوئری گرفته می‌شود
});

const errors = reactive({
    firstName: false,
    lastName: false,
    password: false,
});

// مدیریت نوتیفیکیشن
const notification = reactive({ show: false, message: '', type: 'error' });
let notifTimeout = null;

const showNotif = (msg, type = 'error') => {
    notification.message = msg;
    notification.type = type;
    notification.show = true;
    if (notifTimeout) clearTimeout(notifTimeout);
    notifTimeout = setTimeout(() => (notification.show = false), 5000);
};

const closeNotification = () => (notification.show = false);

// بررسی وجود شماره تلفن در لحظه ورود
onMounted(() => {
    const phoneParam = route.query.phone;
    if (!phoneParam) {
        showNotif('خطا در روند ثبت‌نام. لطفا مجددا وارد شوید.', 'error');
        setTimeout(() => router.push('/'), 2000);
    } else {
        form.phone = phoneParam;
    }
});

// اعتبارسنجی ساده کلاینت
const validate = () => {
    let isValid = true;
    if (!form.firstName.trim()) {
        errors.firstName = true;
        isValid = false;
    }
    if (!form.lastName.trim()) {
        errors.lastName = true;
        isValid = false;
    }
    // if (form.password.length < 4) {
    //     errors.password = true;
    //     isValid = false;
    //     showNotif('رمز عبور باید حداقل ۴ کاراکتر باشد');
    // }
    return isValid;
};

// هندلر نهایی
const handleSignupSubmit = async () => {
    if (!validate()) return;

    try {
        await signUp({
            phone: form.phone,
            firstName: form.firstName,
            lastName: form.lastName,
            password: form.password,
        });

        showNotif('ثبت‌نام با موفقیت انجام شد!', 'success');
        // ریدایرکت نهایی در useAuth انجام می‌شود
    } catch (error) {
        const msg = error.response?.data?.detail || 'خطایی در ثبت‌نام رخ داد.';
        showNotif(msg, 'error');
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
