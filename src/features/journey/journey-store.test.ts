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
  afterEach(() => resetJourneyForTests());

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
    const signals: MascotSignal[] = [];
    const unsubscribe = subscribeMascotSignals((signal) => signals.push(signal));

    startJourney(100);
    recordJourneyEvent({ type: "played", kind: "flag" });
    recordJourneyEvent({ type: "played", kind: "flag" });
    recordJourneyEvent({ type: "read-work", slug: "maxie" });

    expect(signals.map(({ reaction, source }) => ({ reaction, source }))).toEqual([
      { reaction: "milestone", source: "journey:played" },
      { reaction: "milestone", source: "journey:read-work" },
    ]);
    unsubscribe();
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
