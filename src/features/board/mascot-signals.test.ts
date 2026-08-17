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

  it("keeps production board modules on the renderer boundary", () => {
    // Task 6 (Gate D2) lets the board consume the WorldDirector contract
    // (provider/store/types — plain React, no Three). The hard boundary
    // stays: no R3F/Three/renderer module may enter a board production
    // module (plan Task 3 Step 7).
    const boardDirectory = resolve(process.cwd(), "src/features/board");
    const productionModules = readdirSync(boardDirectory).filter(
      (file) =>
        /\.(ts|tsx)$/.test(file) &&
        !file.endsWith(".test.ts") &&
        !file.endsWith(".test.tsx"),
    );
    const rendererImport =
      /(?:from\s+|import\s*\(\s*)["'](?:three(?:\/[^"']*)?|@react-three\/(?:fiber|drei)|@\/features\/world(?:\/(?:index|ExperienceWorld|WorldCanvas|GuideScene|guide-rig|guide-materials|scene-motion|capability-policy|asset-manifest))?)["']/;

    for (const file of productionModules) {
      const source = readFileSync(resolve(boardDirectory, file), "utf8");
      expect(source, `${file} must not import world renderer code`).not.toMatch(
        rendererImport,
      );
    }
  });
});
