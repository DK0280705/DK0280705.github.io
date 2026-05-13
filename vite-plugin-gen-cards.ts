import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface CardMeta {
    title: string;
    subtitle: string;
    image: string;
    tags: string[];
    markdownFile: string;
}

// ── Frontmatter parser ───────────────────────────────────────────────────

function parseFrontmatter(raw: string): Record<string, string | string[]> {
    const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
    if (!m?.[1]) return {};

    const result: Record<string, string | string[]> = {};

    for (const line of m[1].split("\n")) {
        const kv = /^(\w[\w-]*):\s*(.*)/.exec(line);
        if (!kv?.[1]) continue;

        const key = kv[1];
        const rawValue = (kv[2] ?? "").trim();

        if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
            result[key] = rawValue
                .slice(1, -1)
                .split(",")
                .map((s) => {
                    const q = /^["'](.+?)["']$/.exec(s.trim());
                    return q?.[1] ?? s.trim();
                })
                .filter(Boolean);
            continue;
        }

        let value = rawValue;
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        result[key] = value;
    }

    return result;
}

// ── File walker ──────────────────────────────────────────────────────────

function walkDir(dir: string, results: string[] = []): string[] {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = resolve(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(full, results);
        } else if (entry.name.endsWith(".md")) {
            results.push(full);
        }
    }
    return results;
}

// ── Generate the .ts file with real asset imports ────────────────────────

let lastGenerated = 0;

function generate(root: string) {
    const now = Date.now();
    if (lastGenerated && now - lastGenerated < 500) return; // debounce HMR
    lastGenerated = now;

    const contentsDir = resolve(root, "src", "contents");
    const outDir = resolve(root, "src", "generated");
    const outFile = resolve(outDir, "contentCards.ts");

    if (!existsSync(contentsDir)) return;

    const cards: CardMeta[] = [];

    // Collect unique image paths to generate imports
    const imagePaths = new Set<string>();

    for (const filePath of walkDir(contentsDir)) {
        const raw = readFileSync(filePath, "utf-8");
        const fm = parseFrontmatter(raw);

        const title = fm["title"] as string | undefined;
        if (!title) continue;

        const relPath = relative(contentsDir, filePath);
        const image = fm["image"] as string | undefined;

        if (image && image.startsWith("@/assets/")) {
            imagePaths.add(image);
        }

        cards.push({
            title,
            subtitle: (fm["subtitle"] as string) ?? "",
            image: image ?? "",
            tags: Array.isArray(fm["tags"]) ? fm["tags"] : [],
            markdownFile: relPath,
        });
    }

    // Generate import statements
    const imports: string[] = [];
    const imageVar = new Map<string, string>();
    let vi = 0;
    for (const img of imagePaths) {
        const vname = `_img${vi++}`;
        imports.push(`import ${vname} from "${img}";`);
        imageVar.set(img, vname);
    }

    // Generate card objects with resolved image variables
    const cardEntries = cards.map((c) => {
        const imgRef = imageVar.get(c.image);
        const img = imgRef ? imgRef : JSON.stringify(c.image);
        return `  { title: ${JSON.stringify(c.title)}, subtitle: ${JSON.stringify(c.subtitle)}, image: ${img}, tags: ${JSON.stringify(c.tags)}, markdownFile: ${JSON.stringify(c.markdownFile)} }`;
    });

    const code =
        imports.join("\n") +
        "\n\n" +
        "import type { ContentCard } from \"@/composables/useContentCards\";\n\n" +
        "export const ALL_CARDS: ContentCard[] = [\n" +
        cardEntries.join(",\n") +
        "\n];\n";

    if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
    }

    writeFileSync(outFile, code, "utf-8");
    console.log(`[gen-cards] ${cards.length} cards → ${relative(root, outFile)}`);
}

// ── Plugin ───────────────────────────────────────────────────────────────

export function genContentCardsPlugin(): Plugin {
    let root = process.cwd();

    return {
        name: "gen-content-cards",
        configResolved(config) {
            root = config.root;
            generate(root);
        },
        buildStart() {
            generate(root);
        },
        handleHotUpdate({ file }) {
            if (file.includes("/contents/") && file.endsWith(".md")) {
                generate(root);
            }
        },
    };
}


