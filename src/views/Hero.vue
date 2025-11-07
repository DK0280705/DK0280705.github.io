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
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title glowing-text">
                {{ displayedTitle }}
                <span v-if="cursorVisible" class="typing-cursor">|</span>
            </h1>
            <motion.p
                v-if="subtitleVisible"
                class="hero-subtitle"
                :initial="{ opacity: 0, y: 16 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.3, ease: 'easeOut' }"
            >
                Your average programmer with passion for developing games.
            </motion.p>
        </div>
    </section>
</template>

<style scoped>
.hero-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    text-align: center;
    width: 100%;
}

.hero-content {
    width: 560px;
    height: 400px;
    z-index: 10;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    box-sizing: border-box;
}

.hero-title {
    text-align: left;
    font-size: clamp(2.5rem, 8vw, 8rem);
    font-weight: 900;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    line-height: 1.2;
    background-clip: text;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
}

.glowing-text {
    font-size: 5rem;
    line-height: 1;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
    letter-spacing: -1px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: center;
}

.typing-cursor {
    display: inline-block;
    margin-left: 0.1em;
    color: rgba(255, 255, 255, 0.75);
}

.hero-subtitle {
    text-align: left;
    font-size: clamp(1.125rem, 4vw, 1.5rem);
    color: var(--text-secondary);
    margin: 0;
    font-weight: 400;
    opacity: 0.8;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
}

</style>
