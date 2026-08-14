import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

/**
 * Exactly the five public routes (PRD §3). No /changelog, /about, /resume,
 * /contact, or /blog.
 *
 * `siteOrigin` is null until a production domain/deploy origin is configured
 * at release time (PRD §18); localhost is a placeholder base for local builds
 * and is replaced by config, never inferred from request headers.
 */
const PUBLIC_ROUTES = [
  "/",
  "/work/stay-portal",
  "/work/maxie",
  "/work/agentic-calendar",
  "/notes/dynamic-island",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteOrigin ?? "http://localhost:3000";
  return PUBLIC_ROUTES.map((route) => ({
    url: `${base}${route === "/" ? "" : route}`,
  }));
}
