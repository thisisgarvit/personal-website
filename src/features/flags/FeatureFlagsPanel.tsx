"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import opsStyles from "@/components/ops/ops.module.css";
import { ConfettiScrollEffects } from "./ConfettiScrollEffects";
import {
  featureFlagDefinitions,
  type FeatureFlagDefinition,
} from "./definitions";
import { useEffectSuppression } from "./effects-policy";
import styles from "./flags.module.css";
import { useFeatureFlags } from "./useFeatureFlags";

const suppressionLabels = {
  "reduced-motion": "animation held: reduced motion",
  "save-data": "animation held: save-data",
  "document-hidden": "animation held while this tab is hidden",
  "performance-kill": "animation held: performance safeguard",
} as const;

interface FlagRowProps {
  definition: FeatureFlagDefinition;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  describedBy?: string;
}

function FlagRow({
  definition,
  checked,
  onCheckedChange,
  describedBy,
}: FlagRowProps) {
  const control = (
    <label className={opsStyles.switch}>
      <input
        type="checkbox"
        checked={checked}
        disabled={definition.disabled}
        aria-describedby={describedBy}
        onChange={(event) => onCheckedChange(event.currentTarget.checked)}
      />
      <span className={opsStyles.switchTrack} aria-hidden="true" />
      <span className="sr-only">{definition.accessibleLabel}</span>
    </label>
  );

  return (
    <div className={opsStyles.flagRow}>
      <span className={opsStyles.flagName}>
        <code>{definition.key}</code>
        <small>{definition.descriptor}</small>
      </span>
      {definition.disabled ? (
        <Tooltip.Root>
          <Tooltip.Trigger asChild>{control}</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={opsStyles.tooltip} sideOffset={6}>
              disabled in prod for a reason
              <Tooltip.Arrow className={opsStyles.tooltipArrow} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      ) : (
        control
      )}
    </div>
  );
}

export function FeatureFlagsPanel() {
  const { flags, setFlag } = useFeatureFlags();
  const confettiSuppression = useEffectSuppression(
    flags.confetti_on_scroll,
  );
  const visibleSuppression =
    confettiSuppression && confettiSuppression !== "flag-disabled"
      ? confettiSuppression
      : null;

  return (
    <Tooltip.Provider delayDuration={200}>
      <section className={opsStyles.panel} aria-labelledby="flags-title">
        <header className={opsStyles.panelTitle}>
          <span id="flags-title">Feature flags</span>
          <span className={opsStyles.flagCount}>3 / 4 live</span>
        </header>
        <div className={opsStyles.flagsBody}>
          {featureFlagDefinitions.map((definition) => (
            <FlagRow
              key={definition.key}
              definition={definition}
              checked={flags[definition.key]}
              onCheckedChange={(next) => setFlag(definition.key, next)}
              describedBy={
                definition.key === "confetti_on_scroll" && visibleSuppression
                  ? "confetti-suppression"
                  : undefined
              }
            />
          ))}
        </div>
        {visibleSuppression ? (
          <p id="confetti-suppression" className={styles.effectNote}>
            {suppressionLabels[visibleSuppression]}
          </p>
        ) : null}
      </section>
      <ConfettiScrollEffects suppression={confettiSuppression} />
    </Tooltip.Provider>
  );
}
