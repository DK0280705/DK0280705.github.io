import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { gfmHeadingId } from "marked-gfm-heading-id";
import markedKatex from "marked-katex-extension";
import { MARKDOWN_MODULES, ASSET_MAP } from "@/composables/useMarkdownGlobs";
import "katex/dist/katex.min.css";

// ── Marked setup ─────────────────────────────────────────────────────────

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
    gfmHeadingId({ prefix: "" }),
    markedKatex({ throwOnError: false }),
);

// ── Helpers ──────────────────────────────────────────────────────────────

/** Strip YAML frontmatter from raw markdown before parsing. */
export function stripFrontmatter(raw: string): string {
    return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

const isExternalSrc = (value: string) =>
    /^(?:[a-z][\w.+-]*:|\/\/)/i.test(value) || value.startsWith("data:");

const resolveImageSrc = (src?: string | null): string | null => {
    if (!src) return null;
    const trimmed = src.trim();
    if (isExternalSrc(trimmed)) return trimmed;
    const key = trimmed.replace(/^@\//, "/src/");
    return ASSET_MAP[key] ?? trimmed;
};

const rewriteImageSources = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.querySelectorAll("img[src]").forEach((img) => {
        const resolved = resolveImageSrc(img.getAttribute("src"));
        if (resolved) img.setAttribute("src", resolved);
    });
    return doc.body.innerHTML;
};

// ── Render pipeline with cache ───────────────────────────────────────────

const htmlCache = new Map<string, string>();

/**
 * Render a markdown file from its full key (e.g. `/src/contents/blog/foo.md`).
 * Strips frontmatter, parses to HTML, resolves asset paths, caches the result.
 */
export async function renderMarkdown(key: string): Promise<string | null> {
    if (htmlCache.has(key)) return htmlCache.get(key)!;

    const loader = MARKDOWN_MODULES[key];
    if (!loader) return null;

    const raw = await loader();
    const html = await marked.parse(stripFrontmatter(raw));
    const resolvedHtml = rewriteImageSources(html);
    htmlCache.set(key, resolvedHtml);
    return resolvedHtml;
}
