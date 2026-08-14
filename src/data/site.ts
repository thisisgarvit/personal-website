/**
 * Single source of truth for all identity strings (PRD §4).
 *
 * Chrome, release popover, footer, title templates, metadata, OG card,
 * build-mentioning toasts, and test fixtures must import from this module.
 * Do not hardcode `garvit.app`, `v2.4.1`, or their concatenation outside
 * this module and its tests.
 */

export interface SiteConfig {
  productName: string;
  version: string;
  personName: "Garvit Sukhija";
  role: "Product Manager";
  location: "Delhi / IST";
  hero: "I turn fuzzy product ideas into things people can use";
  email: "garvit.sukh@gmail.com";
  siteOrigin: string | null;
  resumePath: string;
}

export const siteConfig: SiteConfig = {
  productName: "garvit.app",
  version: "2.4.1",
  personName: "Garvit Sukhija",
  role: "Product Manager",
  location: "Delhi / IST",
  hero: "I turn fuzzy product ideas into things people can use",
  email: "garvit.sukh@gmail.com",
  siteOrigin: null, // preview/local until a production domain is purchased
  resumePath: "/Garvit-Sukhija-Product-Resume.pdf",
};

/**
 * Derived product label (PRD §4): a computed export, not a second stored
 * string that can drift.
 */
export const productLabel = `${siteConfig.productName} v${siteConfig.version}`;
