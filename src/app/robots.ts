import type { MetadataRoute } from "next";

/**
 * Production robots: allow everything (PRD §3).
 *
 * TODO(Task 9): preview deployments must be noindex/nofollow — handled at
 * deploy wiring (Vercel preview detection), not here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
