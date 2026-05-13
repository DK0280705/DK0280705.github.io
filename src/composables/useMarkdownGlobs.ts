// ── Lazy glob imports (loaded on demand, cached by Vite) ──────────────────

/** Lazy markdown file loaders, keyed by full path like `/src/contents/blog/foo.md` */
export const MARKDOWN_MODULES = import.meta.glob<string>("@/contents/**/*.md", {
    query: "?raw",
    import: "default",
}) as Record<string, () => Promise<string>>;

/** All asset files, keyed by full path like `/src/assets/foo.png` */
export const ASSET_MAP = import.meta.glob<string>("@/assets/**/*", {
    eager: true,
    import: "default",
}) as Record<string, string>;
