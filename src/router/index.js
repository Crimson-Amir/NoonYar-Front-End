import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@/views/NotFound/NotFound.vue';

const routes = [
    {
        path: '/res/:bakery_id/:ticket_token',
        name: 'QueueStatus',
        component: () => import('../views/Turn/TurnInfo.vue'),
        meta: {
            title: 'مشاهده نوبت',
        },
    },
    {
        path: '/adminPanel',
        name: 'AdminPanel',
        component: () => import('../views/Admin/AdminPanel.vue'),
        meta: {
            title: 'پنل ادمین',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login/LoginView.vue'),
        meta: {
            title: 'لاگین',
        },
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('../views/Login/SignupView.vue'),
        meta: {
            title: 'ثبت نام',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// تنظیم عنوان تب به‌صورت پویا
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'نون‌یار';
    next();
});

export default router;
