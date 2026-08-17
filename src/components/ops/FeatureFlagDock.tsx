"use client";

import { FeatureFlagsPanel } from "@/features/flags/FeatureFlagsPanel";
import styles from "./FeatureFlagDock.module.css";

export interface FeatureFlagDockProps {
  className?: string;
}

export function FeatureFlagDock({ className }: FeatureFlagDockProps) {
  return (
    <aside
      className={`${styles.root}${className ? ` ${className}` : ""}`}
      aria-label="Feature flag dock"
      data-world-dock
    >
      <FeatureFlagsPanel variant="dock" />
    </aside>
  );
}
