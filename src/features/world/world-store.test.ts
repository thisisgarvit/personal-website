import { describe, expect, it, vi } from "vitest";
import { createWorldDirector } from "./world-store";

function anchorAt(top: number, height = 400): HTMLElement {
  const node = document.createElement("div");
  vi.spyOn(node, "getBoundingClientRect").mockImplementation(
    () =>
      ({
        x: 0,
        y: top,
        top,
        left: 0,
        right: 100,
        bottom: top + height,
        width: 100,
        height,
        toJSON: () => undefined,
      }) as DOMRect,
  );
  return node;
}

describe("createWorldDirector", () => {
  it("keeps snapshot identity for continuous measurements", () => {
    const director = createWorldDirector();
    const before = director.getSnapshot();
    const presentation = vi.fn();
    director.subscribePresentation(presentation);

    director.measure(900);

    expect(director.getSnapshot()).toBe(before);
    expect(presentation).toHaveBeenCalledTimes(1);
  });

  it("publishes each discrete change once and ignores idempotent setters", () => {
    const director = createWorldDirector();
    const listener = vi.fn();
    director.subscribe(listener);

    director.setDragging(true);
    const dragging = director.getSnapshot();
    director.setDragging(true);
    director.setActiveWork("maxie");
    director.setActiveWork("maxie");
    director.setDocumentVisible(false);
    director.setDocumentVisible(false);

    expect(dragging.dragging).toBe(true);
    expect(director.getSnapshot()).toMatchObject({
      activeWork: "maxie",
      dragging: true,
      documentVisible: false,
    });
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("replaces and unregisters anchor nodes without stale measurements", () => {
    const director = createWorldDirector();
    const first = anchorAt(120, 300);
    const replacement = anchorAt(240, 500);

    director.registerAnchor("hero", first);
    director.measure(900);
    expect(director.readAnchor("hero")).toMatchObject({ top: 120, height: 300 });

    director.registerAnchor("hero", replacement);
    director.measure(900);
    expect(director.readAnchor("hero")).toMatchObject({ top: 240, height: 500 });

    director.registerAnchor("hero", null);
    expect(director.readAnchor("hero")).toBeNull();
  });

  it("uses center proximity, DOM-order ties, and an eight-percent hysteresis", () => {
    const director = createWorldDirector();
    let heroTop = 150;
    let boardTop = 510;
    const hero = anchorAt(0);
    const board = anchorAt(0);
    vi.mocked(hero.getBoundingClientRect).mockImplementation(
      () =>
        ({
          top: heroTop,
          bottom: heroTop + 400,
          height: 400,
        }) as DOMRect,
    );
    vi.mocked(board.getBoundingClientRect).mockImplementation(
      () =>
        ({
          top: boardTop,
          bottom: boardTop + 400,
          height: 400,
        }) as DOMRect,
    );

    director.registerAnchor("hero", hero);
    director.registerAnchor("board", board);
    director.measure(900);
    expect(director.getSnapshot().activeScene).toBe("hero");

    // Board is only 25px closer, below the 72px switch threshold.
    heroTop = 300;
    boardTop = 225;
    director.measure(900);
    expect(director.getSnapshot().activeScene).toBe("hero");

    // Board becomes 125px closer and takes ownership.
    heroTop = 400;
    boardTop = 225;
    director.measure(900);
    expect(director.getSnapshot().activeScene).toBe("board");

    // "At least 8%" includes equality: 250px - 178px = 72px.
    heroTop = 428;
    boardTop = 500;
    director.measure(900);
    expect(director.getSnapshot().activeScene).toBe("hero");

    // Exact ties resolve in authored DOM order, not registration order.
    const tied = createWorldDirector();
    tied.registerAnchor("journey", anchorAt(100, 400));
    tied.registerAnchor("board", anchorAt(100, 400));
    tied.measure(900);
    expect(tied.getSnapshot().activeScene).toBe("board");
  });

  it("reads each anchor once and clamps its continuous progress", () => {
    const director = createWorldDirector();
    const hero = anchorAt(900, 300);
    const board = anchorAt(-600, 300);
    director.registerAnchor("hero", hero);
    director.registerAnchor("board", board);

    director.measure(900);

    expect(hero.getBoundingClientRect).toHaveBeenCalledTimes(1);
    expect(board.getBoundingClientRect).toHaveBeenCalledTimes(1);
    expect(director.readAnchor("hero")?.viewportProgress).toBe(0);
    expect(director.readAnchor("board")?.viewportProgress).toBe(1);
  });

  it("publishes visibility only when the active viewport union changes", () => {
    const director = createWorldDirector();
    const listener = vi.fn();
    const hero = anchorAt(950, 300);
    director.subscribe(listener);
    director.registerAnchor("hero", hero);

    director.measure(900);
    expect(director.getSnapshot().activeRegionVisible).toBe(false);
    expect(listener).not.toHaveBeenCalled();

    vi.mocked(hero.getBoundingClientRect).mockImplementation(
      () => ({ top: 700, bottom: 1000, height: 300 }) as DOMRect,
    );
    director.measure(900);
    const visible = director.getSnapshot();
    vi.mocked(hero.getBoundingClientRect).mockImplementation(
      () => ({ top: 650, bottom: 950, height: 300 }) as DOMRect,
    );
    director.measure(900);

    expect(visible.activeRegionVisible).toBe(true);
    expect(director.getSnapshot()).toBe(visible);
    expect(director.readAnchor("hero")?.top).toBe(650);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("preserves signal semantics and advances timed reactions", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    const director = createWorldDirector();

    director.receiveSignal({
      reaction: "notice",
      source: "resume",
      timestamp: 1_000,
    });

    expect(director.getSnapshot().reaction).toEqual({
      reaction: "notice",
      source: "resume",
      expiresAt: 1_900,
      queued: null,
    });

    director.advanceReaction(1_900);
    expect(director.getSnapshot().reaction.reaction).toBe("idle");
    vi.useRealTimers();
  });
});
