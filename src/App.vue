<script setup lang="ts">
import {
    onBeforeUnmount,
    ref,
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

onBeforeUnmount(() => {
    scrollAnimation?.stop?.();
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
