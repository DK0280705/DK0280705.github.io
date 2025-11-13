import { onBeforeUnmount, ref, type Ref } from "vue";
import { useEventListener } from "@vueuse/core";
import { animate } from "motion-v";

interface SectionScroller {
    scrollerRef: Ref<HTMLElement | undefined>;
    sectionRefs: Ref<HTMLElement[]>;
    isManualScrolling: Ref<boolean>;
    animateToSection: (element: HTMLElement) => void;
    goToIndex: (index: number) => void;
    goPrev: () => void;
    goNext: () => void;
}

export const useSectionScroller = (
    activeIndex: Ref<number>,
    sectionCount: number,
): SectionScroller => { 
    const scrollerRef = ref<HTMLElement>();
    const sectionRefs = ref<HTMLElement[]>([]);
    const isManualScrolling = ref(true);

    let scrollAnimation: ReturnType<typeof animate> | undefined;

    const stopScrollAnimation = () => {
        scrollAnimation?.stop?.();
        scrollAnimation = undefined;
    };

    const animateToSection = (element: HTMLElement) => {
        const container = scrollerRef.value!;

        isManualScrolling.value = false;
        stopScrollAnimation();
        scrollAnimation = animate(container.scrollLeft, element.offsetLeft, {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (value) => {
                container.scrollLeft = value;
            },
        });

        scrollAnimation.then(() => {
            isManualScrolling.value = true;
        }).catch(() => {
            isManualScrolling.value = true;
        });
    };

    const goToIndex = (index: number) => {
        if (index < 0 || index >= sectionCount) return;
        const target = sectionRefs.value[index]!;
        animateToSection(target);
        activeIndex.value = index;
    };

    const goPrev = () => {
        goToIndex(activeIndex.value - 1);
    };

    const goNext = () => {
        goToIndex(activeIndex.value + 1);
    };

    const handleScroll = () => {
        if (!isManualScrolling.value) return;
        const container = scrollerRef.value!;
        const width = container.clientWidth!;

        const nextIndex = Math.floor((container.scrollLeft + width / 2) / width);
        if (nextIndex === activeIndex.value) return;
        activeIndex.value = Math.min(Math.max(nextIndex, 0), sectionCount - 1);
    };

    useEventListener(scrollerRef, "scroll", handleScroll, { passive: true });

    onBeforeUnmount(() => {
        stopScrollAnimation();
    });

    return {
        scrollerRef,
        sectionRefs,
        isManualScrolling,
        animateToSection,
        goToIndex,
        goPrev,
        goNext,
    };
};
