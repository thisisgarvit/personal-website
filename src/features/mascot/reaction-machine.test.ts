import { describe, expect, it } from "vitest";
import type { MascotSignal } from "./signals";
import {
  advanceMascotState,
  createMascotState,
  receiveMascotSignal,
} from "./reaction-machine";

function signal(
  reaction: MascotSignal["reaction"],
  timestamp: number,
  source: MascotSignal["source"] = "release",
): MascotSignal {
  return { reaction, source, timestamp };
}

describe("mascot reaction arbitration", () => {
  it("prevents a lower-priority hover from interrupting a shipped celebration", () => {
    const shipped = receiveMascotSignal(
      createMascotState(),
      signal("shipped", 100, "maxie"),
      100,
    );

    const afterHover = receiveMascotSignal(
      shipped,
      signal("notice", 200, "resume"),
      200,
    );

    expect(afterHover.reaction).toBe("shipped");
    expect(afterHover.source).toBe("maxie");
    expect(afterHover.expiresAt).toBe(1500);
  });

  it("expires notice, flag-check, and shipped at their locked maximums", () => {
    const cases = [
      ["notice", 900],
      ["flag-check", 1000],
      ["shipped", 1400],
    ] as const;

    for (const [reaction, duration] of cases) {
      const active = receiveMascotSignal(
        createMascotState(),
        signal(reaction, 500),
        500,
      );
      expect(advanceMascotState(active, 499 + duration).reaction).toBe(
        reaction,
      );
      expect(advanceMascotState(active, 500 + duration).reaction).toBe(
        "idle",
      );
    }
  });

  it("lets an active drag own the figure and yields to the best queued reaction on release", () => {
    let state = receiveMascotSignal(
      createMascotState(),
      signal("drag-watch", 100, "maxie"),
      100,
    );
    state = receiveMascotSignal(
      state,
      signal("flag-check", 200, "dark_mode"),
      200,
    );
    state = receiveMascotSignal(
      state,
      signal("notice", 300, "contact"),
      300,
    );

    expect(state.reaction).toBe("drag-watch");
    expect(state.queued?.reaction).toBe("flag-check");

    state = receiveMascotSignal(
      state,
      signal("idle", 400, "maxie"),
      400,
    );

    expect(state.reaction).toBe("flag-check");
    expect(state.expiresAt).toBe(1200);
    expect(state.queued).toBeNull();
  });

  it("discards a queued reaction if it expired while a long drag was active", () => {
    let state = receiveMascotSignal(
      createMascotState(),
      signal("drag-watch", 0, "maxie"),
      0,
    );
    state = receiveMascotSignal(
      state,
      signal("notice", 100, "resume"),
      100,
    );
    state = receiveMascotSignal(
      state,
      signal("idle", 1200, "maxie"),
      1200,
    );

    expect(state.reaction).toBe("idle");
    expect(state.queued).toBeNull();
  });

  it("holds an incident until board health resolves, then shows relief", () => {
    let state = receiveMascotSignal(
      createMascotState(),
      signal("incident", 100, "stay-portal"),
      100,
    );

    expect(state.reaction).toBe("incident");
    expect(state.expiresAt).toBeNull();
    expect(
      receiveMascotSignal(state, signal("notice", 200, "resume"), 200)
        .reaction,
    ).toBe("incident");

    state = receiveMascotSignal(
      state,
      signal("resolved", 400, "stay-portal"),
      400,
    );
    expect(state.reaction).toBe("resolved");
    expect(advanceMascotState(state, 1999).reaction).toBe("resolved");
    expect(advanceMascotState(state, 2000).reaction).toBe("idle");
  });
});
