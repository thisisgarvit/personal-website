import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  publishBoardHealth,
  resetBuildHealthForTests,
} from "@/features/board/build-health";
import { authoredBoardPositions } from "@/features/board/storage";
import { ProductChrome } from "./ProductChrome";

describe("live product chrome", () => {
  afterEach(() => {
    cleanup();
    resetBuildHealthForTests();
  });

  it("switches dot, candid ticker, and status from board health", () => {
    const { container } = render(<ProductChrome />);
    expect(screen.getByText("Build healthy")).toBeTruthy();
    expect(screen.getByText("BUILD HEALTHY")).toBeTruthy();

    act(() =>
      publishBoardHealth({
        ...authoredBoardPositions,
        "stay-portal": "backlog",
      }),
    );

    expect(screen.getByText("Build incident")).toBeTruthy();
    expect(screen.getByText("INCIDENT")).toBeTruthy();
    expect(
      screen.getByText("incident: shipped work demoted. investigating."),
    ).toBeTruthy();
    expect(
      container.querySelector("[data-build-health='incident']"),
    ).not.toBeNull();
  });
});
