<script setup lang="ts">
import {
    ref,
    onMounted,
    onBeforeUnmount,
    computed,
    defineAsyncComponent,
    Suspense,
} from "vue";
import { AnimatePresence, motion } from "motion-v";

const MarkdownViewer = defineAsyncComponent({
    loader: async () => { await new Promise(r => setTimeout(r, 500)); return import("./MarkdownViewer.vue"); },
});

interface Props {
    title: string;
    subtitle: string;
    imageSrc: string;
    markdownFile?: string;
    tags?: string[];
}

const props = withDefaults(defineProps<Props>(), {
    tags: () => [],
});

const isOpen = ref(false);
const cardZIndex = ref<number>(0);
const modalBodyRef = ref<HTMLElement>();

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

const resolvedMarkdownFile = computed(() => props.markdownFile || props.title);
const hasTags = computed(() => (props.tags?.length ?? 0) > 0);

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
        closeModal();
    }
};

onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);
});

</script>

<template>
    <Teleport to="body">
        <AnimatePresence>
            <motion.div
                v-if="isOpen"
                class="fixed inset-0 bg-[rgba(10,10,20,0.5)] z-[2000]"
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
                    :layout-id="`ec-${markdownFile}`"
                    class="relative overflow-auto w-full h-full max-w-full sm:max-w-5xl sm:max-h-[min(80vh,100%)] rounded-none sm:rounded-2xl border-0 sm:border sm:border-white/10 shadow-none sm:shadow-[0_30px_80px_rgba(0,0,0,0.45)] pointer-events-auto"
                >
                    <section
                        ref="modalBodyRef"
                        class="overscroll-y-contain overflow-y-auto scroll-smooth h-full bg-zinc-950"
                    >
                        <div
                            class="relative overflow-hidden min-h-[40vh] flex items-end"
                        >
                            <motion.div
                                class="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-t before:from-zinc-950"
                                :layout-id="`ec-img-${markdownFile}`"
                            >
                                <img
                                    class="h-full w-full object-cover object-center"
                                    :src="imageSrc"
                                    :alt="title"
                                />
                            </motion.div>
                            <motion.div layout="position" :layout-id="`ec-info-${markdownFile}`" class="z-2 px-6 pb-8 pt-6 sm:px-8 sm:pb-10 flex flex-col gap-2">
                                <p  class="text-base text-white/75">{{ subtitle }}</p>
                                <h2 class="text-2xl font-extrabold text-white">{{ title }}</h2>
                                <ul v-if="hasTags" class="flex flex-wrap gap-1.5 mt-2 list-none">
                                    <li
                                        v-for="tag in props.tags"
                                        :key="tag"
                                        class="px-3 py-1 rounded-full text-xs tracking-wide bg-white/10 text-white/80 border border-white/15"
                                    >
                                        {{ tag }}
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                        <div class="pt-8">
                            <Suspense>
                                <MarkdownViewer :file="resolvedMarkdownFile" />
                                <template #fallback>
                                    <div class="max-w-2xl px-8 mx-auto flex flex-col gap-8 text-white/60">
                                        <div class="flex flex-col gap-3">
                                            <span class="skeleton h-4 w-24 rounded-full"></span>
                                            <span class="skeleton h-8 w-2/3 rounded-md"></span>
                                            <span class="skeleton h-5 w-1/2 rounded-md"></span>
                                        </div>invisible
                                        <div class="flex flex-col gap-3">
                                            <span class="skeleton h-4 w-20 rounded-full"></span>
                                            <span class="skeleton h-4 w-full rounded-md"></span>
                                            <span class="skeleton h-4 w-[85%] rounded-md"></span>
                                            <span class="skeleton h-4 w-[70%] rounded-md"></span>
                                        </div>
                                        <div class="flex flex-col gap-4">
                                            <span class="skeleton h-4 w-28 rounded-full"></span>
                                            <div class="flex flex-wrap gap-2">
                                                <span class="skeleton h-8 w-24 rounded-full"></span>
                                                <span class="skeleton h-8 w-20 rounded-full"></span>
                                                <span class="skeleton h-8 w-28 rounded-full"></span>
                                            </div>
                                            <span class="skeleton h-4 w-full rounded-md"></span>
                                            <span class="skeleton h-4 w-[80%] rounded-md"></span>
                                        </div>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div class="flex flex-col gap-3">
                                                <span class="skeleton h-4 w-24 rounded-full"></span>
                                                <span class="skeleton h-6 w-full rounded-md"></span>
                                                <span class="skeleton h-6 w-full rounded-md"></span>
                                                <span class="skeleton h-6 w-3/4 rounded-md"></span>
                                            </div>
                                            <div class="flex flex-col gap-3">
                                                <span class="skeleton h-4 w-28 rounded-full"></span>
                                                <span class="skeleton h-6 w-full rounded-md"></span>
                                                <span class="skeleton h-6 w-[60%] rounded-md"></span>
                                                <span class="skeleton h-6 w-[85%] rounded-md"></span>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-3">
                                            <span class="skeleton h-4 w-24 rounded-full"></span>
                                            <div class="flex flex-col gap-2">
                                                <span class="skeleton h-10 w-full rounded-md"></span>
                                                <span class="skeleton h-10 w-full rounded-md"></span>
                                                <span class="skeleton h-10 w-[90%] rounded-md"></span>
                                            </div>
                                            <span class="skeleton h-4 w-[70%] rounded-md"></span>
                                            <span class="skeleton h-4 w-[65%] rounded-md"></span>
                                        </div>
                                    </div>
                                </template>
                            </Suspense>
                        </div>
                    </section>
                    <button
                        class="absolute top-4 right-4 flex items-center justify-center border border-white/10 bg-white/10 text-xl w-10 h-10 rounded-full cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.2)] bg-zinc-950/25 backdrop-blur-2xl transition-colors duration-200 hover:bg-white/30"
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
    <motion.button
        class="flex flex-col gap-3 p-4 rounded-2xl border border-white/10 cursor-pointer bg-zinc-950/25 backdrop-blur-2xl"
        :class="{ 'invisible pointer-events-none': isOpen }"
        role="dialog"
        :layout-id="`ec-${markdownFile}`"
        :style="cardZIndex ? { zIndex: cardZIndex } : undefined"
        :while-hover="{ scale: 1.05 }"
        @click="openModal"
        @keyup.enter="openModal"
    >
        <motion.div
            :layout-id="`ec-img-${markdownFile}`"
            class="relative"
        >
            <img
                class="h-56 w-full object-cover rounded-lg object-center"
                :src="imageSrc"
                :alt="title"
                loading="lazy"
            />
        </motion.div>
        <motion.div layout="position" :layout-id="`ec-info-${markdownFile}`" class="p-2 flex flex-col gap-1 text-white/90">
            <p class="text-left text-base text-white/75">
                {{ subtitle }}
            </p>
            <h2 class="text-left text-xl font-extrabold text-white">
                {{ title }}
            </h2>
            <ul v-if="hasTags" class="flex flex-wrap gap-1.5 mt-2 list-none">
                <li
                    v-for="tag in props.tags"
                    :key="tag"
                    class="px-3 py-1 rounded-full text-xs tracking-wide bg-white/10 text-white/80 border border-white/15"
                >
                    {{ tag }}
                </li>
            </ul>
        </motion.div>
    </motion.button>
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

.skeleton {
    position: relative;
    display: inline-block;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
}

.skeleton::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.25),
        rgba(255, 255, 255, 0)
    );
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .marquee {
        animation-duration: 0s;
        animation-iteration-count: 1;
        transform: translateX(0);
    }
    .skeleton::after {
        animation: none;
    }
}
</style>
