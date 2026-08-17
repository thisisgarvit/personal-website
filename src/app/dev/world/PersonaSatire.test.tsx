import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PERSONA_STORAGE_KEY } from "@/data/storage";
import { PersonaSatire } from "./PersonaSatire";

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock("@/lib/analytics", () => ({ analytics: { track } }));

describe("PersonaSatire", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    track.mockClear();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders no dead onboarding controls without client hydration", () => {
    expect(renderToString(<PersonaSatire />)).toBe("");
  });

  it("captures a fixed persona, shows the joke, then dismisses for the tab", () => {
    render(<PersonaSatire />);

    fireEvent.click(screen.getByRole("button", { name: "Founder" }));

    expect(sessionStorage.getItem(PERSONA_STORAGE_KEY)).toBe("founder");
    expect(track).toHaveBeenCalledWith("persona_selected", {
      persona: "founder",
      surface: "hero_onboarding",
      $set: { visitor_persona: "founder" },
    });
    expect(
      screen.getByText("Noted. This changes nothing. It never does.").hidden,
    ).toBe(false);

    act(() => vi.advanceTimersByTime(1800));
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("lets visitors skip without sending a persona event", () => {
    render(<PersonaSatire />);

    fireEvent.click(screen.getByRole("button", { name: "Skip" }));

    expect(sessionStorage.getItem(PERSONA_STORAGE_KEY)).toBe("skipped");
    expect(track).not.toHaveBeenCalled();
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("stays dismissed after a completed choice in the same tab", () => {
    sessionStorage.setItem(PERSONA_STORAGE_KEY, "product_lead");
    render(<PersonaSatire />);

    expect(screen.queryByRole("complementary")).toBeNull();
    expect(track).not.toHaveBeenCalled();
  });

  it("restores the authored tray when stored persona data is invalid", () => {
    sessionStorage.setItem(PERSONA_STORAGE_KEY, "definitely_not_a_persona");
    render(<PersonaSatire />);

    expect(
      screen.getByRole("complementary", { name: "What brings you here?" }),
    ).toBeTruthy();
    expect(track).not.toHaveBeenCalled();
  });
});
