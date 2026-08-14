import { siteConfig } from "@/data/site";

export default function HomePage() {
  return (
    <main>
      <h1>{siteConfig.hero}</h1>
      <p>
        {siteConfig.personName} — {siteConfig.role}, {siteConfig.location}.
        Product shell, chrome, and sprint board arrive in later tasks.
      </p>
    </main>
  );
}
