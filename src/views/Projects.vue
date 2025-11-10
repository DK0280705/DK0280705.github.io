<script setup lang="ts">
import { ref, computed } from "vue";
import ExpandableCard from "@/components/ExpandableCard.vue";
import previewImage from "@/assets/oiia.avif";

interface ProjectCard {
    title: string;
    subtitle: string;
    description: string;
    imageSrc: string;
    tags: string[];
    markdownFile?: string;
}

const projectCards: ProjectCard[] = [
    {
        title: "Hello World",
        subtitle: "The website is almost done",
        description: "",
        imageSrc: previewImage,
        tags: ["It", "Works"],
        markdownFile: "helloworld.md",
    },
];

const selectedTags = ref<string[]>([]);

const allTags = computed(() => {
    const tagSet = new Set<string>();
    projectCards.forEach((card) => card.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
});

const filteredCards = computed(() => {
    if (!selectedTags.value.length) return projectCards;
    return projectCards.filter((card) =>
        selectedTags.value.every((tag) => card.tags.includes(tag))
    );
});

const toggleTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag);
    if (index !== -1) {
        selectedTags.value.splice(index, 1);
    } else {
        selectedTags.value.push(tag);
    }
};

const tagConfig = (tag: string | null) => {
    const isSelected = tag === null ? !selectedTags.value.length : selectedTags.value.includes(tag);
    if (isSelected) {
        return "bg-white text-black shadow-lg shadow-black/30";
    }
    return "bg-white/10 text-white/80 hover:bg-white/20";
};

const clearTags = () => {
    selectedTags.value = [];
};
</script>

<template>
    <div class="section-content w-full h-full flex flex-col gap-6">
        <header
            class="mt-8 flex flex-col gap-3 px-4 py-5 text-left sm:px-6 md:gap-4" 
        >
            <h2 class="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Projects
            </h2>
            <p class="text-base leading-relaxed text-white/70 sm:text-lg md:max-w-3xl md:text-xl">
                Some projects and researches that I have worked on with links to source code.
            </p>
            <div
                v-if="allTags.length"
                class="sticky top-[calc(6rem+3.5rem)] z-10 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-md"
            >
                <button
                    type="button"
                    class="rounded-full border border-white/10 px-4 py-1.5 text-sm transition hover:-translate-y-0.5"
                    :class="tagConfig(null)"
                    @click="clearTags()"
                >
                    All
                </button>
                <button
                    v-for="tag in allTags"
                    :key="tag"
                    type="button"
                    class="rounded-full border border-white/10 px-4 py-1.5 text-sm transition hover:-translate-y-0.5"
                    :class="tagConfig(tag)"
                    @click="toggleTag(tag)"
                >
                    {{ tag }}
                </button>
            </div>
        </header>

        <div
            v-if="filteredCards.length"
            class="flex-1 overflow-visible pr-1"
        >
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <ExpandableCard
                    v-for="card in filteredCards"
                    :key="card.title"
                    :title="card.title"
                    :subtitle="card.subtitle"
                    :description="card.description"
                    :image-src="card.imageSrc"
                    :tags="card.tags"
                    :markdown-file="card.markdownFile"
                />
            </div>
        </div>
        <div
            v-else
            class="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/70"
        >
            <h3 class="text-2xl font-semibold text-white">No matching projects</h3>
            <p class="max-w-md text-base">
                Try different tag combinations or reset the filters to browse all projects again.
            </p>
            <button
                type="button"
                class="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                @click="clearTags()"
            >
                Reset filters
            </button>
        </div>
    </div>
</template>
