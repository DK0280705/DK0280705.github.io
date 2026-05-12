<script lang="ts">
import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { gfmHeadingId } from "marked-gfm-heading-id";
import markedKatex from "marked-katex-extension";
import "katex/dist/katex.min.css";

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
    markedKatex({
        throwOnError: false,
    }),
);

const markdownFiles = import.meta.glob<string>("@/contents/**/*.md", {
    query: "?raw",
    import: "default",
});

const assetFiles = import.meta.glob<string>("@/assets/**/*", {
    eager: true,
    import: "default",
});

const normalizeAssetKey = (value: string) =>
    value.replace(/^@\//, "/src/")

const assetUrlMap = new Map(Object.entries(assetFiles));
console.log(assetUrlMap);

const isExternalSrc = (value: string) =>
    /^(?:[a-z][\w.+-]*:|\/\/)/i.test(value) || value.startsWith("data:");

const resolveImageSrc = (src?: string | null): string | null => {
    if (!src) return null;

    const trimmed = src.trim();
    if (isExternalSrc(trimmed)) return trimmed;

    return assetUrlMap.get(normalizeAssetKey(trimmed)) ?? trimmed;
};

const rewriteImageSources = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll("img[src]").forEach((img) => {
        const resolved = resolveImageSrc(img.getAttribute("src"));
        if (resolved) {
            img.setAttribute("src", resolved);
        }
    });

    return doc.body.innerHTML;
};

const markdownHtmlCache = new Map<string, string>();

const renderMarkdown = async (key: string): Promise<string | null> => {
    if (markdownHtmlCache.has(key)) {
        return markdownHtmlCache.get(key) as string;
    }

    const loader = markdownFiles[key];
    if (!loader) return null;

    const markdown = await loader();
    const html = await marked.parse(markdown);
    const resolvedHtml = rewriteImageSources(html);
    markdownHtmlCache.set(key, resolvedHtml);
    return resolvedHtml;
};
</script>

<script setup lang="ts">
import { ref, onMounted, } from "vue";
import "highlight.js/styles/github-dark.css";

interface Props {
    /** Name of the markdown file to load. Accepts values like `helloworld.md` or `blog/entry`. */
    file: string;
}

const props = withDefaults(defineProps<Props>(), {});

const error = ref<string | null>(null);
const renderedContent = ref<string>("");

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

const resolvedKey = normalizeKey(props.file);

const resetState = (message: string) => {
    error.value = message;
    renderedContent.value = "";
};

const loadMarkdown = async () => {
    if (!resolvedKey) {
        resetState("No markdown file provided.");
        return;
    }

    error.value = null;

    const html = await renderMarkdown(resolvedKey);
    if (html === null) {
        resetState(`Markdown file “${props.file}” was not found in contents.`);
        return;
    }
    renderedContent.value = html;
};

onMounted(() => {
    loadMarkdown();
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

.markdown-loading {
    color: rgba(255, 255, 255, 0.75);
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
