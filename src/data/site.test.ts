import { describe, expect, it } from "vitest";
import { productLabel, siteConfig } from "./site";

describe("siteConfig", () => {
  it("derives productLabel from productName and version", () => {
    expect(productLabel).toBe(
      `${siteConfig.productName} v${siteConfig.version}`,
    );
    // Hardcoding the label is allowed only in this module's tests (PRD §4).
    expect(productLabel).toBe("garvit.app v2.4.1");
  });
});
