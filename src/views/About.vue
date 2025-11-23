<script setup lang="ts">
import photo from "@/assets/dk.jpg";

const toolboxSections = [
    {
        title: "Game Development",
        description: "Prototyping ideas, iterating on gameplay mechanics, and polishing visuals.",
        tools: ["Godot", "C++", "GLSL", "Aseprite", "FL Studio", "Github"],
    },
    {
        title: "Software Engineering",
        description: "Automating tasks with scripts and building tools to improve productivity.",
        tools: ["C/C++", "Rust", "Python", "GitHub Actions"],
    },
    {
        title: "Web Development",
        description: "Creating responsive designs. This website is using technologies below.",
        tools: ["Vue", "Vite", "Tailwind", "Github Pages"],
    },
    {
        title: "Server Management",
        description: "Deployed some projects using cloud services. Using AWS EC2 for hosting and managing personal minecraft server.",
        tools: ["Docker", "Linux", "Bash", "AWS"],
    },
];
</script>

<template>
    <div class="section-content my-auto">
        <div class="flex flex-col xl:flex-row gap-10 my-8 px-4 py-5">
            <main class="text-left max-w-2xl">
                <h2 class="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6x mb-8">About</h2>
                <div class="space-y-4 text-white/80 leading-relaxed">
                    <p>
                        Hello! I'm Deka, an adventurous programmer that likes to try new things.
                        I'm from Indonesia and currently studying as an international student in Japan.
                        I'm passionate about researching and experimenting with new technologies.
                        Mainly focusing on software engineering, but also interested in game development, web development, and IoT.
                    </p>
                    <p>
                        In my free time, I enjoy playing video games, reading manga, watching anime, and exploring new places.
                        I'm also an avid learner, always looking to expand my knowledge and skills in various fields.
                    </p>
                    <p>
                        Feel free to connect with me on social media or check out my projects on GitHub!
                    </p>
                </div>
                <section class="mt-6" aria-labelledby="toolbox-heading">
                    <h3 id="toolbox-heading" class="text-2xl font-bold text-white mb-3">Tools & Technologies</h3>
                    <div class="grid gap-4 p-4 sm:grid-cols-2">
                        <article
                            v-for="section in toolboxSections"
                            :key="section.title"
                            class="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_0_30px_rgba(15,15,15,0.35)] backdrop-blur-2xl transition duration-200 ease-out hover:-translate-y-0.5 hover:border-white/30"
                        >
                            <h4 class="text-lg font-semibold text-white">{{ section.title }}</h4>
                            <p class="mt-2 text-sm text-white/70">
                                {{ section.description }}
                            </p>
                            <ul class="mt-auto flex flex-wrap gap-2 pt-4">
                                <li v-for="tool in section.tools" :key="tool" class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                                    {{ tool }}
                                </li>
                            </ul>
                        </article>
                    </div>
                </section>

                <h3 class="text-2xl font-bold text-white mt-8 mb-2">Education</h3>
                <ul class="list-disc pl-6 marker:text-white/50">
                    <li class="space-y-1 text-white/80">
                        <a class="inline-flex items-center gap-1 font-bold" href="https://kumamoto-nct.ac.jp/" target="_blank">
                            Kumamoto National College of Technology
                            <svg class="h-4 w-4 text-white/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M14 3h7v7" />
                                <path d="M10 14 21 3" />
                                <path d="M21 13v7H3V3h7" />
                            </svg>
                        </a>,
                        Department of Human-Oriented Information Systems Engineering.
                    </li>
                </ul>
            </main>

            <aside class="flex flex-col items-stretch xl:justify-center gap-5 w-64 ml-auto sm:mr-0 mr-auto">
                <div class="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 before:absolute before:inset-0 before:bg-gradient-to-t before:from-zinc-950/40">
                    <img :src="photo" alt="DK" class="h-full w-full object-cover" />
                    <span class="z-20 absolute inset-x-0 bottom-0 px-4 py-2 text-left text-base font-semibold text-white/90">
                        Deka Risman Permana
                    </span>
                </div>

                <div class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                    <ul class="flex list-none justify-center gap-2">
                        <li>
                            <a
                                href="https://github.com/DK0280705"
                                aria-label="GitHub"
                                class="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
                                target="_blank"
                            >
                                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden class="block">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                                </svg>
                                <span class="sr-only">GitHub</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://instagram.com/dk_0280705"
                                aria-label="Instagram"
                                class="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
                                target="_blank"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden class="block">
                                    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3.5A4.5 4.5 0 007.5 12 4.5 4.5 0 0012 16.5 4.5 4.5 0 0016.5 12 4.5 4.5 0 0012 7.5zm0 2A2.5 2.5 0 0114.5 12 2.5 2.5 0 0112 14.5 2.5 2.5 0 019.5 12 2.5 2.5 0 0112 9.5zm5.25-3.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
                                </svg>
                                <span class="sr-only">Instagram</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://discord.gg/UCrKFva5WJ"
                                aria-label="Discord"
                                class="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
                                target="_blank"
                            >
                                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden class="block">
                                    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
                                </svg>
                                <span class="sr-only">Discord</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    </div>
</template>
