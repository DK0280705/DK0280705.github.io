<script setup lang="ts">
import ExpandableCard from "@/components/ExpandableCard.vue";
import previewImage from "@/assets/oiia.avif";

const projectCards = [
    {
        title: "Hello World",
        subtitle: "The website is almost done",
        description: "",
        imageSrc: previewImage,
        tags: ["It", "Works"],
        markdownFile: "helloworld.md",
    },
];
</script>

<template>
    <div class="section-content w-full h-full flex flex-col gap-6">
        <header
            class="mt-8 px-6 py-5"
        >
            <h2 class="section-title">Projects</h2>
            <p class="section-description mt-2">
                Some projects and researches that I have worked on with links to source code.
            </p>
        </header>

        <div class="flex-1 overflow-y-auto pr-1">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <ExpandableCard
                    v-for="card in projectCards"
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
    </div>
</template>
