// @vitest-environment node

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Image, {
  OgCard,
  alt,
  contentType,
  size,
} from "./opengraph-image";

describe("opengraph image", () => {
  it("renders Garvit name-first with the approved promise and real work labels", () => {
    const markup = renderToStaticMarkup(<OgCard />);

    expect(markup).toContain("Garvit Sukhija");
    expect(markup).toContain(
      "I turn fuzzy product ideas into things people can use",
    );
    expect(markup).not.toContain("Product Manager who builds");
    expect(markup).not.toContain("— Product Manager");
    expect(markup).toContain("garvit.app");
    expect(markup).toContain("v2.4.1");
    expect(markup).toContain("DELHI / IST");
    expect(markup).toContain("Shipped");
    expect(markup).toContain("In progress");
    expect(markup).toContain("Backlog");
    expect(markup).toContain("Stay Portal");
  });

  it("generates the deterministic 1200 by 630 PNG response", async () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
    expect(alt).toBe("Garvit Sukhija portfolio board");

    const response = await Image();
    const png = new Uint8Array(await response.arrayBuffer());
    const view = new DataView(png.buffer, png.byteOffset, png.byteLength);

    expect(response.headers.get("content-type")).toContain("image/png");
    expect(Array.from(png.slice(0, 8))).toEqual([
      137, 80, 78, 71, 13, 10, 26, 10,
    ]);
    expect(view.getUint32(16)).toBe(1200);
    expect(view.getUint32(20)).toBe(630);
    expect(png.byteLength).toBeGreaterThan(10_000);
  });
});
