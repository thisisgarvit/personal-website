import type { MetadataRoute } from "next";
import { resolveSiteOrigin } from "@/data/site";

/**
 * Exactly the five public routes (PRD §3). No /changelog, /about, /resume,
 * /contact, or /blog.
 *
 * The base origin comes from `resolveSiteOrigin()` (PRD §18 fallback
 * chain: configured `siteOrigin` → deployment `VERCEL_URL` → localhost)
 * and is never inferred from request headers. Preview deployments emit
 * self-consistent absolute URLs but stay noindex via `robots.ts`.
 */
const PUBLIC_ROUTES = [
  "/",
  "/work/stay-portal",
  "/work/maxie",
  "/work/agentic-calendar",
  "/notes/dynamic-island",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = resolveSiteOrigin();
  return PUBLIC_ROUTES.map((route) => ({
    url: `${base}${route === "/" ? "" : route}`,
  }));
}
