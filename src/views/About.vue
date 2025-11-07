<script setup lang="ts">
import photo from "@/assets/dk.jpg";
</script>

<template>
    <div class="section-content about-view">
        <div class="about-page">
            <main class="about-main">
                <h2 class="section-title">About</h2>
                <p class="about-status">A carefree programmer that likes to try new things</p> 

                <div class="about-text">
                    <p>
                        Hello — I'm DK. I build programs
                    </p>

                    <p>
                        I'm passionate about researching and experimenting with new technologies
                    </p>

                    <p>
                        --Coming Soon.
                    </p>
                </div>
            </main>

            <aside class="about-side">
                <div class="photo-wrap">
                    <img :src="photo" alt="DK" />
                    <span class="photo-name">Deka Risman Permana</span>
                </div>

                <div class="social-box">
                    <ul class="social-list">
                        <li>
                            <a href="https://github.com/DK0280705" aria-label="GitHub" class="social-link" target="_blank">
                                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                                </svg>
                                <span class="sr-only">GitHub</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://instagram.com/dk_0280705" aria-label="Instagram" class="social-link" target="_blank">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3.5A4.5 4.5 0 007.5 12 4.5 4.5 0 0012 16.5 4.5 4.5 0 0016.5 12 4.5 4.5 0 0012 7.5zm0 2A2.5 2.5 0 0114.5 12 2.5 2.5 0 0112 14.5 2.5 2.5 0 019.5 12 2.5 2.5 0 0112 9.5zm5.25-3.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
                                </svg>
                                <span class="sr-only">Instagram</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://discord.gg/UCrKFva5WJ" aria-label="Discord" class="social-link" target="_blank">
                                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
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

<style scoped>
.about-view {
    box-sizing: border-box;
    padding: 8rem 2.5rem 3.5rem;
}

.about-page {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2.5rem;
    align-items: start;
    margin: 0 auto;
}

.about-main {
    text-align: left;
}

.about-main .section-title {
    margin: 0 0 0.5rem 0;
}

.about-status {
    margin: 0 0 1.25rem 0;
    color: rgba(255,255,255,0.78);
    font-weight: 600;
}

.about-text p {
    margin: 0 0 1rem 0;
    color: rgba(255,255,255,0.82);
    line-height: 1.65;
}

.about-side {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    align-items: stretch;
}

.photo-wrap {
    width: 100%;
    aspect-ratio: 4/5;
    border-radius: 1rem;
    overflow: hidden;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(40px);
    position: relative;
}

.photo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.photo-name {
    position: absolute;
    inset: auto 0 0;
    padding: 0.65rem 1rem;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 90%);
    color: rgba(255,255,255,0.92);
    font-weight: 600;
    font-size: 1rem;
    text-align: left;
}

.social-box {
    padding: 1rem;
    border-radius: 0.75rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(40px);
}

.social-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
}

.social-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    color: rgba(255,255,255,0.9);
    text-decoration: none;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    transition: background 0.2s ease, transform 0.12s ease;
}

.social-link svg { display: block; }

.social-link:hover {
    background: rgba(255,255,255,0.08);
    transform: translateY(-1px);
}

.social-link:focus-visible {
    outline: 2px solid rgba(255,255,255,0.35);
    outline-offset: 2px;
}

.social-label { font-size: 0.95rem; }
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
}

@media (max-width: 880px) {
    .about-page {
        grid-template-columns: 1fr;
    }

    .about-side { order: 2; }
}

</style>
