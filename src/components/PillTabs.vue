<script setup lang="ts">
import {
    ref,
    watch,
    onMounted,
    nextTick,
    type ComponentPublicInstance,
} from "vue";

interface Tab {
    label: string;
    icon?: string;
}

interface Props {
    tabs: Tab[];
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<{
    (event: "tab-click", index: number): void;
}>();

const activeTab = defineModel<number>();

const hoverIndicator = ref<HTMLElement>();
const tabsContainer = ref<HTMLElement>();
const tabRefs = ref<(HTMLElement | undefined)[]>([]);

const setTabRef = (
    element: Element | ComponentPublicInstance | null,
    index: number,
) => {
    tabRefs.value[index] = element instanceof HTMLElement ? element : undefined;
};

const resolveTabButton = (index?: number) => {
    if (index == null) {
        return tabRefs.value.find(Boolean);
    }

    return tabRefs.value[index] ?? tabRefs.value.find(Boolean);
};

const selectTab = (tabId: number) => {
    activeTab.value = tabId;
    if (props.tabs[tabId]) {
        emit("tab-click", tabId);
    }
};

const fitHoverIndicator = (tabElement: HTMLElement) => {
    if (!hoverIndicator.value || !tabsContainer.value) return;

    const containerRect = tabsContainer.value.getBoundingClientRect();
    const targetRect = tabElement.getBoundingClientRect();

    const left = targetRect.left - containerRect.left;
    const width = targetRect.width;

    hoverIndicator.value.style.left = `${left}px`;
    hoverIndicator.value.style.width = `${width}px`;
};

const updateHoverIndicator = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    fitHoverIndicator(target);
};

const returnHoverIndicator = () => {
    const activeTabButton = resolveTabButton(activeTab.value);
    if (activeTabButton) {
        fitHoverIndicator(activeTabButton);
    }
};

onMounted(() => {
    nextTick(() => {
        const initialTab = resolveTabButton(activeTab.value ?? 0);

        if (initialTab) {
            fitHoverIndicator(initialTab);
        }
    });
});

watch(activeTab, (newIndex) => {
    const nextTab = resolveTabButton(newIndex);

    if (nextTab) {
        nextTick(() => fitHoverIndicator(nextTab));
    }
});
</script>

<template>
    <div class="pill-tabs-container">
        <div ref="tabsContainer" class="pill-tabs">
            <!-- Sliding hover indicator -->
            <div ref="hoverIndicator" class="hover-indicator"></div>

            <button
                v-for="(tab, index) in props.tabs"
                :class="[
                    'pill-tab',
                    { 'pill-tab-active': activeTab === index },
                ]"
                :ref="(element) => setTabRef(element, index)"
                @click="selectTab(index)"
                @mouseenter="updateHoverIndicator"
                @mouseleave="returnHoverIndicator"
            >
                <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
                <span class="tab-label">{{ tab.label }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.pill-tabs-container {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
}

.pill-tabs {
    display: flex;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(128, 128, 128, 0.25);
    border-radius: 2rem;
    backdrop-filter: blur(40px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    position: relative;
}

.hover-indicator {
    position: absolute;
    top: 0.5rem;
    height: calc(100% - 1rem);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    z-index: 1;
}

.pill-tab {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 1.5rem;
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: color 0.3s ease;
    white-space: nowrap;
    position: relative;
    z-index: 2;
}

.pill-tab:hover {
    color: rgba(255, 255, 255, 0.95);
}

.tab-icon {
    font-size: 1rem;
    opacity: 0.8;
}

.tab-label {
    font-family: inherit;
    letter-spacing: 0.025em;
}

/* Smooth entrance animation */
.pill-tabs-container {
    animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

/* Responsive design */
@media (max-width: 768px) {
    .pill-tabs-container {
        top: 1rem;
    }

    .pill-tabs {
        gap: 0.25rem;
    }

    .pill-tab {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
}
</style>
