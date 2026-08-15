import { ProductChrome } from "@/components/chrome/ProductChrome";
import { ExperimentStrip } from "@/components/experiment/ExperimentStrip";
import { Hero } from "@/components/hero/Hero";
import { OperationsRail } from "@/components/ops/OperationsRail";
import { InteractiveBoardSection } from "@/features/board";
import { SiteFooter } from "@/components/footer/SiteFooter";
import {
  JourneyObserver,
  SessionJourneySection,
} from "@/features/journey";
import styles from "./page.module.css";

/**
 * Homepage order (PRD §3): sticky product chrome → dismissible experiment
 * strip → spacious hero with two primary CTAs → session analyst + feature
 * flags → visitor-visible local funnel → sprint-board portfolio → compact
 * build/contact footer.
 */
export default function HomePage() {
  return (
    <>
      <JourneyObserver />
      <ProductChrome />
      <ExperimentStrip />
      <main className={styles.shell}>
        <div className={styles.heroGrid}>
          <Hero />
          <OperationsRail />
        </div>
        <SessionJourneySection />
        <InteractiveBoardSection />
      </main>
      <SiteFooter />
    </>
  );
}
