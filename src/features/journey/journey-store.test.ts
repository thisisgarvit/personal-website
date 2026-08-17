import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  deriveJourneyInsights,
  getJourneySnapshot,
  recordJourneyEvent,
  resetJourneyForTests,
  startJourney,
} from "./journey-store";
import {
  subscribeMascotSignals,
  type MascotSignal,
} from "@/features/mascot/signals";
import { JOURNEY_STORAGE_KEY } from "@/data/storage";

describe("tab-local session journey", () => {
  afterEach(() => {
    resetJourneyForTests();
    vi.restoreAllMocks();
  });

  it("moves through real milestones while counting repeated play", () => {
    startJourney(1_000);
    recordJourneyEvent({ type: "scrolled" });
    recordJourneyEvent({ type: "played", kind: "dark_mode" });
    recordJourneyEvent({ type: "played", kind: "dark_mode" });
    recordJourneyEvent({ type: "read-work", slug: "stay-portal" });
    recordJourneyEvent({ type: "converted", target: "resume" });

    expect(getJourneySnapshot()).toMatchObject({
      startedAt: 1_000,
      interactions: 4,
      darkModeToggles: 2,
      workReads: 1,
      conversion: "resume",
      reached: {
        landed: true,
        scrolled: true,
        played: true,
        "read-work": true,
        converted: true,
      },
    });
    expect(deriveJourneyInsights(getJourneySnapshot())).toContain(
      "You toggled dark mode twice. Decisive.",
    );
  });

  it("pages the mascot only when a stage is reached for the first time", () => {
    vi.spyOn(Date, "now").mockReturnValue(700);
    const signals: MascotSignal[] = [];
    const unsubscribe = subscribeMascotSignals((signal) => signals.push(signal));

    startJourney(100);
    recordJourneyEvent({ type: "scrolled" });
    recordJourneyEvent({ type: "played", kind: "flag" });
    recordJourneyEvent({ type: "played", kind: "flag" });
    recordJourneyEvent({ type: "read-work", slug: "maxie" });
    recordJourneyEvent({ type: "converted", target: "contact" });

    expect(signals).toEqual([
      {
        reaction: "milestone",
        source: "journey:scrolled",
        timestamp: 700,
      },
      {
        reaction: "milestone",
        source: "journey:played",
        timestamp: 700,
      },
      {
        reaction: "milestone",
        source: "journey:read-work",
        timestamp: 700,
      },
      {
        reaction: "shipped",
        source: "journey:converted",
        timestamp: 700,
      },
    ]);
    unsubscribe();
  });

  it("keeps production journey modules on the compatibility bus boundary", () => {
    const journeyDirectory = resolve(process.cwd(), "src/features/journey");
    const productionModules = readdirSync(journeyDirectory).filter(
      (file) =>
        /\.(ts|tsx)$/.test(file) &&
        !file.endsWith(".test.ts") &&
        !file.endsWith(".test.tsx"),
    );
    const rendererImport =
      /(?:from\s+|import\s*\(\s*)["'](?:three(?:\/[^"']*)?|@react-three\/(?:fiber|drei)|@\/features\/world(?:\/[^"']*)?)["']/;

    for (const file of productionModules) {
      const source = readFileSync(resolve(journeyDirectory, file), "utf8");
      expect(source, `${file} must not import world renderer code`).not.toMatch(
        rendererImport,
      );
    }
  });

  it("writes only the disclosed tab-local stream and never transmits it", () => {
    const localWrite = vi.spyOn(Storage.prototype, "setItem");
    const network = vi.fn();
    vi.stubGlobal("fetch", network);

    startJourney(100);
    recordJourneyEvent({ type: "played", kind: "drag" });
    recordJourneyEvent({ type: "converted", target: "contact" });

    expect(localWrite).toHaveBeenCalled();
    expect(new Set(localWrite.mock.calls.map(([key]) => key))).toEqual(
      new Set([JOURNEY_STORAGE_KEY]),
    );
    expect(network).not.toHaveBeenCalled();
  });

  it("hydrates the same event stream after a same-tab reload", () => {
    sessionStorage.setItem(
      JOURNEY_STORAGE_KEY,
      JSON.stringify([
        { type: "landed", at: 100 },
        { type: "scrolled", at: 120 },
        { type: "played", kind: "flag", at: 140 },
      ]),
    );

    startJourney(999);

    expect(getJourneySnapshot()).toMatchObject({
      startedAt: 100,
      interactions: 1,
      reached: { landed: true, scrolled: true, played: true },
    });
  });
});
