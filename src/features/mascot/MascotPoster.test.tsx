import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MascotPoster } from "./MascotPoster";

describe("MascotPoster", () => {
  it("server-renders the on-call figure before any WebGL can load", () => {
    const markup = renderToStaticMarkup(<MascotPoster />);

    expect(markup).toContain("<svg");
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('data-mascot-part="pager"');
    expect(markup).not.toContain("canvas");
  });
});
