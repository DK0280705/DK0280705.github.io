<script lang="ts">
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { gfmHeadingId } from "marked-gfm-heading-id";

const marked = new Marked(
    markedHighlight({
        emptyLangClass: "hljs",
        langPrefix: "hljs language-",
        highlight(code: string, lang?: string) {
            const language =
                lang && hljs.getLanguage(lang) ? lang : "plaintext";
            return hljs.highlight(code, { language }).value;
        },
    }),
);

marked.use(
    gfmHeadingId({
        prefix: "",
    }),
);

const markdownFiles = import.meta.glob<string>("@/contents/**/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
});

const precompiledMarkdown = Object.fromEntries(
    Object.entries(markdownFiles).map(([key, content]) => [
        key,
        marked.parse(content) as string,
    ]),
) as Record<string, string>;

</script>

<script setup lang="ts">
import { ref, computed } from "vue";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface Props {
    /** Name of the markdown file to load. Accepts values like `helloworld.md` or `blog/entry`. */
    file: string;
}

const props = withDefaults(defineProps<Props>(), {});

const error = ref<string | null>(null);

const normalizeKey = (value: string) => {
    const withoutPrefix = value.replace(/^\.\//, "").replace(/^\//, "");

    const withExtension = withoutPrefix.endsWith(".md")
        ? withoutPrefix
        : `${withoutPrefix}.md`;

    if (withExtension.startsWith("contents/")) {
        return `/src/${withExtension}`;
    }

    return `/src/contents/${withExtension}`;
};

const resolvedKey = computed(() => normalizeKey(props.file));

const renderedContent = computed(() => {
    const key = resolvedKey.value;
    if (!key) {
        error.value = "No markdown file provided.";
        return "";
    }

    const html = precompiledMarkdown[key];
    if (!html) {
        error.value = `Markdown file “${props.file}” was not found in contents.`;
        return "";
    }

    error.value = null;
    return html;
});

</script>

<template>
    <div class="width-full max-w-2xl px-8 mx-auto">
        <div v-if="error" class="markdown-state markdown-error">
            {{ error }}
        </div>
        <article
            v-else
            class="markdown-body"
            v-html="renderedContent"
        />
    </div>
</template>

<style scoped>

.markdown-state {
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    text-align: center;
}

.markdown-error {
    color: rgba(255, 149, 149, 0.9);
    border-color: rgba(255, 149, 149, 0.45);
    margin: 0 0 2.25rem;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
    font-weight: 700;
    margin: 2rem 0 0.75rem;
    line-height: 1.2;
}

.markdown-body :deep(h1) {
    font-size: 2.25rem;
}

.markdown-body :deep(h2) {
    font-size: 1.75rem;
}

.markdown-body :deep(h3) {
    font-size: 1.5rem;
}

.markdown-body :deep(h4) {
    font-size: 1.25rem;
}

.markdown-body :deep(h5) {
    font-size: 1.1rem;
}

.markdown-body :deep(h6) {
    font-size: 1rem;
}

.markdown-body :deep(hr) {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    margin: 2rem 0;
}

.markdown-body :deep(p) {
    line-height: 1.7;
    margin: 1rem 0;
    color: rgba(255, 255, 255, 0.78);
}

.markdown-body :deep(a) {
    color: #60a5fa;
    text-decoration: underline;
}

.markdown-body :deep(code) {
    border-radius: 0.35rem;
    padding: 0.15rem 0.35rem;
    font-family: "Fira Code", "Courier New", monospace;
    font-size: 0.9rem;
    background: transparent !important;
}

.markdown-body :deep(pre) {
    background: rgba(0, 0, 0, 0.45);
    border-radius: 0.75rem;
    padding: 1rem;
    overflow-x: auto;
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
    padding-left: 1.5rem;
    margin: 1rem 0;
}

.markdown-body :deep(blockquote) {
    margin: 1.5rem 0;
    padding: 1rem 1.25rem;
    border-left: 4px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.04);
    border-radius: 0.5rem;
}

.markdown-body :deep(img) {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
}

.markdown-body :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 0.75rem 1rem;
    text-align: left;
}
</style>
