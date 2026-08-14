import { ProductChrome } from "@/components/chrome/ProductChrome";
import { ExperimentStrip } from "@/components/experiment/ExperimentStrip";
import { Hero } from "@/components/hero/Hero";
import { OperationsRail } from "@/components/ops/OperationsRail";
import { BoardSection } from "@/components/board/BoardSection";
import { SiteFooter } from "@/components/footer/SiteFooter";
import styles from "./page.module.css";

/**
 * Homepage order (PRD §3): sticky product chrome → dismissible experiment
 * strip → spacious hero with two primary CTAs → operations rail (on-call
 * PM + feature flags) → sprint-board portfolio → compact build/contact
 * footer. Nothing else is inserted into this order.
 */
export default function HomePage() {
  return (
    <>
      <ProductChrome />
      <ExperimentStrip />
      <main className={styles.shell}>
        <div className={styles.heroGrid}>
          <Hero />
          <OperationsRail />
        </div>
        <BoardSection />
      </main>
      <SiteFooter />
    </>
  );
}
