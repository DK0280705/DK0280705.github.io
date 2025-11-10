<script setup lang="ts">
import { ref, computed } from "vue";
import ExpandableCard from "@/components/ExpandableCard.vue";
import previewImage from "@/assets/oiia.avif";
import previewGif from "@/assets/oiia-cat.gif"

interface BlogCard {
    title: string;
    subtitle: string;
    description: string;
    imageSrc: string;
    tags: string[];
    markdownFile?: string;
}

const blogCards: BlogCard[] = [
    {
        title: "Test Title 1",
        subtitle: "This is a massive long subtitle for testing yes yes yes",
        description: "",
        imageSrc: previewImage,
        tags: ["Game", "Development", "Research"],
        markdownFile: "helloworld.md",
    },
    {
        title: "Test for a very long title that might span multiple lines yes yes yes",
        subtitle: "Short subtitle",
        description: "",
        imageSrc: previewGif,
        tags: ["UI/UX", "Research", "Performance"],
        markdownFile: "helloworld.md",
    },
    {
        title: "Test Title 2",
        subtitle: "It works",
        description: "",
        imageSrc: previewImage,
        tags: ["WebGL", "Graphics", "Balls", "Sigma", "Development"],
        markdownFile: "helloworld.md",
    },
];

const selectedTags = ref<string[]>([]);

const allTags = computed(() => {
    const tagSet = new Set<string>();
    blogCards.forEach((card) => card.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
});

const filteredCards = computed(() => {
    if (!selectedTags.value.length) return blogCards;
    return blogCards.filter((card) =>
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
                Blogs
            </h2>
            <p class="text-base leading-relaxed text-white/70 sm:text-lg md:max-w-3xl md:text-xl">
                Some thoughts and writings on my projects and experiences.
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
                    None
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
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 pb-16"
        >
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
        <div
            v-else
            class="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/70"
        >
            <h3 class="text-2xl font-semibold text-white">No matching posts</h3>
            <p class="max-w-md text-base">
                Try selecting different tags or clear your filters to discover another story.
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