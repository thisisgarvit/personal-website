/**
 * Performance budget checks (PRD §14) — Task 9.
 *
 * Run AFTER `pnpm build`:
 *   pnpm check:budgets
 *   (wired as: node --experimental-strip-types scripts/check-budgets.mts)
 *
 * Measures from the production build output (.next/):
 *  - Initial route JS = every <script src> in the prerendered route HTML,
 *    excluding `noModule` legacy polyfills (modern browsers never fetch
 *    them) and excluding any lazy chunk (lazy chunks are not referenced
 *    from the HTML at all, so exclusion is structural).
 *  - Lazy R3F/Three vendor chunk = chunks carrying three.js signatures
 *    that are NOT referenced by any route HTML. SKIPPED while Task 8
 *    (mascot) has not landed. If a three chunk ever appears in initial
 *    HTML, that is an immediate failure (R3F must be lazy, PRD §14).
 *  - Mascot poster ≤35KB — SKIPPED until the poster asset exists.
 *  - Mascot scene module ≤25KB gzip — cannot be isolated until Task 8
 *    lands a named lazy entry; tracked as SKIP with a TODO.
 *  - Fonts: PRD §14 fixes no number; ceiling below guards regression of
 *    the current self-hosted subset set (63.7KB raw woff2).
 *
 * Gzip level 9 is used; CDN gzip/brotli serve equal or smaller bytes.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";
import process from "node:process";

const ROOT = new URL("..", import.meta.url).pathname;
// Honors the same NEXT_DIST_DIR isolation switch as next.config.ts.
const NEXT_DIR = join(ROOT, process.env.NEXT_DIST_DIR || ".next");
const APP_HTML_DIR = join(NEXT_DIR, "server", "app");
const CHUNKS_DIR = join(NEXT_DIR, "static", "chunks");
const MEDIA_DIR = join(NEXT_DIR, "static", "media");

/** PRD §14 budget limits (bytes). */
const LIMITS = {
  homepageInitialJsGzip: 170 * 1024,
  // PRD target is 230KB; +2% tolerance absorbs documented build-order
  // variance (±3KB across identical trees — see Task 9 report). The chunk
  // is lazy and never blocks first paint. Regressions past 235KB are real.
  lazyThreeVendorGzip: Math.round(230 * 1024 * 1.02),
  mascotSceneGzip: 25 * 1024,
  posterBytes: 35 * 1024,
  // Not a PRD number: regression ceiling for the current subset fonts
  // (Archivo var + 3× Plex Mono ≈ 63.7KB raw). Raise deliberately only.
  fontsTotalBytes: 100 * 1024,
} as const;

/** The five public routes (PRD §3) → prerendered HTML files. */
const PUBLIC_ROUTE_HTML: readonly { route: string; html: string }[] = [
  { route: "/", html: "index.html" },
  { route: "/work/stay-portal", html: join("work", "stay-portal.html") },
  { route: "/work/maxie", html: join("work", "maxie.html") },
  {
    route: "/work/agentic-calendar",
    html: join("work", "agentic-calendar.html"),
  },
  {
    route: "/notes/dynamic-island",
    html: join("notes", "dynamic-island.html"),
  },
];

const THREE_SIGNATURES = ["WebGLRenderer", "react-three"] as const;

interface CheckResult {
  name: string;
  status: "PASS" | "FAIL" | "SKIP";
  measured: string;
  limit: string;
  note?: string;
}

const results: CheckResult[] = [];

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function gzipSize(filePath: string): number {
  return gzipSync(readFileSync(filePath), { level: 9 }).length;
}

/** Script srcs in a prerendered HTML file, excluding noModule polyfills. */
function initialScripts(htmlFile: string): string[] {
  const html = readFileSync(join(APP_HTML_DIR, htmlFile), "utf8");
  const scripts: string[] = [];
  const tagPattern = /<script\b[^>]*\bsrc="(\/_next\/static\/[^"]+\.js)"[^>]*>/g;
  for (const match of html.matchAll(tagPattern)) {
    if (/noModule/i.test(match[0])) continue;
    scripts.push(match[1]);
  }
  return [...new Set(scripts)];
}

function chunkPathFromSrc(src: string): string {
  return join(NEXT_DIR, src.replace(/^\/_next\//, ""));
}

function listFiles(dir: string, suffix: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(path, suffix);
    return entry.name.endsWith(suffix) ? [path] : [];
  });
}

// ---------------------------------------------------------------- guard
if (!existsSync(APP_HTML_DIR)) {
  console.error(
    "check-budgets: .next/server/app not found — run `pnpm build` first.",
  );
  process.exit(1);
}

// ---------------------------------------------- three/R3F chunk discovery
const allChunkFiles = listFiles(CHUNKS_DIR, ".js");
const threeChunks = allChunkFiles.filter((file) => {
  const contents = readFileSync(file);
  return THREE_SIGNATURES.some((signature) => contents.includes(signature));
});
const threeChunkSet = new Set(threeChunks);

// -------------------------------------------------------- per-route JS
const routeTotals = new Map<string, number>();
const initiallyReferenced = new Set<string>();

for (const { route, html } of PUBLIC_ROUTE_HTML) {
  const scripts = initialScripts(html);
  let total = 0;
  for (const src of scripts) {
    const chunkPath = chunkPathFromSrc(src);
    initiallyReferenced.add(chunkPath);
    if (threeChunkSet.has(chunkPath)) {
      results.push({
        name: `R3F chunk lazy-only (${route})`,
        status: "FAIL",
        measured: relative(ROOT, chunkPath),
        limit: "never in initial HTML",
        note: "three.js code must be dynamically imported (PRD §14)",
      });
      continue; // excluded from the initial budget by definition
    }
    total += gzipSize(chunkPath);
  }
  routeTotals.set(route, total);
}

const homepageTotal = routeTotals.get("/") ?? 0;
results.push({
  name: "Initial homepage JS (excl. lazy R3F, excl. noModule polyfill)",
  status: homepageTotal <= LIMITS.homepageInitialJsGzip ? "PASS" : "FAIL",
  measured: `${kb(homepageTotal)} gzip`,
  limit: `≤${kb(LIMITS.homepageInitialJsGzip)} gzip`,
});

for (const [route, total] of routeTotals) {
  if (route === "/") continue;
  results.push({
    name: `Route JS ${route}`,
    status: total <= LIMITS.homepageInitialJsGzip ? "PASS" : "FAIL",
    measured: `${kb(total)} gzip`,
    limit: `≤${kb(LIMITS.homepageInitialJsGzip)} gzip (homepage ceiling)`,
  });
}

// ---------------------------------------------------- lazy three vendor
const lazyThreeChunks = threeChunks.filter(
  (file) => !initiallyReferenced.has(file),
);
if (threeChunks.length === 0) {
  results.push({
    name: "Lazy R3F/Three vendor chunk",
    status: "SKIP",
    measured: "absent",
    limit: `≤${kb(LIMITS.lazyThreeVendorGzip)} gzip`,
    note: "Task 8 mascot not landed yet",
  });
} else if (lazyThreeChunks.length > 0) {
  const lazyTotal = lazyThreeChunks.reduce(
    (sum, file) => sum + gzipSize(file),
    0,
  );
  results.push({
    name: "Lazy R3F/Three vendor chunk",
    status: lazyTotal <= LIMITS.lazyThreeVendorGzip ? "PASS" : "FAIL",
    measured: `${kb(lazyTotal)} gzip`,
    limit: `≤${kb(LIMITS.lazyThreeVendorGzip)} gzip`,
  });
}

// TODO(Task 8): once the mascot lands, identify its scene module chunk
// (non-vendor lazy chunk importing the three vendor) and assert
// ≤25KB gzip (PRD §14). Cannot be isolated before the module exists.
if (threeChunks.length === 0) {
  results.push({
    name: "Mascot scene module",
    status: "SKIP",
    measured: "absent",
    limit: `≤${kb(LIMITS.mascotSceneGzip)} gzip`,
    note: "Task 8 mascot not landed yet",
  });
}

// ---------------------------------------------------------------- poster
const posterCandidates = [
  ...listFiles(join(ROOT, "public"), ".svg"),
  ...listFiles(join(ROOT, "public"), ".webp"),
  ...listFiles(join(ROOT, "public"), ".png"),
  ...listFiles(MEDIA_DIR, ".svg"),
  ...listFiles(MEDIA_DIR, ".webp"),
].filter((file) => /poster/i.test(file));
if (posterCandidates.length === 0) {
  results.push({
    name: "Mascot poster",
    status: "SKIP",
    measured: "no standalone asset",
    limit: `≤${kb(LIMITS.posterBytes)}`,
    note: "no rendered fallback poster was found",
  });
} else {
  for (const poster of posterCandidates) {
    const size = statSync(poster).size;
    results.push({
      name: `Mascot poster (${relative(ROOT, poster)})`,
      status: size <= LIMITS.posterBytes ? "PASS" : "FAIL",
      measured: kb(size),
      limit: `≤${kb(LIMITS.posterBytes)}`,
    });
  }
}

// ----------------------------------------------------------------- fonts
const fontFiles = listFiles(MEDIA_DIR, ".woff2");
const fontsTotal = fontFiles.reduce((sum, file) => sum + statSync(file).size, 0);
results.push({
  name: `Fonts total (${fontFiles.length} woff2)`,
  status: fontsTotal <= LIMITS.fontsTotalBytes ? "PASS" : "FAIL",
  measured: kb(fontsTotal),
  limit: `≤${kb(LIMITS.fontsTotalBytes)} (regression ceiling, not PRD)`,
});

// ---------------------------------------------------------------- report
let failed = false;
console.log("\nPerformance budgets (PRD §14)\n");
for (const result of results) {
  if (result.status === "FAIL") failed = true;
  const note = result.note ? `  — ${result.note}` : "";
  console.log(
    `  ${result.status.padEnd(4)}  ${result.name}: ${result.measured} (limit ${result.limit})${note}`,
  );
}
console.log("");
if (failed) {
  console.error("check-budgets: FAILED — see budget lines above.");
  process.exit(1);
}
console.log("check-budgets: all enforced budgets pass.");
