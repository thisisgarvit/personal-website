import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ExperimentStrip } from "./ExperimentStrip";

describe("ExperimentStrip", () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(cleanup);

  it("places the experiment message in a named complementary landmark", () => {
    render(<ExperimentStrip />);

    expect(
      screen.getByRole("complementary", { name: "Experiment status" }),
    ).toBeTruthy();
  });
});
