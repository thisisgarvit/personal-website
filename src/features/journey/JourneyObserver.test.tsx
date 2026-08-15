import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { JourneyObserver } from "./JourneyObserver";
import {
  getJourneySnapshot,
  resetJourneyForTests,
} from "./journey-store";

describe("journey observation", () => {
  afterEach(() => {
    cleanup();
    resetJourneyForTests();
  });

  it("recognizes scroll and explicit CTA conversions without collecting identity", () => {
    const { container } = render(
      <>
        <JourneyObserver />
        <a
          href="/resume.pdf"
          data-journey-conversion="resume"
          onClick={(event) => event.preventDefault()}
        >
          Resume
        </a>
      </>,
    );

    Object.defineProperty(window, "scrollY", { configurable: true, value: 400 });
    fireEvent.scroll(window);
    fireEvent.click(container.querySelector("a")!);

    expect(getJourneySnapshot().reached.scrolled).toBe(true);
    expect(getJourneySnapshot().conversion).toBe("resume");
  });
});
