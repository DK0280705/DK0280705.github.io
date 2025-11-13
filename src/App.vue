<script setup lang="ts">
import {
    onBeforeUnmount,
    ref,
    onMounted,
    watchEffect,
    type Component,
} from "vue";
import Hero from "@/views/Hero.vue";
import ProjectsView from "@/views/Projects.vue";
import BlogsView from "@/views/Blogs.vue";
import AboutView from "@/views/About.vue";
import PillTabs from "@/components/PillTabs.vue";
import AsciiBackground from "@/components/AsciiBackground.vue";
import { animate } from "motion-v";

interface SectionConfig {
    key: "home" | "projects" | "blogs" | "about";
    label: string;
    component: Component;
    isHero?: boolean;
}

const sections: SectionConfig[] = [
    { key: "home", label: "Home", component: Hero, isHero: true },
    { key: "projects", label: "Projects", component: ProjectsView },
    { key: "blogs", label: "Blogs", component: BlogsView },
    { key: "about", label: "About", component: AboutView },
];

const tabs = sections.map(({ label }) => ({ label }));

const activeTabId = ref<number>(0);
const scrollerRef = ref<HTMLElement>();
const sectionRefs = ref<HTMLElement[]>([]);
const pillTabsVisible = ref(false);
const isManualScrolling = ref(true);

const focusableSelectors = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const animateScrollTo = (target: HTMLElement) => {
    const container = scrollerRef.value;
    if (!container) return;

    isManualScrolling.value = false;
    scrollAnimation?.stop?.();
    scrollAnimation = animate(container.scrollLeft, target.offsetLeft, {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (value) => {
            container.scrollLeft = value;
        },
    });
    scrollAnimation.then(() => {
        isManualScrolling.value = true;
    });
};

const handlePillTabClick = (index: number) => {
    const target = sectionRefs.value[index];
    if (!target) return;
    animateScrollTo(target);
};

const goToIndex = (index: number) => {
    if (index < 0 || index >= sections.length) return;
    const target = sectionRefs.value[index];
    if (!target) return;
    activeTabId.value = index;
    animateScrollTo(target);
};

const prevSection = () => goToIndex(activeTabId.value - 1);
const nextSection = () => goToIndex(activeTabId.value + 1);

const isElementVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    if (!rect.width && !rect.height) return false;
    const style = window.getComputedStyle(element);
    if (style.visibility === "hidden" || style.display === "none") return false;
    return element.offsetParent !== null || style.position === "fixed";
};

const cycleFocusableInSection = (reverse: boolean) => {
    const activeSection = sectionRefs.value[activeTabId.value];
    if (!activeSection) return false;

    const focusable = Array.from(
        activeSection.querySelectorAll<HTMLElement>(focusableSelectors),
    ).filter(isElementVisible);

    if (!focusable.length) return false;

    const current = document.activeElement as HTMLElement | null;
    const currentIndex = current ? focusable.indexOf(current) : -1;

    if (currentIndex === -1) {
        const fallback = reverse
            ? focusable[focusable.length - 1]
            : focusable[0];
        fallback?.focus();
        return true;
    }

    const nextIndex = reverse
        ? (currentIndex - 1 + focusable.length) % focusable.length
        : (currentIndex + 1) % focusable.length;

    focusable[nextIndex]?.focus();
    return true;
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
        if (cycleFocusableInSection(event.shiftKey)) {
            event.preventDefault();
        }
    } else if (event.key === "ArrowLeft") {
        prevSection();
    } else if (event.key === "ArrowRight") {
        nextSection();
    }
};

const handleScroll = (_: Event) => {
    if (!scrollerRef.value) return;
    const width = scrollerRef.value.clientWidth;
    const center = width / 2;
    const scrollLeft = scrollerRef.value.scrollLeft;
    const nextIndex = Math.floor((center + scrollLeft) / width)
    if (activeTabId.value == nextIndex) return;
    activeTabId.value = nextIndex;
}

const isWebGlSupported = () => {
    try {
        const canvas = document.createElement("canvas");
        return !!window.WebGLRenderingContext && !!(
            canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        );
    } catch (e) {
        return false;
    }
};

const handleHeroReady = () => {
    pillTabsVisible.value = true;
};

let scrollAnimation: ReturnType<typeof animate>;

watchEffect((onCleanup) => {
    const container = scrollerRef.value;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    onCleanup(() => {
        container.removeEventListener("scroll", handleScroll);
    });
});

onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
    scrollAnimation?.stop?.();
    window.removeEventListener("keydown", handleKeydown);
});

</script>

<template>
    <div class="bg-gradient">
        <AsciiBackground v-if="isWebGlSupported()"/>
        <div v-else class="dots-pattern" />
        <div class="content-layer">
            <PillTabs
                v-if="activeTabId !== 0 || pillTabsVisible"
                :tabs="tabs"
                v-model="activeTabId"
                @tab-click="handlePillTabClick"
            />
            <main
                ref="scrollerRef"
                class="section-scroller"
                data-scrollbar="horizontal"
                :style="{ 'scroll-snap-type': isManualScrolling ? 'x mandatory' : 'none' }"
            >
                <section
                    v-for="(section, index) in sections"
                    :key="section.key"
                    :id="section.key"
                    :class="[
                        'scroll-section',
                        { 'scroll-section-hero': section.isHero },
                    ]"
                    :ref="(el) => sectionRefs[index] = el as HTMLElement"
                >
                    <component
                        :is="section.component"
                        v-on="{ 'typing-complete': section.isHero ? handleHeroReady : () => {} }"
                    />
                </section>
            </main>
        </div>
    </div>
</template>

<style scoped>
.bg-gradient {
    position: relative;
    height: 100vh;
    background: #000000;
    overflow: hidden;
}

.content-layer {
    position: relative;
    z-index: 10;
    height: 100%;
}

.dots-pattern {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
        radial-gradient(
            circle at 1px 1px,
            rgb(54, 54, 54) 1px,
            transparent 1px
        ),
        radial-gradient(circle at 1px 1px, rgb(34, 34, 34) 1px, transparent 1px);
    background-size:
        40px 40px,
        80px 80px;
    background-position:
        0 0,
        20px 20px;
    z-index: 1;
    transform: translate3d(var(--parallax-shift), 0, 0);
    transition: transform 0.35s ease-out;
    will-change: transform;
}

.bg-gradient::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(
        circle at 50% 50%,
        rgba(29, 29, 216, 0.2),
        transparent 80%
    );
    animation:
        pulse 8s ease-in-out infinite,
        gradient-cycle 16s ease-in-out infinite;
    transform: translate3d(calc(var(--parallax-shift) * -0.5), 0, 0);
    transition: transform 0.35s ease-out;
    will-change: transform;
}

@keyframes gradient-cycle {
    0%,
    100% {
        opacity: 0.5;
    }
    50% {
        opacity: 0.6;
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 0.5;
    }
    50% {
        opacity: 0.6;
    }
}

.section-scroller {
    position: relative;
    z-index: 10;
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
}

.nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 40;
    width: 44px;
    height: 44px;
    display: inline-grid;
    place-items: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.9);
    backdrop-filter: blur(8px);
    border-radius: 9999px;
    cursor: pointer;
}

.nav-arrow.left { left: 12px }
.nav-arrow.right { right: 12px }

.nav-arrow:hover { background: rgba(255,255,255,0.12) }

.scroll-section-hero {
    padding: 0;
}

/* Additional subtle dots for depth */
.bg-gradient {
    background-image: radial-gradient(
        circle at 1px 1px,
        rgba(160, 160, 160, 0.03) 1px,
        transparent 1px
    );
    background-size: 100px 100px;
}
</style>
