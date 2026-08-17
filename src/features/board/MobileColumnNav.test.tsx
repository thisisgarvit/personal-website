import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { boardColumns } from "@/data/work";
import { MobileColumnNav } from "./MobileColumnNav";

/**
 * Gate D2 mobile discovery contract (plan Task 6): explicit, labelled
 * column navigation. Tabs are real buttons with roving selection, a
 * visible "n of 3" position, and previous/next controls — nothing here
 * requires a drag gesture.
 */

function renderNav(overrides: Partial<Parameters<typeof MobileColumnNav>[0]> = {}) {
  const handlers = {
    onSelect: vi.fn(),
    onPrevious: vi.fn(),
    onNext: vi.fn(),
  };
  render(
    <MobileColumnNav
      columns={boardColumns}
      activeIndex={0}
      {...handlers}
      {...overrides}
    />,
  );
  return handlers;
}

describe("MobileColumnNav", () => {
  afterEach(cleanup);

  it("renders a labelled tablist of real button tabs for every column", () => {
    renderNav();

    const tablist = screen.getByRole("tablist", { name: "Board columns" });
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      "Shipped",
      "In progress",
      "Backlog",
    ]);
    tabs.forEach((tab) => {
      expect(tab.tagName).toBe("BUTTON");
      expect((tab as HTMLButtonElement).type).toBe("button");
    });
    expect(tablist.contains(tabs[0])).toBe(true);
  });

  it("marks the active column with roving tab selection", () => {
    renderNav({ activeIndex: 1 });

    const tabs = screen.getAllByRole("tab");
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs[1].tabIndex).toBe(0);
    expect(tabs[0].getAttribute("aria-selected")).toBe("false");
    expect(tabs[0].tabIndex).toBe(-1);
    expect(tabs[2].tabIndex).toBe(-1);
  });

  it("shows the visible n-of-3 position text", () => {
    renderNav({ activeIndex: 1 });
    expect(screen.getByText("2 of 3")).toBeTruthy();
  });

  it("disables previous at the first column and next at the last", () => {
    renderNav({ activeIndex: 0 });
    expect(
      (screen.getByRole("button", { name: "Previous column" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "Next column" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    cleanup();

    renderNav({ activeIndex: 2 });
    expect(
      (screen.getByRole("button", { name: "Previous column" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    expect(
      (screen.getByRole("button", { name: "Next column" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it("selects exact indices from tab clicks and pager controls", () => {
    const handlers = renderNav({ activeIndex: 1 });

    fireEvent.click(screen.getByRole("tab", { name: "Backlog" }));
    expect(handlers.onSelect).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole("button", { name: "Previous column" }));
    expect(handlers.onPrevious).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Next column" }));
    expect(handlers.onNext).toHaveBeenCalledTimes(1);
  });

  it("moves the roving selection with arrow, Home, and End keys", () => {
    const handlers = renderNav({ activeIndex: 1 });
    const tabs = screen.getAllByRole("tab");
    tabs[1].focus();

    fireEvent.keyDown(tabs[1], { key: "ArrowRight" });
    expect(handlers.onSelect).toHaveBeenLastCalledWith(2);
    expect(document.activeElement).toBe(tabs[2]);

    fireEvent.keyDown(tabs[1], { key: "ArrowLeft" });
    expect(handlers.onSelect).toHaveBeenLastCalledWith(0);
    expect(document.activeElement).toBe(tabs[0]);

    fireEvent.keyDown(tabs[1], { key: "End" });
    expect(handlers.onSelect).toHaveBeenLastCalledWith(2);
    fireEvent.keyDown(tabs[1], { key: "Home" });
    expect(handlers.onSelect).toHaveBeenLastCalledWith(0);
  });

  it("keeps arrow selection clamped at the edges without wrapping", () => {
    const handlers = renderNav({ activeIndex: 0 });
    const tabs = screen.getAllByRole("tab");

    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(handlers.onSelect).not.toHaveBeenCalled();
  });
});
