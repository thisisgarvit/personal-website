import type { MetadataRoute } from "next";

/**
 * Robots policy (PRD §12/§16: "Vercel preview remains noindex").
 *
 * Only the production Vercel environment is indexable. Preview and
 * development deployments (VERCEL_ENV = "preview" | "development") and
 * local builds (VERCEL_ENV unset) return a noindex-all policy so no
 * pre-release URL leaks into search results.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
