import { computed } from "vue";
import { ALL_CARDS } from "@/generated/contentCards";

export interface CardMeta {
    title: string;
    subtitle: string;
    image: string;
    tags: string[];
}

export interface ContentCard extends CardMeta {
    /** Relative path used by MarkdownViewer, e.g. "blog/bleprotocol.md" */
    markdownFile: string;
}

// ── Composable ───────────────────────────────────────────────────────────

/**
 * Returns all content cards auto-discovered from `src/contents/`.
 * Pass a directory name (e.g. `"blog"`, `"project"`) to filter.
 */
export function useContentCards(directory?: string) {
    const cards = computed<ContentCard[]>(() => {
        if (!directory) return ALL_CARDS;
        const prefix = directory + "/";
        return ALL_CARDS.filter((c) => c.markdownFile.startsWith(prefix));
    });

    const allTags = computed<string[]>(() => {
        const tagSet = new Set<string>();
        cards.value.forEach((c) => c.tags.forEach((t) => tagSet.add(t)));
        return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
    });

    return { cards, allTags };
}