import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { siteConfig } from "./site";
import { workItems } from "./work";

/**
 * Content tests (PRD §16, extended in Task 5):
 * - approved hero copy matches exactly;
 * - `SSMS President` is allowed, `SAC President` fails the scan;
 * - "patented" never ships (PRD §8 Maxie prohibition) — enforced across
 *   all shipped source, not just the Maxie route;
 * - "Bengaluru" never ships (DESIGN.md §1 exclusion: Delhi / IST only);
 * - every WorkItem preview fact carries a non-empty sourceRef, and every
 *   file the sourceRef cites exists in the repository;
 * - the sitemap contains exactly the five public routes.
 *
 * The assembled-phone-number scan lives in phone-privacy.test.ts and
 * already covers all text sources under src/ (including MDX content).
 */

const ROOT = process.cwd();
const SCAN_DIRS = ["src", "e2e", "scripts"].map((dir) => join(ROOT, dir));

// Built by concatenation so this test file cannot trip its own scan.
const FORBIDDEN = [
  ["SAC", " President"].join(""), // resolved: the true title is SSMS President
  ["Benga", "luru"].join(""), // location is Delhi / IST everywhere
  ["pat", "ented"].join(""), // Maxie is Garvit's concept, not protected IP
  ["carta-option-", "grant"].join(""), // recovered personal financial doc — out of scope
];

const ALLOWED_SAMPLE = "Elected SSMS President";

function listTextFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...listTextFiles(full));
    } else if (/\.(ts|tsx|mts|css|md|mdx|json)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

function violations(content: string): string[] {
  return FORBIDDEN.filter((needle) => content.includes(needle));
}

describe("approved copy (PRD §2, §16)", () => {
  it("hero sentence matches the approved copy exactly", () => {
    expect(siteConfig.hero).toBe(
      "I turn fuzzy product ideas into things people can use",
    );
  });
});

describe("forbidden strings (PRD §8, §16; DESIGN.md §1)", () => {
  const files = SCAN_DIRS.flatMap(listTextFiles).filter(
    (file) => !file.endsWith("content.test.ts"),
  );

  it("scans a non-empty source tree", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it("matcher rejects the forbidden title but allows SSMS President", () => {
    expect(violations(`${FORBIDDEN[0]} of the SAC`)).not.toHaveLength(0);
    expect(violations(ALLOWED_SAMPLE)).toHaveLength(0);
  });

  it("ships no forbidden string in src/, e2e/, or scripts/", () => {
    for (const file of files) {
      const found = violations(readFileSync(file, "utf8"));
      expect(
        found,
        `${file} contains forbidden string(s): ${found.join(", ")}`,
      ).toHaveLength(0);
    }
  });
});

describe("work matrix sourcing (PRD §7, §16)", () => {
  it("every preview fact has a non-empty sourceRef", () => {
    for (const item of workItems) {
      for (const fact of item.previewFacts) {
        expect(
          fact.sourceRef.trim().length,
          `${item.slug} fact "${fact.value} ${fact.label}" needs a sourceRef`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("every file a sourceRef cites exists in the repository", () => {
    for (const item of workItems) {
      for (const fact of item.previewFacts) {
        const cited = fact.sourceRef.match(
          /[A-Za-z0-9_./-]+\.(?:md|mdx|html|pdf)/g,
        );
        expect(
          cited,
          `${item.slug} fact "${fact.value} ${fact.label}" cites no file`,
        ).not.toBeNull();
        for (const ref of cited ?? []) {
          expect(
            existsSync(join(ROOT, ref)),
            `${item.slug} sourceRef cites missing file: ${ref}`,
          ).toBe(true);
        }
      }
    }
  });
});

describe("Stay Portal media (PRD §16)", () => {
  it("ships all six approved demo screenshots on the route", () => {
    const routeDir = join(ROOT, "src/app/work/stay-portal");
    for (const name of [
      "day-view.png",
      "booking-overlap.png",
      "availability.png",
      "pending.png",
      "analytics-1.png",
      "analytics-2.png",
    ]) {
      expect(
        existsSync(join(routeDir, name)),
        `missing approved screenshot: ${name}`,
      ).toBe(true);
    }
  });
});

describe("sitemap (PRD §3, §16)", () => {
  it("contains exactly the five public routes", () => {
    const entries = sitemap();
    const paths = entries
      .map((entry) => new URL(entry.url).pathname)
      .sort();
    expect(paths).toEqual(
      [
        "/",
        "/notes/dynamic-island",
        "/work/agentic-calendar",
        "/work/maxie",
        "/work/stay-portal",
      ].sort(),
    );
  });
});
