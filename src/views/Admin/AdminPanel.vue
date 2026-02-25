<template>
    <div
        class="flex h-screen bg-theme-950 text-slate-200 overflow-hidden font-sans"
    >
        <transition name="fade">
            <div
                v-if="isLoading"
                class="fixed inset-0 bg-theme-950/90 z-50 flex justify-center items-center backdrop-blur-sm"
            >
                <div class="text-center">
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-500 mx-auto mb-4"
                    ></div>
                    <p class="text-theme-400 animate-pulse">
                        ...در حال ارتباط با سرور
                    </p>
                </div>
            </div>
        </transition>

        <aside
            class="w-64 bg-theme-900 border-l border-theme-700 flex flex-col shadow-2xl z-20 hidden md:flex"
        >
            <div
                class="p-6 flex flex-col items-center justify-center border-b border-theme-800"
            >
                <h1 class="text-xl font-bold text-theme-400">
                    پنل ادمین نونوایی
                </h1>
                <div
                    class="mt-2 text-xs bg-theme-800 px-3 py-1 rounded-full text-slate-400 border border-theme-700"
                >
                    نونوایی شماره:
                    <span class="text-white font-mono font-bold">{{
                        config.BAKERY_ID
                    }}</span>
                </div>
            </div>

            <nav class="flex-1 p-4 space-y-2">
                <button
                    @click="currentView = 'queue'"
                    :class="
                        currentView === 'queue'
                            ? 'bg-theme-500 text-white shadow-lg shadow-theme-500/20'
                            : 'text-slate-400 hover:bg-theme-800 hover:text-slate-200'
                    "
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                >
                    <span class="text-xl">📋</span>
                    <span class="font-medium">مدیریت صف</span>
                </button>

                <button
                    @click="currentView = 'production'"
                    :class="
                        currentView === 'production'
                            ? 'bg-theme-500 text-white shadow-lg shadow-theme-500/20'
                            : 'text-slate-400 hover:bg-theme-800 hover:text-slate-200'
                    "
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                >
                    <span class="text-xl">🔥</span>
                    <span class="font-medium">پنل شاطر</span>
                </button>
            </nav>

            <div
                class="p-4 text-xs text-slate-500 text-center border-t border-theme-800"
            >
                وضعیت اتصال:
                <span :class="isOnline ? 'text-green-500' : 'text-red-500'">{{
                    isOnline ? 'آنلاین' : 'قطع'
                }}</span>
            </div>
        </aside>

        <main class="flex-1 flex flex-col h-screen relative bg-theme-950">
            <header
                class="h-16 bg-theme-900/80 backdrop-blur-md border-b border-theme-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 gap-4"
            >
                <div
                    class="md:hidden text-theme-400 font-bold text-sm shrink-0"
                >
                    نونیار
                </div>

                <div class="flex items-center gap-3 md:gap-4 md:mr-0 mr-auto">
                    <button
                        @click="fetchData(true)"
                        class="text-slate-400 hover:text-white transition p-2 rounded-full hover:bg-theme-800"
                        title="بروزرسانی"
                    >
                        🔄
                    </button>

                    <button
                        @click="openModal()"
                        class="bg-theme-500 hover:bg-theme-400 text-white px-3 md:px-5 py-2 rounded-lg shadow-lg shadow-theme-500/20 transition-all flex items-center gap-2 text-xs md:text-sm font-bold whitespace-nowrap"
                    >
                        <span>+</span> نوبت جدید
                    </button>
                    <button
                        @click="openServeModal()"
                        class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 md:px-5 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 text-xs md:text-sm font-bold whitespace-nowrap"
                    >
                        <span>📦</span> تحویل سفارش
                    </button>
                    <button
                        @click="openInjectModal()"
                        class="bg-rose-600 hover:bg-rose-500 text-white px-3 md:px-5 py-2 rounded-lg shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2 text-xs md:text-sm font-bold whitespace-nowrap"
                    >
                        <span>⚡</span> نان فوری
                    </button>
                </div>
            </header>

            <div
                class="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar"
            >
                <div v-if="currentView === 'queue'" class="space-y-6">
                    <div
                        class="hidden md:grid grid-cols-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full py-3 px-4 shadow-2xl mx-auto w-full max-w-3xl items-center"
                    >
                        <div
                            class="flex flex-col items-center justify-center group cursor-default border-l border-white/5 first:border-l-0"
                        >
                            <span
                                class="text-2xl font-mono font-bold text-slate-200 tracking-tighter group-hover:scale-110 transition-transform duration-300"
                            >
                                {{ stats.should_cook }}
                            </span>
                            <span
                                class="text-[10px] uppercase tracking-widest mt-1 font-bold"
                            >
                                تعداد کل نان‌ها
                            </span>
                        </div>

                        <div
                            class="flex flex-col items-center justify-center group cursor-default border-l border-white/5 first:border-l-0"
                        >
                            <span
                                class="text-2xl font-mono font-bold text-emerald-400 tracking-tighter drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] group-hover:scale-110 transition-transform duration-300"
                            >
                                {{ stats.already_cooked }}
                            </span>
                            <span
                                class="text-[10px] text-emerald-400 uppercase tracking-widest mt-1 font-bold"
                            >
                                نان‌های پخته شده
                            </span>
                        </div>

                        <div
                            class="flex flex-col items-center justify-center group cursor-default border-l border-white/5 first:border-l-0"
                        >
                            <span
                                class="text-2xl font-mono font-bold text-amber-400 tracking-tighter drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] group-hover:scale-110 transition-transform duration-300"
                            >
                                {{ stats.remaining }}
                            </span>
                            <span
                                class="text-[10px] text-amber-400 uppercase tracking-widest mt-1 font-bold"
                            >
                                نان‌های پخته نشده
                            </span>
                        </div>

                        <div
                            class="flex flex-col items-center justify-center group cursor-default border-l border-white/5 first:border-l-0"
                        >
                            <span
                                class="text-2xl font-mono font-bold text-white tracking-tighter group-hover:scale-110 transition-transform duration-300"
                            >
                                {{ queueList.length }}
                            </span>
                            <span
                                class="text-[10px] uppercase tracking-widest mt-1 font-bold"
                            >
                                تعداد کل نوبت ها
                            </span>
                        </div>
                    </div>

                    <!-- بخش فیلتر -->
                    <div
                        dir="rtl"
                        class="flex flex-wrap gap-2 justify-start mb-2 px-1"
                    >
                        <button
                            v-for="opt in filterOptions"
                            :key="opt.value"
                            @click="selectedStatusFilter = opt.value"
                            class="px-3 md:px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center gap-2"
                            :class="
                                selectedStatusFilter === opt.value
                                    ? 'bg-theme-500 text-white border-theme-500 shadow-lg shadow-theme-500/20 transform scale-105'
                                    : 'bg-theme-900 text-slate-400 border-theme-800 hover:border-theme-600 hover:text-slate-200'
                            "
                        >
                            {{ opt.label }}
                            <span
                                class="bg-black/20 px-1.5 py-0.5 rounded text-[10px] min-w-[18px] text-center"
                                :class="
                                    selectedStatusFilter === opt.value
                                        ? 'text-white'
                                        : 'text-slate-500'
                                "
                            >
                                {{ getCountByStatus(opt.value) }}
                            </span>
                        </button>
                    </div>

                    <div
                        class="bg-theme-900 rounded-xl border border-theme-800 overflow-hidden shadow-2xl"
                    >
                        <table
                            dir="rtl"
                            class="w-full text-right border-collapse"
                        >
                            <thead
                                class="bg-theme-800 text-slate-400 text-xs uppercase tracking-wider"
                            >
                                <tr>
                                    <th class="p-4 w-24 text-center">نوبت</th>
                                    <th class="p-4">جزئیات سفارش</th>
                                    <th class="p-4 w-24 text-center">
                                        کل تعداد
                                    </th>
                                    <th class="p-4 w-32 text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-theme-800">
                                <tr
                                    v-for="ticket in sortedQueue"
                                    :key="ticket.id"
                                    class="hover:bg-theme-800/50 transition-colors group"
                                >
                                    <td class="p-4 align-top">
                                        <div
                                            class="flex flex-col gap-2 items-center"
                                        >
                                            <span
                                                class="font-mono text-xl font-bold text-theme-400 bg-theme-950 px-2 py-1 rounded-lg border border-theme-700 block text-center w-full"
                                                >#{{ ticket.id }}</span
                                            >
                                            <span
                                                class="text-[10px] px-2 py-1 rounded border w-full text-center font-bold truncate transition-all"
                                                :class="
                                                    getStatusConfig(
                                                        ticket.status,
                                                    ).class
                                                "
                                            >
                                                {{
                                                    getStatusConfig(
                                                        ticket.status,
                                                    ).text
                                                }}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="p-4 align-middle">
                                        <div class="space-y-3">
                                            <div
                                                class="rounded-xl border border-theme-700 bg-theme-900/70 p-3"
                                            >
                                                <div
                                                    class="flex items-center justify-between mb-2"
                                                >
                                                    <span
                                                        class="text-xs font-bold text-theme-300"
                                                        >نان‌های عادی</span
                                                    >
                                                    <span
                                                        class="text-[10px] px-2 py-1 rounded-full border"
                                                        :class="
                                                            ticket.originalBreadStack
                                                                .is_prepared
                                                                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                                                                : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                                                        "
                                                    >
                                                        {{
                                                            ticket
                                                                .originalBreadStack
                                                                .is_prepared
                                                                ? 'آماده شده'
                                                                : 'در انتظار آماده‌سازی'
                                                        }}
                                                    </span>
                                                </div>

                                                <div class="flex flex-wrap gap-2">
                                                    <div
                                                        v-for="(
                                                            count, name
                                                        ) in ticket
                                                            .originalBreadStack
                                                            .breads"
                                                        :key="`original-${name}`"
                                                        v-show="count > 0"
                                                        class="flex items-center bg-theme-800 border border-theme-700 rounded-lg px-2 py-1"
                                                    >
                                                        <span
                                                            class="text-xs text-slate-300 ml-2"
                                                        >
                                                            {{
                                                                config
                                                                    .BREAD_NAMES[
                                                                    name
                                                                ] || name
                                                            }}
                                                        </span>
                                                        <span
                                                            class="bg-theme-700 text-white text-xs font-bold px-1.5 py-0.5 rounded"
                                                            >{{ count }}</span
                                                        >
                                                    </div>
                                                </div>

                                                <p
                                                    v-if="ticket.originalBreadStack.note"
                                                    class="mt-2 text-xs text-slate-300 border-t border-theme-800 pt-2"
                                                >
                                                    <span
                                                        class="text-theme-400 font-bold ml-1"
                                                        >یادداشت:</span
                                                    >
                                                    {{
                                                        ticket
                                                            .originalBreadStack
                                                            .note
                                                    }}
                                                </p>
                                            </div>

                                            <div
                                                v-if="ticket.urgentBreadStacks.length"
                                                class="rounded-xl border border-rose-500/40 bg-rose-950/20 p-3 space-y-2"
                                            >
                                                <p
                                                    class="text-xs font-bold text-rose-300"
                                                >
                                                    نان‌های فوری
                                                </p>
                                                <div
                                                    v-for="urgent in ticket.urgentBreadStacks"
                                                    :key="urgent.urgentId"
                                                    class="rounded-lg border border-rose-500/25 bg-rose-900/20 p-2"
                                                >
                                                    <div
                                                        class="flex items-center justify-between mb-2"
                                                    >
                                                        <span
                                                            class="text-[11px] text-rose-200"
                                                        >
                                                            شناسه فوری:
                                                            {{
                                                                urgent.urgentId
                                                            }}
                                                        </span>
                                                        <span
                                                            class="text-[10px] px-2 py-1 rounded-full border"
                                                            :class="
                                                                urgent.is_prepared
                                                                    ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                                                                    : 'border-rose-400/40 text-rose-300 bg-rose-500/10'
                                                            "
                                                        >
                                                            {{
                                                                urgent.is_prepared
                                                                    ? 'فوری آماده شده'
                                                                    : 'فوری در انتظار'
                                                            }}
                                                        </span>
                                                    </div>

                                                    <div
                                                        class="flex flex-wrap gap-2"
                                                    >
                                                        <div
                                                            v-for="(
                                                                count, name
                                                            ) in urgent.breads"
                                                            :key="`urgent-${urgent.urgentId}-${name}`"
                                                            v-show="count > 0"
                                                            class="flex items-center bg-rose-900/40 border border-rose-500/30 rounded-lg px-2 py-1"
                                                        >
                                                            <span
                                                                class="text-xs text-rose-100 ml-2"
                                                            >
                                                                {{
                                                                    config
                                                                        .BREAD_NAMES[
                                                                        name
                                                                    ] || name
                                                                }}
                                                            </span>
                                                            <span
                                                                class="bg-rose-700 text-white text-xs font-bold px-1.5 py-0.5 rounded"
                                                                >{{ count }}</span
                                                            >
                                                        </div>
                                                    </div>

                                                    <p
                                                        v-if="urgent.reason"
                                                        class="mt-2 text-xs text-rose-100 border-t border-rose-500/20 pt-2"
                                                    >
                                                        <span
                                                            class="text-rose-300 font-bold ml-1"
                                                            >دلیل فوری:</span
                                                        >
                                                        {{ urgent.reason }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-4 text-center align-middle">
                                        <span
                                            class="text-slate-300 font-bold text-lg"
                                            >{{ ticket.totalBread }}</span
                                        >
                                        <span
                                            class="text-xs text-slate-500 block"
                                            >عدد</span
                                        >
                                    </td>
                                    <td class="p-4 align-middle">
                                        <div
                                            class="flex justify-center gap-2 flex-wrap"
                                        >
                                            <template
                                                v-if="
                                                    ticket.status === 'IN_QUEUE'
                                                "
                                            >
                                                <button
                                                    @click="
                                                        openEditModal(ticket)
                                                    "
                                                    class="bg-orange-500 hover:bg-orange-400 text-white p-2 rounded-lg shadow transition text-xs px-3 font-bold"
                                                    title="ویرایش"
                                                >
                                                    ✏️ ویرایش
                                                </button>
                                                <button
                                                    @click="
                                                        deleteTicket(ticket.id)
                                                    "
                                                    class="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg shadow transition text-xs px-3 font-bold"
                                                    title="حذف"
                                                >
                                                    🗑️ حذف
                                                </button>
                                            </template>

                                            <template
                                                v-else-if="
                                                    ticket.status ===
                                                    'TICKET_IS_IN_WAIT_LIST'
                                                "
                                            >
                                                <button
                                                    @click="
                                                        selectIdForServe(
                                                            ticket.id,
                                                        )
                                                    "
                                                    class="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg shadow-lg shadow-emerald-500/20 transition flex items-center gap-1 text-xs px-3 font-bold"
                                                >
                                                    <span>✓</span> تحویل
                                                </button>
                                            </template>

                                            <template v-else>
                                                <span
                                                    class="text-slate-600 text-xs"
                                                    >-</span
                                                >
                                            </template>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div
                            v-if="queueList.length === 0"
                            class="p-10 text-center text-slate-500"
                        >
                            .صف خالی است
                        </div>
                        <div
                            v-else-if="
                                sortedQueue.length === 0 && queueList.length > 0
                            "
                            class="p-10 text-center text-slate-500"
                        >
                            هیچ موردی با وضعیت انتخاب شده وجود ندارد.
                        </div>
                    </div>
                </div>

                <div
                    v-if="currentView === 'production'"
                    class="max-w-4xl mx-auto space-y-8"
                >
                    <div
                        class="hidden md:grid grid-cols-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full py-3 px-4 shadow-2xl mx-auto w-full max-w-3xl items-center"
                    >
                        <div
                            class="flex flex-col items-center justify-center group cursor-default border-l border-white/5 first:border-l-0"
                        >
                            <span
                                class="text-2xl font-mono font-bold text-slate-200 tracking-tighter group-hover:scale-110 transition-transform duration-300"
                            >
                                {{ stats.should_cook }}
                            </span>
                            <span
                                class="text-[10px] uppercase tracking-widest mt-1 font-bold"
                            >
                                تعداد کل نان‌ها
                            </span>
                        </div>

                        <div
                            class="flex flex-col items-center justify-center group cursor-default border-l border-white/5 first:border-l-0"
                        >
                            <span
                                class="text-2xl font-mono font-bold text-emerald-400 tracking-tighter drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] group-hover:scale-110 transition-transform duration-300"
                            >
                                {{ stats.already_cooked }}
                            </span>
                            <span
                                class="text-[10px] text-emerald-400 uppercase tracking-widest mt-1 font-bold"
                            >
                                نان‌های پخته شده
                            </span>
                        </div>

                        <div
                            class="flex flex-col items-center justify-center group cursor-default border-l border-white/5 first:border-l-0"
                        >
                            <span
                                class="text-2xl font-mono font-bold text-amber-400 tracking-tighter drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] group-hover:scale-110 transition-transform duration-300"
                            >
                                {{ stats.remaining }}
                            </span>
                            <span
                                class="text-[10px] text-amber-400 uppercase tracking-widest mt-1 font-bold"
                            >
                                نان‌های پخته نشده
                            </span>
                        </div>

                        <div
                            class="flex flex-col items-center justify-center group cursor-default border-l border-white/5 first:border-l-0"
                        >
                            <span
                                class="text-2xl font-mono font-bold text-white tracking-tighter group-hover:scale-110 transition-transform duration-300"
                            >
                                {{ queueList.length }}
                            </span>
                            <span
                                class="text-[10px] uppercase tracking-widest mt-1 font-bold"
                            >
                                تعداد کل نوبت ها
                            </span>
                        </div>
                    </div>

                    <div
                        class="bg-gradient-to-br from-theme-800 to-theme-900 rounded-3xl p-1 border-2 border-amber-500/50 shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)]"
                    >
                        <div
                            class="bg-theme-900 rounded-[22px] p-8 text-center relative overflow-hidden"
                        >
                            <div v-if="bakerData.hasCustomer">
                                <div
                                    class="absolute top-0 right-0 bg-amber-500 text-black font-bold px-4 py-2 rounded-bl-2xl text-sm animate-pulse"
                                >
                                    باید پخته شود
                                </div>

                                <h2 class="text-slate-400 mb-2">
                                    :نان های مشتری
                                </h2>
                                <div
                                    class="text-6xl font-black text-white font-mono mb-8 tracking-widest text-shadow"
                                >
                                    {{ bakerData.customerId }}
                                </div>

                                <div class="space-y-4" dir="rtl">
                                    <div
                                        class="rounded-xl border border-theme-700 bg-theme-900/70 p-4 text-right"
                                    >
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-sm font-bold text-theme-300">نان‌های عادی</span>
                                            <span
                                                class="text-[10px] px-2 py-1 rounded-full border"
                                                :class="
                                                    bakerData.originalBreadStack.is_prepared
                                                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                                                        : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                                                "
                                            >
                                                {{
                                                    bakerData.originalBreadStack.is_prepared
                                                        ? 'آماده شده'
                                                        : 'در انتظار آماده‌سازی'
                                                }}
                                            </span>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div
                                                v-for="(count, breadId) in bakerData.originalBreadStack.breads"
                                                :key="`baker-original-${breadId}`"
                                                v-show="count > 0"
                                                class="flex items-center justify-between bg-theme-800 p-4 rounded-xl border border-theme-700"
                                            >
                                                <span class="text-xl text-slate-200">{{ getBreadName(breadId) }}</span>
                                                <span class="text-3xl font-bold text-amber-400"
                                                    >{{ count }}
                                                    <span class="text-sm text-slate-500 font-normal">عدد</span></span
                                                >
                                            </div>
                                        </div>

                                        <p
                                            v-if="bakerData.originalBreadStack.note"
                                            class="mt-3 text-xs text-slate-300 border-t border-theme-800 pt-2"
                                        >
                                            <span class="text-theme-400 font-bold ml-1">یادداشت:</span>
                                            {{ bakerData.originalBreadStack.note }}
                                        </p>
                                    </div>

                                    <div
                                        v-if="bakerData.urgentBreadStacks.length"
                                        class="rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 space-y-3 text-right"
                                    >
                                        <p class="text-sm font-bold text-rose-300">نان‌های فوری</p>

                                        <div
                                            v-for="urgent in bakerData.urgentBreadStacks"
                                            :key="`baker-urgent-${urgent.urgentId}`"
                                            class="rounded-lg border border-rose-500/25 bg-rose-900/20 p-3"
                                        >
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="text-[11px] text-rose-200">شناسه فوری: {{ urgent.urgentId }}</span>
                                                <span
                                                    class="text-[10px] px-2 py-1 rounded-full border"
                                                    :class="
                                                        urgent.is_prepared
                                                            ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                                                            : 'border-rose-400/40 text-rose-300 bg-rose-500/10'
                                                    "
                                                >
                                                    {{ urgent.is_prepared ? 'فوری آماده شده' : 'فوری در انتظار' }}
                                                </span>
                                            </div>

                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div
                                                    v-for="(count, breadId) in urgent.breads"
                                                    :key="`baker-urgent-${urgent.urgentId}-${breadId}`"
                                                    v-show="count > 0"
                                                    class="flex items-center justify-between bg-rose-900/40 p-3 rounded-lg border border-rose-500/30"
                                                >
                                                    <span class="text-base text-rose-100">{{ getBreadName(breadId) }}</span>
                                                    <span class="text-xl font-bold text-rose-200">{{ count }}</span>
                                                </div>
                                            </div>

                                            <p
                                                v-if="urgent.reason"
                                                class="mt-2 text-xs text-rose-100 border-t border-rose-500/20 pt-2"
                                            >
                                                <span class="text-rose-300 font-bold ml-1">دلیل فوری:</span>
                                                {{ urgent.reason }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="mt-8 pt-6 border-t border-theme-800 flex justify-center"
                                >
                                    <button
                                        @click="bakeBread()"
                                        :disabled="isSubmitting"
                                        class="bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg px-12 py-4 rounded-2xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span class="text-2xl">🥯</span>
                                        <span>یک نان پخته شد</span>
                                    </button>
                                </div>
                            </div>

                            <div v-else class="py-10 text-slate-500 text-lg">
                                <p>.هیچ نانی برای پخت در صف نیست</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <transition name="toast">
            <div
                v-if="showToast"
                class="fixed top-6 left-0 right-0 mx-auto w-max z-[100] flex items-center gap-4 px-6 py-4 backdrop-blur-md border text-slate-100 rounded-2xl transition-colors duration-300"
                :class="
                    toastConfig.type === 'success'
                        ? 'bg-slate-900/95 border-emerald-500/50 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)]'
                        : 'bg-slate-900/95 border-red-500/50 shadow-[0_10px_40px_-10px_rgba(239,68,68,0.5)]'
                "
            >
                <div
                    class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    :class="
                        toastConfig.type === 'success'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                    "
                >
                    <svg
                        v-if="toastConfig.type === 'success'"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                <div class="flex flex-col text-center">
                    <span
                        class="font-bold text-base"
                        :class="
                            toastConfig.type === 'success'
                                ? 'text-emerald-400'
                                : 'text-red-400'
                        "
                    >
                        {{ toastConfig.message }}
                    </span>
                    <span
                        v-if="toastConfig.subMessage"
                        class="text-sm text-slate-300 mt-0.5"
                    >
                        <b class="text-white text-base">{{
                            toastConfig.subMessage
                        }}</b>
                    </span>
                </div>
            </div>
        </transition>

        <transition name="fade">
            <div
                v-if="showModal"
                class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                @click.self="closeModal"
            >
                <div
                    class="bg-theme-900 w-full max-w-lg rounded-2xl border border-theme-700 shadow-2xl flex flex-col max-h-[90vh]"
                >
                    <div
                        class="p-6 border-b border-theme-800 flex justify-between items-center bg-theme-800/50 rounded-t-2xl"
                    >
                        <h3 class="text-xl font-bold text-white">
                            {{
                                editingTicketId
                                    ? 'ویرایش نوبت'
                                    : 'ثبت نوبت جدید'
                            }}
                            <span
                                v-if="editingTicketId"
                                class="text-theme-400 font-mono text-lg mr-2"
                                >#{{ editingTicketId }}</span
                            >
                        </h3>
                        <button
                            @click="closeModal"
                            class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-theme-800 transition"
                        >
                            ✕
                        </button>
                    </div>

                    <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <div class="space-y-4">
                            <label
                                class="block text-sm text-slate-400 mb-2 uppercase tracking-wide font-medium"
                                >انتخاب نان‌ها</label
                            >

                            <div
                                v-for="(name, id) in config.BREAD_NAMES"
                                :key="id"
                                class="flex items-center justify-between bg-theme-800 p-4 rounded-xl border border-theme-700 hover:border-theme-600 transition-colors"
                            >
                                <span
                                    class="text-slate-100 text-lg font-medium pr-2"
                                    >{{ name }}</span
                                >
                                <div class="flex items-center gap-4">
                                    <button
                                        @click="decrementBread(id)"
                                        class="w-12 h-12 flex items-center justify-center rounded-xl bg-theme-950 text-slate-300 hover:bg-theme-700 hover:text-white active:scale-95 transition-all text-2xl font-bold border border-theme-900"
                                    >
                                        -
                                    </button>

                                    <span
                                        class="font-mono text-3xl font-bold w-10 text-center text-white"
                                        >{{
                                            form.bread_requirements[id] || 0
                                        }}</span
                                    >

                                    <button
                                        @click="incrementBread(id)"
                                        class="w-12 h-12 flex items-center justify-center rounded-xl bg-theme-500 text-white hover:bg-theme-400 active:scale-95 transition-all shadow-lg shadow-theme-500/20 text-2xl font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div class="mt-2">
                                <label
                                    class="block text-sm text-slate-400 mb-2 font-bold"
                                    >یادداشت سفارش (اختیاری)</label
                                >
                                <textarea
                                    v-model="form.note"
                                    rows="3"
                                    placeholder="مثلاً: بدون کنجد، یا سریع‌تر آماده شود..."
                                    class="w-full bg-theme-950 border border-theme-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-theme-500 focus:ring-1 focus:ring-theme-500 transition-all"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div
                        class="p-6 border-t border-theme-800 bg-theme-800/30 rounded-b-2xl flex gap-4"
                    >
                        <button
                            @click="closeModal"
                            class="flex-1 py-4 rounded-xl border border-theme-600 text-slate-300 hover:bg-theme-800 hover:text-white transition font-medium text-base"
                        >
                            بستن
                        </button>
                        <button
                            @click="submitOrder"
                            :disabled="isSubmitting"
                            class="flex-[2] bg-theme-500 hover:bg-theme-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-theme-500/20 transition text-base flex items-center justify-center gap-2"
                        >
                            <span v-if="isSubmitting" class="animate-spin"
                                >⏳</span
                            >
                            {{ editingTicketId ? 'ویرایش نوبت' : 'ثبت سفارش' }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="fade">
            <div
                v-if="showServeModal"
                class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                @click.self="closeServeModal"
            >
                <div
                    class="bg-theme-900 w-full max-w-2xl rounded-3xl border border-theme-700 shadow-2xl flex flex-col max-h-[95vh]"
                >
                    <div
                        dir="rtl"
                        class="p-6 border-b border-theme-800 flex justify-between items-center bg-theme-800/50 rounded-t-3xl shrink-0"
                    >
                        <h3
                            class="text-2xl font-bold text-white flex items-center gap-3"
                        >
                            <span class="text-3xl">📦</span>
                            <span>تحویل سفارش</span>
                        </h3>
                        <button
                            @click="closeServeModal"
                            class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-theme-700 transition bg-theme-800 border border-theme-700"
                        >
                            <span class="text-xl">✕</span>
                        </button>
                    </div>

                    <div
                        class="p-8 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-8"
                    >
                        <div
                            v-if="servedResult"
                            dir="rtl"
                            class="bg-emerald-500/5 border border-emerald-500/30 rounded-2xl p-6 text-center animate-pulse-once"
                        >
                            <div
                                class="flex items-center justify-center gap-4 mb-6"
                            >
                                <h4
                                    class="text-emerald-400 font-extrabold text-2xl"
                                >
                                    تحویل با موفقیت ثبت شد
                                </h4>
                                <div
                                    class="w-12 h-12 bg-emerald-500 text-white rounded-full flex shrink-0 items-center justify-center text-2xl shadow-lg shadow-emerald-500/20"
                                >
                                    ✓
                                </div>
                            </div>

                            <div
                                class="bg-theme-950/80 rounded-xl border border-theme-800 overflow-hidden"
                            >
                                <div
                                    class="bg-theme-800/50 px-6 py-3 border-b border-theme-800 text-slate-400 text-sm font-bold text-right"
                                >
                                    نان های مورد نیاز مشتری:
                                </div>
                                <div class="divide-y divide-theme-800/50 p-2">
                                    <template
                                        v-for="(count, breadId) in servedResult"
                                        :key="breadId"
                                    >
                                        <div
                                            v-if="count > 0"
                                            class="flex justify-between items-center p-4 hover:bg-theme-800/30 transition rounded-lg mx-2"
                                        >
                                            <span
                                                class="text-slate-200 text-lg font-medium"
                                                >{{
                                                    getBreadName(breadId)
                                                }}</span
                                            >
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <span
                                                    class="font-black text-white text-2xl"
                                                    >{{ count }}</span
                                                >
                                                <span
                                                    class="text-sm font-normal text-slate-500 mt-1"
                                                    >عدد</span
                                                >
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <button
                                @click="resetServeModal"
                                class="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg transform active:scale-[0.98]"
                            >
                                تحویل نفر بعدی
                            </button>
                        </div>

                        <div v-else class="space-y-8" dir="rtl">
                            <div
                                class="bg-theme-800/30 p-6 rounded-2xl border border-theme-800/50"
                            >
                                <label
                                    class="block text-base text-slate-300 mb-3 font-bold"
                                    >شماره نوبت را وارد کنید:</label
                                >
                                <div class="flex gap-3">
                                    <input
                                        v-model="serveIdInput"
                                        type="number"
                                        placeholder="مثلا: 12"
                                        class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 bg-theme-950 border-2 border-theme-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-mono text-center text-2xl placeholder:text-slate-600 transition-all"
                                        @keyup.enter="submitServeById"
                                    />
                                    <button
                                        @click="submitServeById"
                                        :disabled="
                                            isSubmitting || !serveIdInput
                                        "
                                        class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 rounded-xl font-bold text-lg transition shadow-xl shadow-indigo-600/20"
                                    >
                                        <span v-if="isSubmitting">⏳</span>
                                        <span v-else>تایید</span>
                                    </button>
                                </div>
                            </div>

                            <div v-if="readyToServeList.length > 0">
                                <div
                                    class="flex items-center justify-between mb-3 px-2"
                                >
                                    <span
                                        class="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2"
                                    >
                                        <span
                                            class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                                        ></span>
                                        نوبت‌های آماده تحویل
                                    </span>
                                    <span
                                        class="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-full font-bold"
                                        >{{
                                            readyToServeList.length
                                        }}
                                        مورد</span
                                    >
                                </div>

                                <div
                                    class="bg-theme-950 rounded-2xl border border-theme-800 p-2 space-y-2"
                                >
                                    <div
                                        v-for="ticket in readyToServeList"
                                        :key="ticket.id"
                                        @click="selectIdForServe(ticket.id)"
                                        class="p-3 flex justify-between items-center hover:bg-theme-800 border border-transparent hover:border-theme-700 cursor-pointer transition-all rounded-xl group relative overflow-hidden"
                                    >
                                        <div
                                            class="absolute inset-0 bg-gradient-to-l from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                        ></div>

                                        <div
                                            class="flex items-center gap-4 w-full relative z-10"
                                        >
                                            <span
                                                class="w-12 h-12 flex shrink-0 items-center justify-center bg-emerald-600 text-white rounded-xl font-black text-xl shadow-lg shadow-emerald-900/20 border border-emerald-500"
                                            >
                                                {{ ticket.id }}
                                            </span>

                                            <div
                                                class="flex flex-wrap gap-2 flex-1"
                                            >
                                                <div
                                                    v-for="(
                                                        count, name
                                                    ) in ticket.details"
                                                    :key="name"
                                                    class="flex items-center bg-theme-800 border border-theme-700 pl-2 pr-1.5 py-1 rounded-lg text-slate-300"
                                                >
                                                    <span
                                                        class="text-xs font-medium ml-1.5"
                                                    >
                                                        {{
                                                            config.BREAD_NAMES[
                                                                name
                                                            ] || name
                                                        }}
                                                    </span>
                                                    <span
                                                        class="bg-theme-700 text-white px-1.5 py-0.5 rounded text-xs font-bold min-w-[1.25rem] text-center shadow-inner"
                                                        >{{ count }}</span
                                                    >
                                                </div>
                                            </div>
                                        </div>

                                        <span
                                            class="text-xl text-emerald-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 shrink-0 mr-2 font-bold relative z-10"
                                        >
                                            ←
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div
                                v-else
                                class="text-center p-10 border-2 border-dashed border-theme-800/50 bg-theme-800/20 rounded-2xl text-slate-500"
                            >
                                <p class="text-lg">
                                    هیچ نوبتی در وضعیت "در انتظار" نیست.
                                </p>
                                <p class="text-sm opacity-70 mt-2">
                                    نوبت‌ها پس از پخت کامل به اینجا اضافه
                                    می‌شوند.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Inject Urgent Modal -->
        <transition name="fade">
            <div
                v-if="showInjectModal"
                class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                @click.self="closeInjectModal"
            >
                <div
                    class="bg-theme-900 w-full max-w-lg rounded-2xl border border-theme-700 shadow-2xl flex flex-col max-h-[90vh]"
                >
                    <!-- Header -->
                    <div
                        class="p-6 border-b border-theme-800 flex justify-between items-center bg-theme-800/50 rounded-t-2xl"
                    >
                        <h3
                            class="text-xl font-bold text-white flex items-center gap-2"
                        >
                            <span class="text-rose-500 text-2xl">⚡</span>
                            تزریق نان فوری
                        </h3>
                        <button
                            @click="closeInjectModal"
                            class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-theme-800 transition"
                        >
                            ✕
                        </button>
                    </div>

                    <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <!-- Mode Switcher -->
                        <div
                            class="flex bg-theme-950 p-1.5 rounded-xl mb-6 border border-theme-800"
                        >
                            <button
                                @click="injectMode = 'free'"
                                class="flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                                :class="
                                    injectMode === 'free'
                                        ? 'bg-theme-700 text-white shadow'
                                        : 'text-slate-500 hover:text-slate-300'
                                "
                            >
                                آزاد (بدون نوبت)
                            </button>
                            <button
                                @click="injectMode = 'ticket'"
                                class="flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                                :class="
                                    injectMode === 'ticket'
                                        ? 'bg-theme-700 text-white shadow'
                                        : 'text-slate-500 hover:text-slate-300'
                                "
                            >
                                افزودن به نوبت خاص
                            </button>
                        </div>

                        <!-- Ticket ID Input (Only shown if mode is 'ticket') -->
                        <div
                            v-if="injectMode === 'ticket'"
                            class="mb-6 animate-pulse-once"
                        >
                            <label
                                class="block text-sm text-slate-400 mb-2 font-bold"
                                >شماره نوبت:</label
                            >
                            <input
                                v-model="injectTicketId"
                                type="number"
                                placeholder="مثلا: 125"
                                class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full bg-theme-950 border border-theme-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-center text-lg"
                            />
                        </div>

                        <!-- Bread Counters -->
                        <div class="space-y-3">
                            <label
                                class="block text-sm text-slate-400 mb-1 uppercase tracking-wide font-medium"
                                >تعداد نان‌های اضافی</label
                            >

                            <div
                                v-for="(name, id) in config.BREAD_NAMES"
                                :key="id"
                                class="flex items-center justify-between bg-theme-800/50 p-3 rounded-xl border border-theme-700/50 hover:border-theme-600 transition-colors"
                            >
                                <span
                                    class="text-slate-200 text-base font-medium pr-2"
                                    >{{ name }}</span
                                >
                                <div class="flex items-center gap-3">
                                    <button
                                        @click="decrementInjectBread(id)"
                                        class="w-10 h-10 flex items-center justify-center rounded-lg bg-theme-950 text-slate-300 hover:bg-theme-700 hover:text-white transition-all text-xl font-bold border border-theme-900"
                                    >
                                        -
                                    </button>

                                    <span
                                        class="font-mono text-2xl font-bold w-8 text-center text-rose-400"
                                        >{{ injectBreads[id] || 0 }}</span
                                    >

                                    <button
                                        @click="incrementInjectBread(id)"
                                        class="w-10 h-10 flex items-center justify-center rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20 text-xl font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6">
                            <label
                                class="block text-sm text-slate-400 mb-2 font-bold"
                                >دلیل نان فوری (اختیاری)</label
                            >
                            <textarea
                                v-model="injectReason"
                                rows="3"
                                placeholder="مثلاً: مشتری عجله دارد یا سفارش جا مانده است..."
                                class="w-full bg-theme-950 border border-theme-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                            ></textarea>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div
                        class="p-6 border-t border-theme-800 bg-theme-800/30 rounded-b-2xl flex gap-4"
                    >
                        <button
                            @click="closeInjectModal"
                            class="flex-1 py-3 rounded-xl border border-theme-600 text-slate-300 hover:bg-theme-800 hover:text-white transition font-medium"
                        >
                            انصراف
                        </button>
                        <button
                            @click="submitInject"
                            :disabled="isSubmitting"
                            class="flex-[2] bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
                        >
                            <span v-if="isSubmitting" class="animate-spin"
                                >⏳</span
                            >
                            تایید و ارسال فوری
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

// --- CONFIGURATION ---
const config = {
    API_BASE: '/api',
    BAKERY_ID: 2,

    // 👇 توکن ثابت نانوایی
    TOKEN: 'UhkN3f3-fgldAzY--tCCWGh8O8gqCToZmHWfFOtGZv4',

    BREAD_NAMES: {
        5: 'سنگک ساده',
        6: 'سنگک کنجدی',
        7: 'بزرگ ساده',
        8: 'بزرگ کنجدی',
    },
};

// State
const currentView = ref('queue');
const showModal = ref(false);
const isLoading = ref(false);
const isSubmitting = ref(false);
const isOnline = ref(true);
const lastCreatedTicket = ref(null);
const editingTicketId = ref(null);

// Inject Modal State
const showInjectModal = ref(false);
const injectMode = ref('ticket'); // Changed default to 'ticket'
const injectTicketId = ref('');
const injectBreads = reactive({});
const injectReason = ref('');

// Toast State
const showToast = ref(false);
let toastTimer = null;
const toastConfig = reactive({
    message: '',
    subMessage: '',
    type: 'success', // 'success' | 'error'
});

// Data
const queueList = ref([]);
const bakerData = reactive({
    hasCustomer: false,
    customerId: null,
    originalBreadStack: {
        breads: {},
        is_prepared: false,
        note: '',
    },
    urgentBreadStacks: [],
    breadIndex: 1,
});

// Stats
const stats = reactive({
    should_cook: 0,
    already_cooked: 0,
    remaining: 0,
    current_customer_id: null,
});

// Form
const form = reactive({
    bread_requirements: {},
    note: '',
});

// --- Serve Modal State ---
const showServeModal = ref(false);
const serveIdInput = ref('');
const servedResult = ref(null);

// --- Filtering State ---
const selectedStatusFilter = ref('ALL');
const filterOptions = [
    { label: 'همه موارد', value: 'ALL' },
    { label: 'در صف', value: 'IN_QUEUE' },
    { label: 'درحال آماده‌سازی', value: 'CURRENTLY_WORKING' },
    { label: 'درحال پخت', value: 'ALL_BREADS_PREPARED' },
    { label: 'آماده تحویل', value: 'TICKET_IS_IN_WAIT_LIST' },
    { label: 'تحویل شده', value: 'TICKET_IS_SERVED' },
];

// --- Computed ---
const readyToServeList = computed(() => {
    if (!queueList.value) return [];
    return queueList.value.filter((t) => t.status === 'TICKET_IS_IN_WAIT_LIST');
});

const sortedQueue = computed(() => {
    if (!queueList.value) return [];

    let filtered = queueList.value;

    if (selectedStatusFilter.value !== 'ALL') {
        filtered = filtered.filter(
            (t) => t.status === selectedStatusFilter.value,
        );
    } else {
        filtered = filtered.filter((t) => t.status !== 'TICKET_IS_SERVED');
    }

    return filtered.sort((a, b) => a.id - b.id);
});

// --- Helper Functions ---
const triggerToast = (message, type = 'success', subMessage = '') => {
    toastConfig.message = message;
    toastConfig.type = type;
    toastConfig.subMessage = subMessage;

    if (toastTimer) clearTimeout(toastTimer);
    showToast.value = false;

    setTimeout(() => {
        showToast.value = true;
        toastTimer = setTimeout(() => {
            showToast.value = false;
        }, 4000);
    }, 100);
};

const getCountByStatus = (status) => {
    if (!queueList.value) return 0;
    if (status === 'ALL') {
        return queueList.value.filter((t) => t.status !== 'TICKET_IS_SERVED')
            .length;
    }
    return queueList.value.filter((t) => t.status === status).length;
};

const getStatusConfig = (status) => {
    const map = {
        IN_QUEUE: {
            text: 'در صف',
            class: 'bg-slate-700/50 text-slate-300 border-slate-600',
        },
        TICKET_IS_IN_WAIT_LIST: {
            text: 'آماده تحویل ✅',
            class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        },
        CURRENTLY_WORKING: {
            text: 'درحال آماده سازی 👨🏻‍🍳',
            class: 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse',
        },
        ALL_BREADS_PREPARED: {
            text: 'درحال پخت 🔥',
            class: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
        },
        TICKET_IS_SERVED: {
            text: 'تحویل شده',
            class: 'bg-gray-800 text-gray-500 border-gray-700 decoration-gray-500',
        },
    };
    return (
        map[status] || {
            text: 'نامشخص',
            class: 'bg-slate-800 text-slate-400 border-slate-700',
        }
    );
};

// --- API Helpers ---
const callApi = async (endpoint, method = 'GET', body = null) => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${config.API_BASE}${cleanEndpoint}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.TOKEN}`,
        };

        const options = {
            method,
            headers,
        };

        if (body) options.body = JSON.stringify(body);

        const res = await fetch(url, options);

        if (res.status === 401 || res.status === 403) {
            console.error('⛔ خطای دسترسی (401/403).');
        }

        if (!res.ok) {
            const text = await res.text();
            console.error('❌ API Error Body:', text);
            throw new Error(`Server Error: ${res.status}`);
        }

        const json = await res.json();
        isOnline.value = true;
        return json;
    } catch (error) {
        console.error('🔥 Network/Code Error inside callApi:', error);
        isOnline.value = false;
        throw error;
    }
};

// --- Actions ---
const fetchData = async (showLoading = false) => {
    if (showLoading) isLoading.value = true;

    try {
        const [progressRes, queueRes, bakerRes] = await Promise.all([
            callApi(`/manage/bread_progress/${config.BAKERY_ID}`),
            callApi(`/queue_all_ticket_summary/${config.BAKERY_ID}`),
            callApi(`/hc/current_cook_customer/${config.BAKERY_ID}`),
        ]);

        if (progressRes) {
            stats.should_cook = progressRes.should_cook || 0;
            stats.already_cooked = progressRes.already_cooked || 0;
            stats.remaining = progressRes.remaining || 0;
            stats.current_customer_id = progressRes.current_customer_id || null;
        }

        if (queueRes && typeof queueRes === 'object') {
            const entries = Object.entries(queueRes);
            queueList.value = entries
                .map(([id, data]) => {
                    const numericId = parseInt(id);
                    if (!data || typeof data !== 'object') {
                        return null;
                    }

                    const originalBreadStack = {
                        breads:
                            data.original_breads?.breads &&
                            typeof data.original_breads.breads === 'object'
                                ? data.original_breads.breads
                                : {},
                        is_prepared: Boolean(data.original_breads?.is_prepared),
                        note: data.original_breads?.note || '',
                    };

                    const urgentBreadStacks =
                        data.urgent_breads && typeof data.urgent_breads === 'object'
                            ? Object.entries(data.urgent_breads).map(
                                  ([urgentId, urgentData]) => ({
                                      urgentId,
                                      breads:
                                          urgentData?.breads &&
                                          typeof urgentData.breads === 'object'
                                              ? urgentData.breads
                                              : {},
                                      is_prepared: Boolean(
                                          urgentData?.is_prepared,
                                      ),
                                      reason: urgentData?.reason || '',
                                  }),
                              )
                            : [];

                    const originalTotal = Object.values(
                        originalBreadStack.breads,
                    ).reduce((sum, count) => sum + (count || 0), 0);
                    const urgentTotal = urgentBreadStacks.reduce(
                        (sum, urgent) =>
                            sum +
                            Object.values(urgent.breads).reduce(
                                (breadSum, count) => breadSum + (count || 0),
                                0,
                            ),
                        0,
                    );

                    return {
                        id: numericId,
                        token: data.token,
                        status: data.status,
                        totalBread: originalTotal + urgentTotal,
                        details: originalBreadStack.breads,
                        originalBreadStack,
                        urgentBreadStacks,
                    };
                })
                .filter((ticket) => ticket !== null && !isNaN(ticket.id));
        } else {
            queueList.value = [];
        }

        if (bakerRes && typeof bakerRes === 'object') {
            const resolvedCustomerId =
                bakerRes.customer_id || bakerRes.ticket_id || bakerRes.id || null;

            const originalBreadStack = {
                breads:
                    bakerRes.original_breads?.breads &&
                    typeof bakerRes.original_breads.breads === 'object'
                        ? bakerRes.original_breads.breads
                        : bakerRes.customer_breads || {},
                is_prepared: Boolean(bakerRes.original_breads?.is_prepared),
                note: bakerRes.original_breads?.note || '',
            };

            const urgentBreadStacks =
                bakerRes.urgent_breads && typeof bakerRes.urgent_breads === 'object'
                    ? Object.entries(bakerRes.urgent_breads).map(
                          ([urgentId, urgentData]) => ({
                              urgentId,
                              breads:
                                  urgentData?.breads &&
                                  typeof urgentData.breads === 'object'
                                      ? urgentData.breads
                                      : {},
                              is_prepared: Boolean(urgentData?.is_prepared),
                              reason: urgentData?.reason || '',
                          }),
                      )
                    : [];

            const hasOriginal = Object.values(originalBreadStack.breads).some(
                (count) => (count || 0) > 0,
            );
            const hasUrgent = urgentBreadStacks.some((urgent) =>
                Object.values(urgent.breads).some((count) => (count || 0) > 0),
            );

            bakerData.hasCustomer = Boolean(resolvedCustomerId && (hasOriginal || hasUrgent));
            bakerData.customerId = resolvedCustomerId;
            bakerData.originalBreadStack = originalBreadStack;
            bakerData.urgentBreadStacks = urgentBreadStacks;
            bakerData.breadIndex = bakerRes.bread_index;

            if (!stats.current_customer_id && resolvedCustomerId) {
                stats.current_customer_id = resolvedCustomerId;
            }
        } else {
            bakerData.hasCustomer = false;
            bakerData.customerId = null;
            bakerData.originalBreadStack = {
                breads: {},
                is_prepared: false,
                note: '',
            };
            bakerData.urgentBreadStacks = [];
        }
    } catch (e) {
        console.error('☠️ Error in fetchData:', e);
    } finally {
        isLoading.value = false;
    }
};

const submitOrder = async () => {
    const breadReqs = {};
    for (const id in config.BREAD_NAMES) {
        breadReqs[id] = form.bread_requirements[id] || 0;
    }

    const total = Object.values(breadReqs).reduce((a, b) => a + b, 0);
    if (total === 0) {
        alert('لطفا حداقل یک نان انتخاب کنید');
        return;
    }

    isSubmitting.value = true;

    try {
        let res;
        let successMsg = '';
        let ticketNum = '';

        if (editingTicketId.value) {
            const payload = {
                bakery_id: config.BAKERY_ID,
                customer_ticket_id: editingTicketId.value,
                bread_requirements: breadReqs,
                note: form.note || '',
            };
            await callApi('/manage/modify_ticket', 'PUT', payload);
            successMsg = 'ویرایش با موفقیت انجام شد!';
            ticketNum = editingTicketId.value;
        } else {
            const payload = {
                bakery_id: config.BAKERY_ID,
                bread_requirements: breadReqs,
                note: form.note || '',
            };
            res = await callApi('/hc/new_ticket', 'POST', payload);
            successMsg = 'نوبت با موفقیت ثبت شد!';
            ticketNum = res.customer_ticket_id;
        }

        closeModal();

        triggerToast(successMsg, 'success', `شماره نوبت: ${ticketNum}`);

        fetchData();
    } catch (err) {
        triggerToast('خطا در انجام عملیات', 'error', err.message);
    } finally {
        isSubmitting.value = false;
    }
};

const deleteTicket = async (ticketId) => {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید نوبت #${ticketId} را حذف کنید؟`))
        return;

    isLoading.value = true;
    try {
        await callApi('/manage/remove_ticket', 'PUT', {
            bakery_id: config.BAKERY_ID,
            customer_ticket_id: ticketId,
        });
        fetchData();
    } catch (err) {
        alert('خطا در حذف نوبت: ' + err.message);
    } finally {
        isLoading.value = false;
    }
};

const bakeBread = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    try {
        await callApi(`/hc/new_bread/${config.BAKERY_ID}`, 'POST');
        triggerToast('یک نان با موفقیت پخته شد 🥯', 'success');
        fetchData(false);
    } catch (err) {
        triggerToast('خطا در ثبت پخت', 'error', err.message);
    } finally {
        isSubmitting.value = false;
    }
};

const openServeModal = () => {
    serveIdInput.value = '';
    servedResult.value = null;
    showServeModal.value = true;
};

const closeServeModal = () => {
    showServeModal.value = false;
};

const selectIdForServe = (id) => {
    serveIdInput.value = id;
    servedResult.value = null;
    showServeModal.value = true;
};

const submitServeById = async () => {
    if (!serveIdInput.value) return alert('لطفا شماره نوبت را وارد کنید');

    const targetTicket = queueList.value.find(
        (t) => t.id === parseInt(serveIdInput.value),
    );

    if (!targetTicket) {
        return alert('این شماره نوبت در لیست موجود نیست!');
    }

    if (!targetTicket.token) {
        return alert('توکن برای این نوبت یافت نشد (خطای سیستم)');
    }

    isSubmitting.value = true;
    servedResult.value = null;

    try {
        const payload = {
            bakery_id: config.BAKERY_ID,
            token: targetTicket.token,
        };

        const res = await callApi('/hc/serve_ticket_by_token', 'PUT', payload);

        servedResult.value = res.user_detail;
        fetchData();
        serveIdInput.value = '';
    } catch (err) {
        alert('خطا در تحویل: ' + err.message);
    } finally {
        isSubmitting.value = false;
    }
};

const resetServeModal = () => {
    servedResult.value = null;
    serveIdInput.value = '';
};

// --- Inject/Urgent Methods ---

const openInjectModal = () => {
    injectMode.value = 'ticket'; // Changed default to 'ticket'
    injectTicketId.value = '';
    // ریست کردن تعداد نان‌ها
    for (const id in config.BREAD_NAMES) {
        injectBreads[id] = 0;
    }
    injectReason.value = '';
    showInjectModal.value = true;
};

const closeInjectModal = () => {
    showInjectModal.value = false;
};

const incrementInjectBread = (id) => {
    injectBreads[id] = (injectBreads[id] || 0) + 1;
};

const decrementInjectBread = (id) => {
    if (injectBreads[id] > 0) {
        injectBreads[id]--;
    }
};

const submitInject = async () => {
    // 1. Validation
    const totalBreads = Object.values(injectBreads).reduce(
        (a, b) => a + (b || 0),
        0,
    );
    if (totalBreads === 0) {
        alert('لطفا حداقل یک نان انتخاب کنید.');
        return;
    }

    if (injectMode.value === 'ticket' && !injectTicketId.value) {
        alert('لطفا شماره نوبت را وارد کنید.');
        return;
    }

    isSubmitting.value = true;

    try {
        // 2. Prepare Payload
        const payload = {
            bakery_id: config.BAKERY_ID,
            ticket_id:
                injectMode.value === 'free'
                    ? null
                    : parseInt(injectTicketId.value),
            bread_requirements: { ...injectBreads }, // Copy object
            reason: injectReason.value || '',
        };

        // 3. Call API
        await callApi('/manage/urgent/inject', 'POST', payload);

        // 4. Success
        closeInjectModal();
        triggerToast(
            'نان فوری با موفقیت اضافه شد',
            'success',
            injectMode.value === 'free'
                ? 'به صورت آزاد'
                : `به نوبت #${payload.ticket_id}`,
        );

        // بروزرسانی داده‌ها
        fetchData();
    } catch (err) {
        triggerToast('خطا در تزریق نان', 'error', err.message);
    } finally {
        isSubmitting.value = false;
    }
};

// Utils
const getBreadName = (id) => config.BREAD_NAMES[id] || `نان کد ${id}`;

const openModal = () => {
    editingTicketId.value = null;
    lastCreatedTicket.value = null;
    for (const id in config.BREAD_NAMES) form.bread_requirements[id] = 0;
    form.note = '';
    showModal.value = true;
};

const openEditModal = (ticket) => {
    editingTicketId.value = ticket.id;
    lastCreatedTicket.value = null;

    for (const id in config.BREAD_NAMES) form.bread_requirements[id] = 0;
    form.note = ticket.originalBreadStack?.note || '';

    for (const [key, count] of Object.entries(ticket.details)) {
        if (config.BREAD_NAMES[key]) {
            form.bread_requirements[key] = count;
        } else {
            const foundId = Object.keys(config.BREAD_NAMES).find(
                (k) => config.BREAD_NAMES[k] === key,
            );
            if (foundId) form.bread_requirements[foundId] = count;
        }
    }

    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    editingTicketId.value = null;
    form.note = '';
};
const incrementBread = (id) =>
    (form.bread_requirements[id] = (form.bread_requirements[id] || 0) + 1);
const decrementBread = (id) => {
    if (form.bread_requirements[id] > 0) form.bread_requirements[id]--;
};

// Lifecycle
let intervalId;
onMounted(() => {
    fetchData(true);
    intervalId = setInterval(() => {
        if (!showModal.value && !showServeModal.value && !showInjectModal.value)
            fetchData(false);
    }, 5000);
});
onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #0f172a;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #475569;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(-200%);
}

.toast-enter-to,
.toast-leave-from {
    opacity: 1;
    transform: translateY(0);
}

@keyframes pulse-once {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
}
.animate-pulse-once {
    animation: pulse-once 0.5s ease-in-out 1;
}
</style>
