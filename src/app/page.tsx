import { ProductChrome } from "@/components/chrome/ProductChrome";
import { ExperimentStrip } from "@/components/experiment/ExperimentStrip";
import { Hero } from "@/components/hero/Hero";
import { FeatureFlagDock } from "@/components/ops/FeatureFlagDock";
import { InteractiveBoardSection } from "@/features/board";
import { SiteFooter } from "@/components/footer/SiteFooter";
import {
  JourneyObserver,
  SessionJourneySection,
} from "@/features/journey";
import { ExperienceWorld, WorldAnchor, WorldProvider } from "@/features/world";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <JourneyObserver />
      <ProductChrome />
      <ExperimentStrip />
      <WorldProvider>
        <ExperienceWorld />
        <main className={styles.shell}>
          <WorldAnchor id="hero" as="div" className={styles.heroAnchor}>
            <Hero />
            <FeatureFlagDock className={styles.dock} />
          </WorldAnchor>
          <WorldAnchor id="board" as="div" className={styles.boardAnchor}>
            <InteractiveBoardSection />
          </WorldAnchor>
          <WorldAnchor id="journey" as="div" className={styles.journeyAnchor}>
            <SessionJourneySection />
          </WorldAnchor>
        </main>
      </WorldProvider>
      <SiteFooter />
    </>
  );
}
