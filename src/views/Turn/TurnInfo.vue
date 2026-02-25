<template>
    <div
        class="min-h-screen bg-slate-900 text-slate-100 flex justify-center items-center p-4"
        dir="rtl"
    >
        <div
            class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none"
        >
            <div
                class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl opacity-50"
            ></div>
            <div
                class="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl opacity-50"
            ></div>
        </div>
        <div
            class="w-full max-w-md bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl overflow-hidden relative transition-all duration-300"
        >
            <div
                v-if="isLoading"
                class="flex flex-col items-center justify-center min-h-[500px]"
            >
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"
                ></div>
                <span class="text-slate-400 text-sm animate-pulse"
                    >در حال دریافت اطلاعات...</span
                >
            </div>

            <div
                v-else-if="ticketNotFound"
                class="p-10 text-center flex flex-col items-center justify-center min-h-[500px]"
            >
                <div
                    class="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-6"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-red-400 mb-2">
                    نوبت یافت نشد
                </h3>
                <p class="text-slate-400">
                    شماره نوبت یا کد نانوایی نامعتبر است.
                </p>
            </div>
            <div v-else>
                <div class="mb-6 p-8 text-center relative">
                    <h2
                        v-if="!isInWaitList && !isServed"
                        class="text-slate-300 text-xl font-medium mb-8 tracking-wide"
                    >
                        نوبت فعلی نانوایی:
                    </h2>
                    <h2
                        v-else-if="isInWaitList && !isServed"
                        class="text-emerald-400 text-2xl font-bold mb-8 tracking-wide animate-pulse"
                    >
                        نوبت شما رسید!
                    </h2>
                    <div
                        class="relative inline-flex justify-center items-center w-60 h-60"
                    >
                        <div
                            class="absolute inset-0 rounded-full border-3 border-slate-700"
                        ></div>
                        <div
                            class="absolute inset-0 rounded-full border-[3px] transition-all duration-500"
                            :class="statusRingClass"
                        ></div>
                        <div
                            class="flex flex-col items-center justify-center z-10 w-full px-4 text-center h-full"
                        >
                            <span
                                v-if="!isInWaitList && !isServed"
                                class="translate-y-[10%] text-8xl font-black bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent drop-shadow-sm"
                            >
                                {{ currentTurn }}
                            </span>
                            <div
                                v-else-if="isInWaitList"
                                class="flex flex-col items-center animate-pulse"
                            >
                                <span
                                    class="text-4xl font-black text-emerald-400 leading-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                >
                                    مراجعه<br />به نانوایی
                                </span>
                            </div>
                            <div
                                v-else-if="isServed"
                                class="flex flex-col items-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-16 w-16 text-blue-500 mb-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <span
                                    class="text-2xl font-black text-blue-400 leading-tight"
                                >
                                    سفارش تحویل<br />داده شد
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="!isServed && lastUpdated"
                        class="mt-8 flex justify-center"
                    >
                        <button
                            @click="handleManualRefresh"
                            :disabled="isFetching"
                            class="relative group overflow-hidden flex items-center gap-2.5 px-4 py-2 bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-full shadow-lg shadow-black/20 transition-all duration-300 hover:bg-slate-800/50 hover:border-slate-600 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                        >
                            <span class="relative flex h-2.5 w-2.5">
                                <span
                                    v-if="isDataFresh"
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                ></span>
                                <span
                                    class="relative inline-flex rounded-full h-2.5 w-2.5 transition-colors duration-500"
                                    :class="
                                        isDataFresh
                                            ? 'bg-emerald-500'
                                            : 'bg-yellow-500'
                                    "
                                ></span>
                            </span>

                            <transition name="slide-vertical" mode="out-in">
                                <span
                                    :key="
                                        isFetching ? 'loading' : lastUpdateText
                                    "
                                    class="text-slate-300 font-medium tracking-wide opacity-90 dir-rtl select-none block min-w-[90px] text-center"
                                >
                                    {{
                                        isFetching
                                            ? 'در حال بروزرسانی...'
                                            : lastUpdateText
                                    }}
                                </span>
                            </transition>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5 text-slate-500 transition-transform duration-700"
                                :class="{
                                    'animate-spin-once text-emerald-400':
                                        isManualRefreshing,
                                    'group-hover:rotate-180':
                                        !isManualRefreshing,
                                }"
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
                <div v-if="isServed" class="px-6 pb-10 text-center">
                    <transition name="scale-fade" mode="out-in">
                        <div
                            v-if="!ratingSubmitted"
                            key="rate-form"
                            class="bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700 shadow-xl relative overflow-hidden group"
                        >
                            <div
                                class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
                            ></div>

                            <h3
                                class="text-xl font-bold text-white mb-2 relative z-10"
                            >
                                تجربه شما چطور بود؟
                            </h3>
                            <p
                                class="text-slate-400 text-sm mb-8 relative z-10"
                            >
                                با ثبت امتیاز به بهبود کیفیت ما کمک کنید.
                            </p>

                            <div
                                class="flex justify-between items-end w-full px-1 mb-8 dir-ltr relative z-10"
                            >
                                <button
                                    v-for="star in 5"
                                    :key="star"
                                    @click="selectedRating = star"
                                    @mouseenter="hoveredStar = star"
                                    @mouseleave="hoveredStar = 0"
                                    class="focus:outline-none transform transition-transform duration-200 hover:scale-110 active:scale-95 flex flex-col items-center gap-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-10 w-10 transition-all duration-300 filter"
                                        :class="
                                            hoveredStar >= star ||
                                            (!hoveredStar &&
                                                selectedRating >= star)
                                                ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                                                : 'text-slate-600 hover:text-slate-500'
                                        "
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                        />
                                    </svg>

                                    <span
                                        class="text-xs font-bold transition-colors duration-200"
                                        :class="
                                            hoveredStar >= star ||
                                            (!hoveredStar &&
                                                selectedRating >= star)
                                                ? 'text-white'
                                                : 'text-slate-600'
                                        "
                                    >
                                        {{ star }}
                                    </span>
                                </button>
                            </div>

                            <button
                                @click="submitRating"
                                :disabled="selectedRating === 0"
                                class="w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
                                :class="
                                    selectedRating > 0
                                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25 active:scale-[0.98]'
                                        : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                                "
                            >
                                <span class="relative z-10">ثبت امتیاز</span>
                                <div
                                    v-if="selectedRating > 0"
                                    class="absolute inset-0 -translate-x-full hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
                                ></div>
                            </button>
                        </div>

                        <div
                            v-else
                            key="rate-success"
                            class="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden text-center"
                        >
                            <div
                                class="relative z-10 flex flex-col items-center"
                            >
                                <div
                                    class="w-16 h-16 rounded-full bg-linear-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/40 animate-[bounce_1s_ease-out]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="3"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>

                                <h3
                                    class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-2"
                                >
                                    سپاسگزاریم!
                                </h3>
                                <p class="text-slate-400 text-sm mb-6">
                                    امتیاز شما با موفقیت ثبت شد.
                                </p>

                                <div
                                    class="inline-flex flex-row-reverse items-center gap-3 px-5 py-2.5 bg-slate-950/50 rounded-full border border-slate-700/50 shadow-inner dir-ltr"
                                >
                                    <span
                                        class="text-slate-400 text-xs font-medium"
                                        >:امتیاز شما</span
                                    >
                                    <div class="flex gap-1">
                                        <svg
                                            v-for="star in 5"
                                            :key="star"
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-5 w-5 transition-all duration-500"
                                            :class="
                                                star <= selectedRating
                                                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                                                    : 'text-slate-700'
                                            "
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
                <div v-if="!isServed" class="px-6 space-y-6 pb-8">
                    <div
                        class="bg-slate-700/40 rounded-2xl border border-slate-600/50 overflow-hidden transition-all duration-300"
                    >
                        <div class="p-4 flex justify-around items-center">
                            <div class="flex flex-col items-center">
                                <span class="text-slate-400 mb-2"
                                    >نوبت شما</span
                                >
                                <span
                                    class="text-3xl font-bold"
                                    :class="
                                        isServed
                                            ? 'text-blue-400'
                                            : 'text-emerald-400'
                                    "
                                >
                                    {{ userTicketId }}
                                </span>
                            </div>
                            <div class="h-8 w-px bg-slate-600"></div>
                            <div class="flex flex-col items-center">
                                <span class="text-slate-400 mb-4">
                                    {{ timeLabel }}
                                </span>
                                <span
                                    class="text-xl font-semibold dir-ltr"
                                    :class="
                                        (timeColorClass,
                                        isAccurateTime ? 'animate-pulse' : '')
                                    "
                                >
                                    ...
                                </span>
                            </div>
                        </div>

                        <div
                            v-if="
                                Object.values(userOrderedBreads).some(
                                    (c) => c > 0
                                )
                            "
                        >
                            <button
                                @click="showOrderDetails = !showOrderDetails"
                                class="w-full flex items-center justify-center gap-2 py-2 bg-slate-800/50 hover:bg-slate-800 transition-colors border-t border-slate-600/30 text-xs text-slate-400"
                            >
                                <span>{{
                                    showOrderDetails
                                        ? 'بستن جزئیات سفارش'
                                        : 'مشاهده سفارش شما'
                                }}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-3 w-3 transition-transform duration-300"
                                    :class="{ 'rotate-180': showOrderDetails }"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            <div
                                class="bg-slate-900/30 overflow-hidden transition-all duration-300 ease-in-out"
                                :style="{
                                    maxHeight: showOrderDetails
                                        ? '200px'
                                        : '0px',
                                    opacity: showOrderDetails ? '1' : '0',
                                }"
                            >
                                <div
                                    class="p-4 flex flex-wrap justify-center gap-3"
                                >
                                    <template
                                        v-for="(
                                            count, type
                                        ) in userOrderedBreads"
                                        :key="type"
                                    >
                                        <div
                                            v-if="count > 0"
                                            class="flex items-center justify-between gap-3 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50 shadow-sm min-w-[110px]"
                                        >
                                            <span
                                                class="text-slate-300 text-xs"
                                                >{{ type || 'نامشخص' }}</span
                                            >
                                            <div
                                                class="flex items-center gap-1"
                                            >
                                                <span
                                                    class="text-emerald-400 font-bold text-base"
                                                    >{{ count }}</span
                                                >
                                                <span
                                                    class="text-[10px] text-slate-500"
                                                    >عدد</span
                                                >
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-row gap-3 w-full">
                        <button
                            v-if="!isInWaitList && !isServed"
                            @click="handleSmsClick"
                            class="flex-1 group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            <span>دریافت پیامک</span>
                            <div
                                class="absolute inset-0 h-full w-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"
                            ></div>
                        </button>

                        <button
                            @click="showQrModal = true"
                            class="flex-1 group relative overflow-hidden bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 border border-slate-600/50"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 fill-current"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M8,21H4a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H8a1,1,0,0,0,0-2Zm14-6a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H16a1,1,0,0,0,0,2h4a3,3,0,0,0,3-3V16A1,1,0,0,0,22,15ZM20,1H16a1,1,0,0,0,0,2h4a1,1,0,0,1,1,1V8a1,1,0,0,0,2,0V4A3,3,0,0,0,20,1ZM2,9A1,1,0,0,0,3,8V4A1,1,0,0,1,4,3H8A1,1,0,0,0,8,1H4A3,3,0,0,0,1,4V8A1,1,0,0,0,2,9Zm8-4H6A1,1,0,0,0,5,6v4a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V6A1,1,0,0,0,10,5ZM9,9H7V7H9Zm5,2h4a1,1,0,0,0,1-1V6a1,1,0,0,0-1-1H14a1,1,0,0,0-1,1v4A1,1,0,0,0,14,11Zm1-4h2V9H15Zm-5,6H6a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V14A1,1,0,0,0,10,13ZM9,17H7V15H9Zm5-1a1,1,0,0,0,1-1,1,1,0,0,0,0-2H14a1,1,0,0,0-1,1v1A1,1,0,0,0,14,16Zm4-3a1,1,0,0,0-1,1v3a1,1,0,0,0,0,2h1a1,1,0,0,0,1-1V14A1,1,0,0,0,18,13Zm-4,4a1,1,0,1,0,1,1A1,1,0,0,0,14,17Z"
                                />
                            </svg>
                            <span>کد تحویل</span>
                        </button>
                    </div>

                    <button
                        @click="showQueue = !showQueue"
                        class="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-sm py-2"
                    >
                        <span>{{
                            showQueue ? 'بستن جزئیات صف' : 'مشاهده افراد در صف'
                        }}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 transition-transform duration-300"
                            :class="{ 'rotate-180': showQueue }"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>

                <div
                    v-if="!isServed"
                    class="bg-slate-900/50 border-t border-slate-700/50 transition-all duration-500 ease-in-out overflow-hidden"
                    :style="{ maxHeight: showQueue ? '400px' : '0px' }"
                >
                    <div
                        class="p-4 space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar"
                    >
                        <transition-group name="list">
                            <div
                                v-for="person in activeQueueList"
                                :key="person.id"
                                class="flex items-center justify-between p-3 rounded-xl border transition-all"
                                :class="getQueueItemClass(person)"
                            >
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                                        :class="
                                            person.id == currentTurn
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-700 text-slate-400'
                                        "
                                    >
                                        {{ person.id }}
                                    </div>
                                    <div class="flex flex-col">
                                        <span
                                            class="font-medium"
                                            :class="
                                                person.id == userTicketId
                                                    ? 'text-white'
                                                    : 'text-slate-300'
                                            "
                                        >
                                            {{
                                                person.id == userTicketId
                                                    ? 'نوبت شما'
                                                    : `مشتری شماره ${person.id}`
                                            }}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    class="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg"
                                >
                                    <span class="text-emerald-400 font-bold">{{
                                        person.breads
                                    }}</span>
                                    <span class="text-xs text-slate-500"
                                        >نان</span
                                    >
                                </div>
                            </div>
                        </transition-group>
                        <div
                            v-if="activeQueueList.length === 0 && !isLoading"
                            class="text-center text-slate-500 py-6 px-4"
                        >
                            <p class="mb-2">لیست صف خالی است.</p>
                            <p class="text-xs opacity-70">
                                نوبت شما گذشته است، یا هنوز کسی در صف ثبت نشده.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <transition name="toast">
            <div
                v-if="showToast"
                class="fixed top-6 left-0 right-0 mx-auto w-max z-50 flex items-center gap-3 px-6 py-4 bg-slate-800/90 backdrop-blur-md border border-emerald-500/30 text-slate-100 rounded-2xl shadow-[0_0_10px_rgba(16,185,129,0.4)]"
            >
                <div
                    class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <div class="flex flex-col">
                    <span class="font-bold text-sm text-emerald-400"
                        >به‌زودی...</span
                    >
                    <span class="text-xs text-slate-300"
                        >این ویژگی در آپدیت بعدی فعال می‌شود.</span
                    >
                </div>
            </div>
        </transition>

        <transition name="fade">
            <div
                v-if="showQrModal"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
                @click.self="showQrModal = false"
            >
                <div
                    class="bg-slate-800 border border-slate-600 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-fade-in"
                >
                    <button
                        @click="showQrModal = false"
                        class="absolute top-4 left-4 text-slate-400 hover:text-white p-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <div class="text-center mt-2">
                        <h3 class="text-xl font-bold text-white mb-2">
                            QR Code نوبت شما
                        </h3>
                        <p class="text-slate-400 text-sm mb-6">
                            جهت اسکن و تحویل نان
                        </p>

                        <div
                            class="relative bg-white p-4 rounded-2xl shadow-inner mx-auto w-48 h-48 flex items-center justify-center mb-6 overflow-hidden"
                        >
                            <QRCodeVue
                                v-if="qrCodeValue"
                                :value="qrCodeValue"
                                :size="160"
                                level="M"
                                render-as="svg"
                                class="w-full h-full object-contain"
                                background="#ffffff"
                                foreground="#000000"
                            />
                            <div
                                v-else
                                class="text-slate-400 text-xs text-center"
                            >
                                اطلاعات نامعتبر
                            </div>
                        </div>

                        <button
                            @click="showQrModal = false"
                            class="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                        >
                            بستن
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import notificationUrl from '@/assets/Ting.mp3';
import QRCodeVue from 'qrcode.vue';

// ============================================================================
// Configuration
// ============================================================================

const route = useRoute();
const API_BASE = 'https://api.noonyar.ir';

const POLLING_INTERVAL = {
    ACTIVE: 30000,
    INACTIVE: 60000,
};

const TICKET_STATUS = {
    NOT_FOUND: 'Customer not found for token',
    SERVED: ['TICKET_IS_SERVED', 'ticket is served'],
    WAIT_LIST: ['TICKET_IS_IN_WAIT_LIST', 'ticket is in wait list'],
};

// ============================================================================
// Network Utilities
// ============================================================================

// Performs a fetch request with cache-busting headers and timestamp
const fetchNoCache = (url, options = {}) => {
    const separator = url.includes('?') ? '&' : '?';
    const uniqueUrl = `${url}${separator}_t=${Date.now()}`;

    const noCacheHeaders = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
    };

    const finalOptions = {
        ...options,
        headers: {
            ...noCacheHeaders,
            ...(options.headers || {}),
        },
    };

    return fetch(uniqueUrl, finalOptions);
};

// ============================================================================
// State
// ============================================================================

// Ticket data
const userTicketId = ref(null);
const currentTurn = ref(0);
const userCustomerId = ref(null);
const userTicketToken = ref('');
const userOrderedBreads = ref({});

// Status flags
const isInWaitList = ref(false);
const isServed = ref(false);
const isCooking = ref(true);
const isAccurateTime = ref(null);
const ticketNotFound = ref(false);
const isLoading = ref(true);
const isFetching = ref(false);
const isManualRefreshing = ref(false);

// UI control
const showQueue = ref(false);
const showOrderDetails = ref(false);
const showToast = ref(false);
const showQrModal = ref(false);
const timeDisplay = ref('...');

// Queue data
const queueSummaryMap = ref({});
const peopleAhead = ref(0);
const initialQueueSize = ref(0);

// Time tracking
const lastUpdated = ref(null);
const now = ref(new Date());

// Rating
const hoveredStar = ref(0);
const ratingSubmitted = ref(false);
const selectedRating = ref(0);

// Utilities
let pollingInterval = null;
let toastTimer = null;
let notificationSound = null;
let abortController = null;

// ============================================================================
// Computed
// ============================================================================

const qrCodeValue = computed(() => {
    const { bakery_id, ticket_token } = route.params;
    return bakery_id && ticket_token
        ? `https://noonyar.ir/res/${bakery_id}/${ticket_token}`
        : '';
});

const lastUpdateText = computed(() => {
    if (!lastUpdated.value) return '';

    const diffMs = now.value - lastUpdated.value;
    const diffMins = Math.floor(diffMs / 60000);

    return diffMins < 1
        ? 'بروزرسانی: همین الان'
        : `بروزرسانی: ${diffMins.toLocaleString('fa-IR')} دقیقه پیش`;
});

const isDataFresh = computed(
    () => lastUpdated.value && now.value - lastUpdated.value < 60000
);

const timeLabel = computed(() => {
    if (isAccurateTime.value === true) return 'زمان دقیق تحویل';
    if (isAccurateTime.value === false) return 'زمان تقریبی تحویل';
    return 'زمان تحویل';
});

const statusRingClass = computed(() => {
    if (isServed.value) {
        return 'border-blue-500 shadow-[0_0_35px_rgba(59,130,246,0.6)]';
    }
    if (isInWaitList.value) {
        return 'border-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.6)] animate-pulse';
    }
    return 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]';
});

const timeColorClass = computed(() => {
    if (isServed.value) return 'text-blue-400';
    if (isInWaitList.value) return 'text-emerald-400';
    return 'text-white';
});

const activeQueueList = computed(() => {
    return Object.entries(queueSummaryMap.value)
        .map(([tid, breads]) => ({ id: parseInt(tid), breads }))
        .filter(
            (item) => currentTurn.value === 0 || item.id >= currentTurn.value
        )
        .sort((a, b) => a.id - b.id);
});

// ============================================================================
// Time Formatting
// ============================================================================

/**
 * Formats seconds into a time range rounded to 10-minute intervals.
 * @example formatTimeInterval(3600) → "10:00 - 10:10"
 */
const formatTimeInterval = (seconds) => {
    if (seconds == null) return 'نامشخص';
    if (seconds <= 0) return 'همین حالا';

    const startTime = new Date(Date.now() + seconds * 1000);
    startTime.setMinutes(Math.floor(startTime.getMinutes() / 10) * 10, 0, 0);

    const endTime = new Date(startTime.getTime() + 10 * 60000);

    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(startTime.getHours())}:${pad(startTime.getMinutes())} - ${pad(
        endTime.getHours()
    )}:${pad(endTime.getMinutes())}`;
};

/**
 * Formats seconds into an exact delivery time.
 * @example formatExactTime(1800) → "10:30"
 */
const formatExactTime = (seconds) => {
    if (seconds == null) return '...درحال بررسی';
    if (seconds <= 0) return 'همین حالا';

    const targetTime = new Date(Date.now() + seconds * 1000);
    if (targetTime.getSeconds() > 0) {
        targetTime.setMinutes(targetTime.getMinutes() + 1);
    }

    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(targetTime.getHours())}:${pad(targetTime.getMinutes())}`;
};

// ============================================================================
// State Management
// ============================================================================

const resetTicketState = () => {
    isInWaitList.value = false;
    isServed.value = false;
    isCooking.value = false;
    ticketNotFound.value = false;
};

const handleNotFound = () => {
    ticketNotFound.value = true;
    isLoading.value = false;
    stopPolling();
};

const handleServedState = (data) => {
    isServed.value = true;
    timeDisplay.value = 'تحویل داده شد';
    userTicketId.value = data.ticket_id;
    currentTurn.value = data.ticket_id;

    // Update rating state based on server response
    if (data.rated === true) {
        ratingSubmitted.value = true;
        selectedRating.value = data.rating || 0;
    } else if (!ratingSubmitted.value) {
        // Only reset if not already submitted locally
        selectedRating.value = 0;
    }

    stopPolling();
};

const handleWaitListState = (data) => {
    isInWaitList.value = true;
    timeDisplay.value = 'آماده تحویل';
    userTicketId.value = data.ticket_id;
    currentTurn.value = data.ticket_id;
};

const handleCookingState = (data) => {
    isCooking.value = true;
    userTicketId.value = data.ticket_id;
    currentTurn.value = data.current_ticket_id || 0;
    isAccurateTime.value = !!data.accurate_time;

    // Ticket is ready but status not updated yet
    if (userTicketId.value && userTicketId.value === currentTurn.value) {
        isInWaitList.value = true;
        timeDisplay.value = 'آماده تحویل';
        return;
    }

    // Format display time based on accuracy
    if (isAccurateTime.value) {
        timeDisplay.value = formatExactTime(data.wait_until);
    } else {
        const totalWait =
            (data.wait_until || 0) + (data.empty_slot_time_avg || 0);
        timeDisplay.value = formatTimeInterval(totalWait);
    }
};

/**
 * Determines ticket status from API response message.
 * @returns {'not_found'|'served'|'wait_list'|'cooking'}
 */
const getTicketStatus = (message) => {
    const msg = typeof message === 'string' ? message.trim() : '';

    if (msg === TICKET_STATUS.NOT_FOUND) return 'not_found';
    if (TICKET_STATUS.SERVED.includes(msg)) return 'served';
    if (TICKET_STATUS.WAIT_LIST.includes(msg)) return 'wait_list';
    return 'cooking';
};

// ============================================================================
// API
// ============================================================================

const fetchQueueList = async (bakeryId, ticketToken, signal) => {
    try {
        // Fetch queue data without caching
        const res = await fetchNoCache(
            `${API_BASE}/queue_until_ticket_summary/${bakeryId}/${ticketToken}`,
            { signal }
        );

        if (!res.ok) return;

        const data = await res.json();
        queueSummaryMap.value = data.tickets_and_their_bread_count || {};
        peopleAhead.value = data.people_in_queue_until_this_ticket || 0;

        if (initialQueueSize.value === 0 && peopleAhead.value > 0) {
            initialQueueSize.value = peopleAhead.value;
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Queue Fetch Error:', error);
        }
    }
};

/**
 * Main polling function - fetches ticket status and queue information.
 * Implements request debouncing and race condition prevention.
 */
const fetchAllData = async () => {
    // Prevent concurrent requests
    if (isFetching.value) {
        console.log('Previous request in progress, skipping...');
        return;
    }

    const { bakery_id: bakeryId, ticket_token: ticketToken } = route.params;

    if (!bakeryId || !ticketToken) return;

    // Create new abort controller for this request
    abortController = new AbortController();

    isFetching.value = true;
    userTicketToken.value = ticketToken;

    try {
        // Fetch ticket status without caching
        const res = await fetchNoCache(
            `${API_BASE}/res/${bakeryId}/${ticketToken}`,
            {
                signal: abortController.signal,
            }
        );

        if (!res.ok) {
            if (res.status === 404) {
                handleNotFound();
                return;
            }
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        // Update user data
        userOrderedBreads.value = data.user_breads || {};
        if (data.customer_id) {
            userCustomerId.value = data.customer_id;
        }

        // Parse and handle ticket status
        const message =
            data.message || data.detail?.message || data.detail || '';
        const status = getTicketStatus(message);

        resetTicketState();

        switch (status) {
            case 'not_found':
                handleNotFound();
                return;
            case 'served':
                handleServedState(data);
                break;
            case 'wait_list':
                handleWaitListState(data);
                break;
            default:
                handleCookingState(data);
        }

        // Fetch queue if ticket is still active
        if (!isServed.value && !ticketNotFound.value && showQueue.value) {
            await fetchQueueList(bakeryId, ticketToken, abortController.signal);
        }

        lastUpdated.value = new Date();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request cancelled');
        } else {
            console.error('API Error:', error);
        }
    } finally {
        isFetching.value = false;
        isLoading.value = false;
    }
};

// ============================================================================
// Polling
// ============================================================================

const startPolling = (delay) => {
    stopPolling();
    pollingInterval = setInterval(fetchAllData, delay);
};

const stopPolling = () => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
    // Don't abort ongoing requests when stopping polling
    // Let them complete naturally
};

/**
 * Adjusts polling frequency based on document visibility.
 * Reduces server load when tab is not active.
 */
const handleVisibilityChange = () => {
    if (document.hidden) {
        console.log('Tab hidden: slow polling');
        startPolling(POLLING_INTERVAL.INACTIVE);
    } else {
        console.log('Tab visible: fast polling');
        fetchAllData();
        startPolling(POLLING_INTERVAL.ACTIVE);
        now.value = new Date();
    }
};

// ============================================================================
// Event Handlers
// ============================================================================

const handleSmsClick = () => {
    if (toastTimer) {
        clearTimeout(toastTimer);
    }

    showToast.value = false;

    requestAnimationFrame(() => {
        showToast.value = true;
        toastTimer = setTimeout(() => {
            showToast.value = false;
        }, 3000);
    });
};

const handleManualRefresh = async () => {
    if (isFetching.value) return;

    isManualRefreshing.value = true;

    stopPolling();

    await fetchAllData();

    startPolling(POLLING_INTERVAL.ACTIVE);

    setTimeout(() => {
        isManualRefreshing.value = false;
    }, 700);
};

const submitRating = async () => {
    if (
        selectedRating.value === 0 ||
        ratingSubmitted.value ||
        !userCustomerId.value
    ) {
        return;
    }

    try {
        // Use fetchNoCache to prevent rating submission caching
        const res = await fetchNoCache(`${API_BASE}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                customer_id: userCustomerId.value,
                rate: selectedRating.value,
            }),
        });

        if (!res.ok) {
            throw new Error(`Rating failed: ${res.status}`);
        }
    } catch (error) {
        console.error('Rating Error:', error);
    } finally {
        ratingSubmitted.value = true;
    }
};

const getQueueItemClass = (person) => {
    if (person.id === userTicketId.value) {
        return 'bg-emerald-900/20 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
    }
    if (person.id === currentTurn.value) {
        return 'bg-slate-700/30 border-slate-600 translate-x-1';
    }
    return 'bg-transparent border-transparent hover:bg-slate-800/50';
};

// ============================================================================
// Watchers
// ============================================================================

// Play notification when ticket enters waiting list
watch(isInWaitList, (newVal, oldVal) => {
    if (newVal && !oldVal && notificationSound) {
        try {
            notificationSound.currentTime = 0;
            notificationSound.play().catch((err) => {
                console.log('Audio playback failed:', err.message);
            });
        } catch (error) {
            console.log('Audio error:', error);
        }
    }
});

// Reset state on route change
watch(
    () => route.params,
    (newParams, oldParams) => {
        if (
            newParams.bakery_id !== oldParams?.bakery_id ||
            newParams.ticket_token !== oldParams?.ticket_token
        ) {
            resetTicketState();

            // Reset rating state logic
            ratingSubmitted.value = false;
            selectedRating.value = 0;

            isLoading.value = true;
            fetchAllData();
        }
    },
    { deep: true }
);

// Trigger immediate queue fetch when opened, avoiding wait for next polling interval
watch(showQueue, async (isOpen) => {
    if (isOpen && !isFetching.value) {
        const { bakery_id, ticket_token } = route.params;
        if (bakery_id && ticket_token && !isServed.value) {
            const controller = new AbortController();
            await fetchQueueList(bakery_id, ticket_token, controller.signal);
        }
    }
});

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
    // Initialize audio
    try {
        notificationSound = new Audio(notificationUrl);
        notificationSound.preload = 'auto';
    } catch (error) {
        console.error('Failed to load notification sound:', error);
    }

    // Start polling
    fetchAllData();
    startPolling(POLLING_INTERVAL.ACTIVE);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Update timestamp every 10 seconds
    const nowInterval = setInterval(() => {
        now.value = new Date();
    }, 10000);

    onUnmounted(() => {
        clearInterval(nowInterval);
    });
});

onUnmounted(() => {
    stopPolling();
    document.removeEventListener('visibilitychange', handleVisibilityChange);

    if (toastTimer) {
        clearTimeout(toastTimer);
    }

    if (notificationSound) {
        notificationSound.pause();
        notificationSound = null;
    }
});
</script>

<style>
.dir-ltr {
    direction: ltr;
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

.animate-shimmer {
    animation: shimmer 2s infinite;
}

@keyframes pulse-fast {
    0%,
    100% {
        opacity: 0.3;
    }
    50% {
        opacity: 0.7;
    }
}

.animate-pulse-fast {
    animation: pulse-fast 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

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

.list-enter-active,
.list-leave-active {
    transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(-100px);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes spin-once {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.animate-spin-once {
    animation: spin-once 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-vertical-enter-active,
.slide-vertical-leave-active {
    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-vertical-enter-from {
    opacity: 0;
    transform: translateY(-15px);
    filter: blur(4px);
}

.slide-vertical-leave-to {
    opacity: 0;
    transform: translateY(15px);
    filter: blur(4px);
}

/* ----- */

/* انیمیشن سوئیچ بین حالت نظردهی و تشکر */
.scale-fade-enter-active,
.scale-fade-leave-active {
    /* این مدل بدون پرش است و بسیار نرم حرکت می‌کند */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-fade-enter-from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
}

.scale-fade-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
}

@keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-15px);
    }
    60% {
        transform: translateY(-7px);
    }
}
</style>
