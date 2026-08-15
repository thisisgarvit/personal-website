import { afterEach, describe, expect, it, vi } from "vitest";
import { authoredBoardPositions, type BoardPositions } from "./storage";
import {
  deriveBuildHealth,
  getBuildHealthSnapshot,
  publishBoardHealth,
  resetBuildHealthForTests,
  subscribeBuildHealth,
} from "./build-health";
import {
  subscribeMascotSignals,
  type MascotSignal,
} from "@/features/mascot/signals";
import { resetJourneyForTests } from "@/features/journey/journey-store";

function positions(
  overrides: Partial<BoardPositions> = {},
): BoardPositions {
  return { ...authoredBoardPositions, ...overrides };
}

describe("board-derived build health", () => {
  afterEach(() => {
    resetBuildHealthForTests();
    resetJourneyForTests();
  });

  it("treats the real shipped product as the build-health invariant", () => {
    expect(deriveBuildHealth(positions())).toBe("healthy");
    expect(
      deriveBuildHealth(positions({ "stay-portal": "in-progress" })),
    ).toBe("incident");
    expect(
      deriveBuildHealth(
        positions({ "stay-portal": "backlog", maxie: "shipped" }),
      ),
    ).toBe("incident");
  });

  it("publishes one incident and one resolution transition", () => {
    vi.spyOn(Date, "now").mockReturnValue(900);
    const health: string[] = [];
    const mascot: MascotSignal[] = [];
    const unsubscribeHealth = subscribeBuildHealth(() =>
      health.push(getBuildHealthSnapshot()),
    );
    const unsubscribeMascot = subscribeMascotSignals((signal) =>
      mascot.push(signal),
    );

    publishBoardHealth(positions({ "stay-portal": "backlog" }));
    publishBoardHealth(positions({ "stay-portal": "backlog" }));
    publishBoardHealth(positions());

    expect(health).toEqual(["incident", "healthy"]);
    expect(mascot).toEqual([
      { reaction: "milestone", source: "journey:played", timestamp: 900 },
      { reaction: "incident", source: "stay-portal", timestamp: 900 },
      { reaction: "resolved", source: "stay-portal", timestamp: 900 },
    ]);

    unsubscribeHealth();
    unsubscribeMascot();
  });
});
