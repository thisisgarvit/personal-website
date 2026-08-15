import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MascotPoster } from "./MascotPoster";

describe("MascotPoster", () => {
  it("server-renders the sourced session analyst before WebGL can load", () => {
    const markup = renderToStaticMarkup(<MascotPoster />);

    expect(markup).toContain("<img");
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain("session-analyst-robot-poster.webp");
    expect(markup).toContain("session-analyst-robot-poster-dark.webp");
    expect(markup).toContain('data-mascot-part="session-analyst"');
    expect(markup).not.toContain("canvas");
  });
});
