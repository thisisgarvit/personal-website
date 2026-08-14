import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/data/site";
import { THEME_STORAGE_KEY } from "@/data/storage";
import { Toaster } from "@/components/toast/Toaster";
import "./globals.css";

/**
 * Self-hosted subset fonts (PRD §14), extracted from the approved
 * slice-product.html. Archivo is a variable weight axis 400–800;
 * IBM Plex Mono ships 400/500/600 static weights.
 */
const archivo = localFont({
  src: "../fonts/Archivo-400-800.woff2",
  weight: "400 800",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
});

const plexMono = localFont({
  src: [
    { path: "../fonts/IBMPlexMono-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/IBMPlexMono-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/IBMPlexMono-600.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.personName} — ${siteConfig.role}`,
    template: `%s · ${siteConfig.productName}`,
  },
  description: `${siteConfig.hero}. Product work, concepts, and teardowns from Delhi.`,
};

/**
 * Theme bootstrap (PRD §11: theme bootstrapping cannot create a flash or
 * hydration warning; DESIGN.md §6: user override persists locally and
 * wins over the OS preference). Runs synchronously before first paint of
 * the page content. The <html> element carries suppressHydrationWarning
 * because this script legitimately sets data-theme before React hydrates.
 */
const themeBootstrap = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
