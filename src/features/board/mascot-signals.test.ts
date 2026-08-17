import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  emitMascotSignal,
  subscribeMascotSignals,
  type MascotSignal,
} from "@/features/mascot/signals";

describe("MascotSignal contract", () => {
  afterEach(() => window.dispatchEvent(new Event("garvit:test-cleanup")));

  it("delivers the exact reaction, source, and timestamp to decorative consumers", () => {
    const received: MascotSignal[] = [];
    const unsubscribe = subscribeMascotSignals((signal) => received.push(signal));

    emitMascotSignal({
      reaction: "drag-watch",
      source: "maxie",
      timestamp: 1234,
    });

    expect(received).toEqual([
      { reaction: "drag-watch", source: "maxie", timestamp: 1234 },
    ]);
    unsubscribe();
  });

  it("keeps production board modules on the compatibility bus boundary", () => {
    const boardDirectory = resolve(process.cwd(), "src/features/board");
    const productionModules = readdirSync(boardDirectory).filter(
      (file) =>
        /\.(ts|tsx)$/.test(file) &&
        !file.endsWith(".test.ts") &&
        !file.endsWith(".test.tsx"),
    );
    const rendererImport =
      /(?:from\s+|import\s*\(\s*)["'](?:three(?:\/[^"']*)?|@react-three\/(?:fiber|drei)|@\/features\/world(?:\/[^"']*)?)["']/;

    for (const file of productionModules) {
      const source = readFileSync(resolve(boardDirectory, file), "utf8");
      expect(source, `${file} must not import world renderer code`).not.toMatch(
        rendererImport,
      );
    }
  });
});
