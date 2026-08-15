import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/**
 * Conservative security headers (PRD §12): content-type sniffing off,
 * strict referrer, and unused powerful permissions disabled.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Isolated build output for QA harnesses (Task 9): the E2E/budget gate
  // can build into its own dist dir so a concurrently running dev server
  // or build in another work lane cannot invalidate the chunks under
  // test. Defaults to `.next` — production/Vercel behavior is unchanged.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

// Local MDX content only (PRD §14) — no remote content, no remark/rehype
// plugins until a task needs them.
const withMDX = createMDX({});

export default withMDX(nextConfig);
