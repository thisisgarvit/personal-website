import { act, cleanup, render, screen } from "@testing-library/react";
import { createRef, useEffect } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { emitMascotSignal } from "@/features/mascot/signals";
import { WorldAnchor } from "./WorldAnchor";
import {
  WorldProvider,
  useWorldDirector,
  useWorldSnapshot,
} from "./WorldProvider";
import type { WorldDirector } from "./types";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function DirectorProbe({ onReady }: { onReady: (value: WorldDirector) => void }) {
  const director = useWorldDirector();
  useEffect(() => onReady(director), [director, onReady]);
  return null;
}

function ReactionProbe() {
  const { reaction } = useWorldSnapshot();
  return <output aria-label="Guide reaction">{reaction.reaction}</output>;
}

describe("WorldProvider and WorldAnchor", () => {
  it("registers a div anchor, preserves its heading, and forwards its ref", () => {
    let director: WorldDirector | null = null;
    const ref = createRef<HTMLElement>();
    const onReady = (value: WorldDirector) => {
      director = value;
    };
    const { container, rerender } = render(
      <WorldProvider>
        <DirectorProbe onReady={onReady} />
      </WorldProvider>,
    );
    expect(director).not.toBeNull();
    const register = vi.spyOn(director!, "registerAnchor");

    rerender(
      <WorldProvider>
        <DirectorProbe onReady={onReady} />
        <WorldAnchor id="board" as="div" ref={ref} className="board-anchor">
          <section aria-labelledby="work-heading">
            <h2 id="work-heading">Things I have built</h2>
          </section>
        </WorldAnchor>
      </WorldProvider>,
    );

    const anchor = container.querySelector('[data-world-anchor="board"]');
    expect(anchor?.tagName).toBe("DIV");
    expect(anchor?.className).toBe("board-anchor");
    expect(ref.current).toBe(anchor);
    expect(screen.getByRole("heading", { name: "Things I have built" })).toBeTruthy();
    expect(register).toHaveBeenCalledWith("board", anchor);

    rerender(
      <WorldProvider>
        <DirectorProbe onReady={onReady} />
      </WorldProvider>,
    );
    expect(register).toHaveBeenLastCalledWith("board", null);
  });

  it("defaults to a section and supports callback refs", () => {
    const callbackRef = vi.fn();
    const { container, unmount } = render(
      <WorldProvider>
        <WorldAnchor id="hero" ref={callbackRef} aria-label="Hero scene" />
      </WorldProvider>,
    );

    const anchor = container.querySelector('[data-world-anchor="hero"]');
    expect(anchor?.tagName).toBe("SECTION");
    expect(callbackRef).toHaveBeenCalledWith(anchor);

    unmount();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });

  it("registers all three authored anchors without nesting landmarks", () => {
    const { container } = render(
      <WorldProvider>
        <WorldAnchor id="hero" as="div"><section aria-label="Hero" /></WorldAnchor>
        <WorldAnchor id="board" as="div"><section aria-label="Board" /></WorldAnchor>
        <WorldAnchor id="journey" as="div"><section aria-label="Journey" /></WorldAnchor>
      </WorldProvider>,
    );

    expect(container.querySelectorAll("[data-world-anchor]")).toHaveLength(3);
    expect(container.querySelectorAll("section section")).toHaveLength(0);
  });

  it("throws a clear error when the director is read outside its provider", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    function OutsideConsumer() {
      useWorldDirector();
      return null;
    }

    expect(() => render(<OutsideConsumer />)).toThrow(
      "useWorldDirector must be used within WorldProvider",
    );
    error.mockRestore();
  });

  it("receives the shared signal once and advances it with one provider timer", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    let director: WorldDirector | null = null;
    render(
      <WorldProvider>
        <DirectorProbe onReady={(value) => { director = value; }} />
        <ReactionProbe />
      </WorldProvider>,
    );
    expect(director).not.toBeNull();
    const receiveSignal = vi.spyOn(director!, "receiveSignal");
    const advanceReaction = vi.spyOn(director!, "advanceReaction");

    act(() => {
      emitMascotSignal({
        reaction: "notice",
        source: "resume",
        timestamp: 1_000,
      });
    });
    expect(screen.getByLabelText("Guide reaction").textContent).toBe("notice");
    expect(receiveSignal).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(900));
    expect(screen.getByLabelText("Guide reaction").textContent).toBe("idle");
    expect(advanceReaction).toHaveBeenCalledTimes(1);
  });
});
