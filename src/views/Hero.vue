<script setup lang="ts">
import { ref, onMounted } from "vue";
import { motion } from "motion-v";

const emit = defineEmits<{ (event: "typing-complete"): void }>();

const fullTitle = "Hi, I'm DK.";
const displayedTitle = ref("");
const subtitleVisible = ref(false);
const cursorVisible = ref(false);

let typingTimer: number | undefined;
let cursorTimer: number | undefined;

const stopTimers = () => {
    if (typingTimer) {
        window.clearInterval(typingTimer);
        typingTimer = undefined;
    }
    if (cursorTimer) {
        window.clearInterval(cursorTimer);
        cursorTimer = undefined;
    }
};

const revealAfterTyping = () => {
    stopTimers();
    cursorVisible.value = false;
    subtitleVisible.value = true;
    emit("typing-complete");
};

const startTypingAnimation = () => {
    let index = 0;
    cursorVisible.value = true;
    typingTimer = window.setInterval(() => {
        if (index >= fullTitle.length) {
            setTimeout(revealAfterTyping, 500);
            return;
        }

        displayedTitle.value += fullTitle[index];
        index += 1;
    }, 110);

    cursorTimer = window.setInterval(() => {
        cursorVisible.value = !cursorVisible.value;
    }, 420);
};

onMounted(() => {
    setTimeout(() => {
        displayedTitle.value = "";
        subtitleVisible.value = false;
        startTypingAnimation();
    }, 500);
});

</script>

<template>
    <section class="relative flex w-full items-center justify-center">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4 sm:gap-6 px-6 py-12">
            <h1 class="w-full text-left text-4xl font-black leading-tight text-white tracking-tight sm:text-center sm:text-6xl md:text-7xl lg:text-8xl">
                {{ displayedTitle }}
                <span v-if="cursorVisible" class="ml-1 inline-block text-white/70">|</span>
            </h1>
            <motion.h2
                v-if="subtitleVisible"
                class="w-full text-left text-base font-normal leading-relaxed text-white/70 sm:text-center sm:text-lg md:text-2xl"
                :initial="{ opacity: 0, y: 16 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.3, ease: 'easeOut' }"
            >
                Your average programmer with passion for developing games.
            </motion.h2>
        </div>
    </section>
</template>
