import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { subscribeToasts, type ToastEvent } from "@/components/toast/toast";
import { BOARD_STORAGE_KEY } from "@/data/storage";
import {
  subscribeMascotSignals,
  type MascotSignal,
} from "@/features/mascot/signals";
import { InteractiveBoardSection } from "./InteractiveBoardSection";
import {
  getBuildHealthSnapshot,
  resetBuildHealthForTests,
} from "./build-health";

class TestPointerEvent extends MouseEvent {
  readonly pointerId: number;
  readonly pointerType: string;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
    this.pointerType = init.pointerType ?? "mouse";
  }

  getCoalescedEvents(): PointerEvent[] {
    return [];
  }
}

function installMatchMedia(reducedMotion = false) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion") && reducedMotion,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("InteractiveBoardSection", () => {
  beforeEach(() => {
    sessionStorage.clear();
    installMatchMedia();
  });

  afterEach(() => {
    cleanup();
    resetBuildHealthForTests();
    vi.unstubAllGlobals();
  });

  it("hydrates a valid same-tab board mapping while preserving direct links", async () => {
    sessionStorage.setItem(
      BOARD_STORAGE_KEY,
      JSON.stringify({
        "stay-portal": "shipped",
        maxie: "backlog",
        "agentic-calendar": "in-progress",
        "dynamic-island": "backlog",
      }),
    );

    render(<InteractiveBoardSection />);

    const backlog = screen.getByRole("region", { name: "Backlog" });
    await waitFor(() => {
      expect(within(backlog).getByRole("link", { name: /AI Browser — Maxie/ })).toBeTruthy();
    });
    expect(
      screen.getByRole("link", { name: /AI Browser — Maxie/ }).getAttribute("href"),
    ).toBe("/work/maxie");
    expect(screen.getByText("State lasts for this tab.")).toBeTruthy();
  });

  it("moves immediately by keyboard, retains focus, announces, and opens Shipped", async () => {
    const events: ToastEvent[] = [];
    const unsubscribe = subscribeToasts((event) => events.push(event));
    render(<InteractiveBoardSection />);
    const maxie = screen.getByRole("link", { name: /AI Browser — Maxie/ });
    maxie.focus();

    fireEvent.keyDown(maxie, { key: "ArrowLeft", altKey: true });

    const shipped = screen.getByRole("region", { name: "Shipped" });
    const moved = within(shipped).getByRole("link", { name: /AI Browser — Maxie/ });
    expect(document.activeElement).toBe(moved);
    expect(events.at(-1)).toMatchObject({
      message: "AI Browser — Maxie moved to Shipped",
      announce: true,
      visual: false,
    });
    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "AI Browser — Maxie" }),
    ).toBeTruthy();
    expect(JSON.parse(sessionStorage.getItem(BOARD_STORAGE_KEY) ?? "{}").maxie).toBe(
      "shipped",
    );
    unsubscribe();
  });

  it("turns a demoted shipped product into an incident and reset resolves it", () => {
    render(<InteractiveBoardSection />);
    const stayPortal = screen.getByRole("link", { name: /Stay Portal/ });

    fireEvent.keyDown(stayPortal, { key: "ArrowRight", altKey: true });
    expect(getBuildHealthSnapshot()).toBe("incident");

    fireEvent.click(screen.getByRole("button", { name: "Reset board" }));
    expect(getBuildHealthSnapshot()).toBe("healthy");
  });

  it("opens a substantial preview from the ticket body without mutating its route", () => {
    render(<InteractiveBoardSection />);

    fireEvent.click(screen.getByRole("link", { name: /Stay Portal/ }));

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("The product bet")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Read full case/ }).getAttribute("href")).toBe(
      "/work/stay-portal",
    );
  });

  it("reset restores authored positions, clears storage, and uses the sole reset toast", () => {
    const events: ToastEvent[] = [];
    const unsubscribe = subscribeToasts((event) => events.push(event));
    sessionStorage.setItem(
      BOARD_STORAGE_KEY,
      JSON.stringify({
        "stay-portal": "backlog",
        maxie: "backlog",
        "agentic-calendar": "backlog",
        "dynamic-island": "backlog",
      }),
    );
    render(<InteractiveBoardSection />);

    fireEvent.click(screen.getByRole("button", { name: "Reset board" }));

    expect(sessionStorage.getItem(BOARD_STORAGE_KEY)).toBeNull();
    expect(
      within(screen.getByRole("region", { name: "Shipped" })).getByRole("link", {
        name: /Stay Portal/,
      }),
    ).toBeTruthy();
    expect(events.at(-1)?.message).toBe(
      "Board reset. No sprint ceremony required.",
    );
    unsubscribe();
  });

  it("reset releases an active pointer drag and returns the mascot to idle", () => {
    vi.stubGlobal("PointerEvent", TestPointerEvent);
    const signals: MascotSignal[] = [];
    const unsubscribe = subscribeMascotSignals((signal) => signals.push(signal));
    render(<InteractiveBoardSection />);
    const board = document.querySelector<HTMLElement>("[data-board]")!;
    const columns = Array.from(
      board.querySelectorAll<HTMLElement>("[data-column]"),
    );
    const maxie = document.querySelector<HTMLElement>("[data-ticket='maxie']")!;
    const grip = screen.getByRole("button", { name: "Drag AI Browser — Maxie" });
    const capture = { active: false, released: false };

    Object.defineProperty(board, "getBoundingClientRect", {
      value: () => new DOMRect(0, 0, 900, 600),
    });
    columns.forEach((column, index) => {
      Object.defineProperty(column, "getBoundingClientRect", {
        value: () => new DOMRect(index * 300, 0, 300, 600),
      });
    });
    Object.defineProperty(maxie, "getBoundingClientRect", {
      value: () => new DOMRect(325, 100, 250, 180),
    });
    Object.assign(grip, {
      setPointerCapture: () => {
        capture.active = true;
      },
      hasPointerCapture: () => capture.active,
      releasePointerCapture: () => {
        capture.active = false;
        capture.released = true;
      },
    });

    fireEvent.pointerDown(grip, {
      pointerId: 7,
      pointerType: "mouse",
      button: 0,
      clientX: 540,
      clientY: 150,
    });
    fireEvent.pointerMove(grip, {
      pointerId: 7,
      pointerType: "mouse",
      clientX: 565,
      clientY: 150,
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset board" }));

    expect(signals.map((signal) => signal.reaction)).toEqual([
      "drag-watch",
      "idle",
    ]);
    expect(capture.released).toBe(true);
    expect(maxie.style.transform).toBe("");
    unsubscribe();
  });
});
