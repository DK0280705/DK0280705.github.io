<script setup lang="ts">
import {
    ref,
    onMounted,
    onBeforeUnmount,
    computed,
    watch,
    nextTick,
    type CSSProperties,
} from "vue";
import { AnimatePresence, motion } from "motion-v";
import MarkdownViewer from "./MarkdownViewer.vue";

interface Props {
    title: string;
    subtitle: string;
    imageSrc: string;
    imageAlt?: string;
    description?: string;
    modalTitle?: string;
    markdownFile?: string;
    tags?: string[];
}

const props = withDefaults(defineProps<Props>(), {
    imageAlt: "",
    description: "",
    modalTitle: "",
    tags: () => [],
});

const isOpen = ref(false);
const modalBodyRef = ref<HTMLElement>();
const cardZIndex = ref<number>(0);

const onAnimationComplete = () => {
    cardZIndex.value = 0;
}

const scrollModalToTop = () => {
    const body = modalBodyRef.value;
    if (!body) return;

    body.scrollTo({ top: 0, behavior: "instant" });
};

const openModal = () => {
    isOpen.value = true;
};

const closeModal = () => {
    scrollModalToTop();
    isOpen.value = false;
    cardZIndex.value = 2500;
};

const modalHeading = computed(() => props.modalTitle || props.title);
const resolvedMarkdownFile = computed(() => props.markdownFile || props.title);
const hasTags = computed(() => (props.tags?.length ?? 0) > 0);

const subtitleWrapperRef = ref<HTMLElement>();
const subtitleTextRef = ref<HTMLElement>();
const titleWrapperRef = ref<HTMLElement>();
const titleTextRef = ref<HTMLElement>();

const subtitleOverflow = ref(0);
const titleOverflow = ref(0);

const hasSubtitleOverflow = computed(() => subtitleOverflow.value > 0);
const hasTitleOverflow = computed(() => titleOverflow.value > 0);

const computeDuration = (distance: number) => {
    const duration = distance / 24;
    return Math.min(18, Math.max(6, duration || 0));
};

const subtitleDuration = computed(() =>
    hasSubtitleOverflow.value ? computeDuration(subtitleOverflow.value) : 0
);
const titleDuration = computed(() =>
    hasTitleOverflow.value ? computeDuration(titleOverflow.value) : 0
);

const subtitleMarqueeStyle = computed<CSSProperties | undefined>(() => {
    if (!hasSubtitleOverflow.value) return undefined;
    return {
        "--marquee-distance": `${subtitleOverflow.value}px`,
        "--marquee-duration": `${subtitleDuration.value}s`,
    };
});

const titleMarqueeStyle = computed<CSSProperties | undefined>(() => {
    if (!hasTitleOverflow.value) return undefined;
    return {
        "--marquee-distance": `${titleOverflow.value}px`,
        "--marquee-duration": `${titleDuration.value}s`,
    };
});

const updateOverflow = () => {
    const subtitleWrapper = subtitleWrapperRef.value;
    const subtitleText = subtitleTextRef.value;
    if (subtitleWrapper && subtitleText) {
        const overflow = subtitleText.scrollWidth - subtitleWrapper.clientWidth;
        subtitleOverflow.value = overflow > 8 ? overflow : 0;
    } else {
        subtitleOverflow.value = 0;
    }

    const titleWrapper = titleWrapperRef.value;
    const titleText = titleTextRef.value;
    if (titleWrapper && titleText) {
        const overflow = titleText.scrollWidth - titleWrapper.clientWidth;
        titleOverflow.value = overflow > 8 ? overflow : 0;
    } else {
        titleOverflow.value = 0;
    }
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
        closeModal();
    }
};

onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
    nextTick(updateOverflow);
    window.addEventListener("resize", updateOverflow);
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", updateOverflow);
});

watch(
    () => [props.title, props.subtitle],
    () => {
        nextTick(updateOverflow);
    }
);

watch(isOpen, (value) => {
    if (!value) {
        nextTick(updateOverflow);
    }
});
</script>

<template>
    <Teleport to="body">
        <AnimatePresence>
            <motion.div
                v-if="isOpen"
                class="fixed inset-0 bg-[rgba(10,10,20,0.5)] backdrop-blur-2xl z-[2000]"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :exit="{ opacity: 0 }"
                :transition="{ duration: 0.3 }"
                @click="closeModal"
            />
        </AnimatePresence>

        <AnimatePresence>
            <div
                v-if="isOpen"
                class="fixed inset-0 grid place-items-stretch sm:place-items-center p-0 sm:p-8 z-[2001] pointer-events-none"
            >
                <motion.div
                    class="relative flex flex-col gap-6 w-full h-full sm:h-auto max-w-full sm:max-w-[min(80vw,1024px)] sm:max-h-[min(80vh,100%)] rounded-none sm:rounded-[1.25rem] bg-[rgba(6,6,6,0.95)] border-0 sm:border sm:border-white/10 shadow-none sm:shadow-[0_30px_80px_rgba(0,0,0,0.45)] overflow-hidden pointer-events-auto"
                    :layout-id="`ec-${title}`"
                >
                    <section
                        ref="modalBodyRef"
                        class="overscroll-y-contain flex flex-col gap-5 overflow-y-auto flex-1 min-h-0 scroll-smooth"
                    >
                        <div
                            class="relative overflow-hidden min-h-[40vh] flex items-end"
                        >
                            <motion.div
                                class="absolute inset-0"
                                :layout-id="`ec-img-${title}`"
                            >
                                <img
                                    class="w-full h-full object-cover"
                                    :src="imageSrc"
                                    :alt="imageAlt || title"
                                />
                                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95"/>
                            </motion.div>
                            <div class="relative z-50 w-full px-6 pb-8 pt-6 sm:px-8 sm:pb-10 flex flex-col gap-2">
                                <motion.p :layout-id="`ec-subtitle-${title}`" class="text-base text-white/75">{{ subtitle }}</motion.p>
                                <motion.h2 :layout-id="`ec-title-${title}`" class="text-2xl font-extrabold text-white/95">{{ modalHeading }}</motion.h2>
                                <motion.ul
                                    v-if="hasTags"
                                    :layout-id="`ec-tags-${title}`"
                                    class="flex flex-wrap gap-1.5 mt-2 list-none"
                                >
                                    <li
                                        v-for="tag in props.tags"
                                        :key="tag"
                                        class="px-3 py-1 rounded-full text-xs tracking-wide bg-white/10 text-white/80 border border-white/15"
                                    >
                                        {{ tag }}
                                    </li>
                                </motion.ul>
                            </div>
                        </div>
                        <div class="flex flex-col gap-4 pt-4">
                            <div class="flex-1 min-h-0">
                                <MarkdownViewer :file="resolvedMarkdownFile" />
                            </div>
                        </div>
                    </section>
                    <button
                        class="absolute top-4 right-4 flex items-center justify-center border border-white/10 bg-white/10 text-white/80 text-xl w-10 h-10 rounded-full cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.2)] backdrop-blur-[40px] transition-colors duration-200 hover:bg-white/30"
                        type="button"
                        aria-label="Close"
                        @click="closeModal"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    </Teleport>
    <AnimatePresence>
        <motion.div
            v-if="!isOpen"
            class="group flex flex-col gap-3 p-4 rounded-[1.25rem] border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.25)] cursor-pointer backdrop-blur-[40px] overflow-hidden hover:shadow-[0_24px_50px_rgba(0,0,0,0.3)]"
            role="dialog"
            :layout-id="`ec-${title}`"
            :style="cardZIndex ? { zIndex: cardZIndex } : undefined"
            :while-hover="{ scale: 1.05 }"
            @click="openModal"
            @keyup.enter="openModal"
            @layout-animation-complete="onAnimationComplete"
        >
            <motion.div
                :layout-id="`ec-img-${title}`"
                class="relative overflow-hidden rounded-xl w-full shrink-0 aspect-[16/9]"
            >
                <img
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    :src="imageSrc"
                    :alt="imageAlt || title"
                    loading="lazy"
                />
            </motion.div>
            <div class="mt-1 z-50 text-left flex flex-col gap-1 text-white/90 overflow-hidden">
                <div ref="subtitleWrapperRef" class="overflow-hidden">
                    <motion.p
                        :layout-id="`ec-subtitle-${title}`"
                        class="text-base text-white/70 whitespace-nowrap"
                    >
                        <span
                            ref="subtitleTextRef"
                            class="inline-flex"
                            :class="{ marquee: hasSubtitleOverflow }"
                            :style="subtitleMarqueeStyle"
                        >
                            {{ subtitle }}
                        </span>
                    </motion.p>
                </div>
                <div ref="titleWrapperRef" class="overflow-hidden">
                    <motion.h2
                        :layout-id="`ec-title-${title}`"
                        class="text-xl font-extrabold text-white whitespace-nowrap"
                    >
                        <span
                            ref="titleTextRef"
                            class="inline-flex"
                            :class="{ marquee: hasTitleOverflow }"
                            :style="titleMarqueeStyle"
                        >
                            {{ title }}
                        </span>
                    </motion.h2>
                </div>
                <motion.ul v-if="hasTags" :layout-id="`ec-tags-${title}`" class="flex flex-wrap gap-1.5 mt-2 list-none">
                    <li
                        v-for="tag in props.tags"
                        :key="tag"
                        class="px-3 py-1 rounded-full text-xs tracking-wide bg-white/10 text-white/80 border border-white/15"
                    >
                        {{ tag }}
                    </li>
                </motion.ul>
            </div>
        </motion.div>
    </AnimatePresence>
</template>

<style scoped>
@keyframes marquee {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(calc(-1 * var(--marquee-distance, 0px)));
    }
}

.marquee {
    animation: marquee var(--marquee-duration, 8s) linear infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
    .marquee {
        animation-duration: 0s;
        animation-iteration-count: 1;
        transform: translateX(0);
    }
}
</style>
