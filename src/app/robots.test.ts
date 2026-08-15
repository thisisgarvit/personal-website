import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "./robots";

/**
 * PRD §16: "Vercel preview remains noindex". Only VERCEL_ENV=production
 * serves an allow-all policy; preview/development/local all disallow.
 */
describe("robots policy per deployment environment", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows all crawling only in the production environment", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
    });
  });

  it.each(["preview", "development"])(
    "disallows all crawling for VERCEL_ENV=%s",
    (env) => {
      vi.stubEnv("VERCEL_ENV", env);
      expect(robots()).toEqual({
        rules: { userAgent: "*", disallow: "/" },
      });
    },
  );

  it("disallows all crawling when VERCEL_ENV is unset (local builds)", () => {
    vi.stubEnv("VERCEL_ENV", "");
    expect(robots()).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });
});
