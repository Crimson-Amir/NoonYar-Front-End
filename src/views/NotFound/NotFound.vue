<template>
    <div
        class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-fa relative overflow-hidden perspective-container"
        dir="rtl"
    >
        <!-- Background noise texture for a subtle wall-like effect -->
        <div
            class="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
            style="
                background-image: url('https://grainy-gradients.vercel.app/noise.svg');
            "
        ></div>

        <!-- Ambient top glow to enhance the neon theme -->
        <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"
        ></div>

        <!-- Main content container -->
        <div class="relative z-10 flex flex-col items-center">
            <!-- 404 title with neon glow and flicker animation -->
            <div class="relative mb-10">
                <h1
                    class="text-[180px] md:text-[250px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-emerald-100 to-emerald-600 select-none neon-text animate-flicker"
                >
                    404
                </h1>

                <!-- Light reflection below the main 404 -->
                <div
                    class="absolute top-[85%] left-0 right-0 transform scale-y-[-1] opacity-20 blur-sm mask-gradient select-none pointer-events-none"
                >
                    <h1
                        class="text-[180px] md:text-[250px] font-black leading-none tracking-tighter text-emerald-500"
                    >
                        404
                    </h1>
                </div>
            </div>

            <!-- Error message and description -->
            <div
                class="text-center space-y-6 animate-fade-in max-w-md mx-auto relative"
            >
                <div
                    class="h-1 w-20 bg-emerald-500/50 mx-auto rounded-full shadow-[0_0_15px_rgba(16,185,129,1)]"
                ></div>

                <h2
                    class="text-3xl md:text-4xl font-bold text-slate-200 drop-shadow-lg"
                >
                    نوبت پیدا نشد...
                </h2>

                <p class="text-slate-400 text-lg leading-relaxed">
                    به نظر می‌رسه نوبت یا صفحه‌ای که دنبالش هستی وجود نداره!
                </p>
            </div>

            <!-- Action button container (intentionally empty for future navigation links) -->
            <div
                class="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-sm animate-fade-in delay-200"
            ></div>
        </div>

        <!-- Floating particles to add dynamic visual motion -->
        <div class="fixed inset-0 pointer-events-none">
            <div
                v-for="n in 15"
                :key="n"
                class="particle"
                :style="getParticleStyle(n)"
            ></div>
        </div>
    </div>
</template>

<script setup>
// Generates randomized inline styles for floating particles
// Includes size, starting position, animation timing, and opacity
const getParticleStyle = (n) => {
    const size = Math.random() * 3 + 1;
    return {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 10 + 10}s`,
        opacity: Math.random() * 0.5,
    };
};
</script>

<style scoped>
/* Perspective environment for reflections and depth */
.perspective-container {
    perspective: 1000px;
}

/* Neon glow styling around the 404 title */
.neon-text {
    text-shadow: 0 0 40px rgba(16, 185, 129, 0.3),
        0 0 80px rgba(16, 185, 129, 0.1);
}

/* Gradient mask applied to reflection for smooth fade */
.mask-gradient {
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
    -webkit-mask-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.8),
        transparent
    );
}

/* Smooth fade-in animation for content */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
    opacity: 0;
}

/* Animation delay utility for staged element reveals */
.delay-200 {
    animation-delay: 0.3s;
}

/* Floating particle visuals for dynamic ambient motion */
.particle {
    position: absolute;
    background: rgba(16, 185, 129, 0.3);
    border-radius: 50%;
    pointer-events: none;
    animation: floatUp linear infinite;
}

/* Keyframe to move particles upward with slight horizontal drift */
@keyframes floatUp {
    0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
    }
    20% {
        opacity: 0.5;
    }
    100% {
        transform: translateY(-100vh) translateX(20px);
        opacity: 0;
    }
}
</style>
