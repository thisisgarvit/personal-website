import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * PRD §5.4 / §16: the public phone number must never appear assembled in
 * source. It exists only as digit chunks in the client-side reveal
 * component. This scans every source file under src/ (data modules
 * especially) for the assembled digit runs, the formatted display
 * groups, and the tel value.
 */

// Vitest runs from the repository root (vitest.config.ts).
const SRC_ROOT = join(process.cwd(), "src");

// Built by concatenation so this test file itself cannot trip the scan.
const DIGITS = ["750", "88", "836", "55"].join(""); // full national number
const GROUP_A = ["750", "88"].join(""); // first display group
const GROUP_B = ["836", "55"].join(""); // second display group

const forbidden = [DIGITS, `+91${DIGITS}`, GROUP_A, GROUP_B];

function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...listFiles(full));
    } else if (/\.(ts|tsx|css|md|mdx|json)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe("phone number obfuscation (PRD §5.4)", () => {
  const files = listFiles(SRC_ROOT).filter(
    (file) => !file.endsWith("phone-privacy.test.ts"),
  );

  it("scans a non-empty source tree", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it("never contains the assembled phone number in src/**", () => {
    for (const file of files) {
      const content = readFileSync(file, "utf8");
      for (const needle of forbidden) {
        expect(
          content.includes(needle),
          `${file} must not contain assembled phone fragment "${needle}"`,
        ).toBe(false);
      }
    }
  });
});
