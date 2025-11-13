<script setup lang="ts">
import { ref, type Component } from "vue";
import { useEventListener } from "@vueuse/core";
import Hero from "@/views/Hero.vue";
import ProjectsView from "@/views/Projects.vue";
import BlogsView from "@/views/Blogs.vue";
import AboutView from "@/views/About.vue";
import PillTabs from "@/components/PillTabs.vue";
import AsciiBackground from "@/components/AsciiBackground.vue";
import { useSectionFocusTrap } from "@/composables/useSectionFocusTrap";
import { useSectionScroller } from "@/composables/useSectionScroller";

interface SectionConfig {
    key: "home" | "projects" | "blogs" | "about";
    label: string;
    component: Component;
}

const sections: SectionConfig[] = [
    { key: "home", label: "Home", component: Hero},
    { key: "projects", label: "Projects", component: ProjectsView },
    { key: "blogs", label: "Blogs", component: BlogsView },
    { key: "about", label: "About", component: AboutView },
];

const tabs = sections.map(({ label }) => ({ label }));

const activeTabId = ref<number>(0);
const pillTabsVisible = ref(false);

const {
    scrollerRef,
    sectionRefs,
    isManualScrolling,
    goToIndex,
    goPrev,
    goNext,
} = useSectionScroller(activeTabId, sections.length);

const { cycleWithinActiveSection } = useSectionFocusTrap(sectionRefs, activeTabId);

const handlePillTabClick = (index: number) => {
    goToIndex(index);
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
        if (cycleWithinActiveSection(Boolean(event.shiftKey))) {
            event.preventDefault();
        }
    } else if (event.key === "ArrowLeft") {
        goPrev();
    } else if (event.key === "ArrowRight") {
        goNext();
    }
};

useEventListener(window, "keydown", handleKeydown);

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

</script>

<template>
    <div class="relative h-screen overflow-hidden bg-black">
        <AsciiBackground v-if="isWebGlSupported()"/>
        <div v-else class="dots-pattern"><div class="bg-gradient"/></div>
        <div>
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
                    class="scroll-section"
                    :ref="(el) => sectionRefs[index] = el as HTMLElement"
                >
                    <component
                        :is="section.component"
                        v-on="{ 'typing-complete': index == 0 ? handleHeroReady : () => {} }"
                    />
                </section>
            </main>
        </div>
    </div>
</template>

<style scoped>
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
/* Additional subtle dots for depth */
.bg-gradient {
    background-image: radial-gradient(
        circle at 1px 1px,
        rgba(160, 160, 160, 0.03) 1px,
        transparent 1px
    );
    background-size: 100px 100px;
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


</style>
