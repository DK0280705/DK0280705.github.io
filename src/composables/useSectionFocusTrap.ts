import { computed, type Ref } from "vue";

const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const isElementVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width 
        || rect.height
        || style.visibility !== "hidden"
        || style.display !== "none"
        || element.offsetParent !== null
        || style.position === "fixed";
};

export const useSectionFocusTrap = (
    sectionRefs: Ref<HTMLElement[]>,
    activeIndex: Ref<number>,
) => {
    const focusablePerSection = sectionRefs.value.map((section) =>
        Array.from(section.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
            .filter(isElementVisible));

    const cycleWithinActiveSection = (reverse: boolean) => {
        const focusable = focusablePerSection[activeIndex.value];
        if (!focusable?.length) return false;

        const active = document.activeElement as HTMLElement | null;
        const currentIndex = active ? focusable.indexOf(active) : -1;
        const nextIndex = currentIndex === -1
            ? reverse ? focusable.length - 1 : 0
            : (currentIndex + focusable.length + (reverse ? -1 : 1)) % focusable.length;

        focusable[nextIndex]?.focus();
        return true;
    };

    return {
        cycleWithinActiveSection,
    };
};
