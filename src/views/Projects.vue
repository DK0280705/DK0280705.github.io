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
            class="mt-8 flex flex-col gap-3 px-4 py-5 text-left sm:px-6 md:gap-4" 
        >
            <h2 class="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Projects
            </h2>
            <p class="text-base leading-relaxed text-white/70 sm:text-lg md:max-w-3xl md:text-xl">
                Some projects and researches that I have worked on with links to source code.
            </p>
        </header>

        <div class="flex-1 overflow-visible pr-1">
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
