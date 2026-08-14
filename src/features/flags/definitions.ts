export type FeatureFlagKey =
  | "dark_mode"
  | "confetti_on_scroll"
  | "candid_mode"
  | "comic_sans";

export interface FeatureFlagDefinition {
  key: FeatureFlagKey;
  descriptor: string;
  defaultValue: boolean | "system";
  persistence: "local" | "session" | "none";
  disabled: boolean;
  accessibleLabel: string;
}

export const featureFlagDefinitions: readonly FeatureFlagDefinition[] = [
  {
    key: "dark_mode",
    descriptor: "theme",
    defaultValue: "system",
    persistence: "local",
    disabled: false,
    accessibleLabel: "Toggle dark mode",
  },
  {
    key: "confetti_on_scroll",
    descriptor: "ship signal",
    defaultValue: true,
    persistence: "session",
    disabled: false,
    accessibleLabel: "Toggle confetti while scrolling",
  },
  {
    key: "candid_mode",
    descriptor: "field notes",
    defaultValue: true,
    persistence: "session",
    disabled: false,
    accessibleLabel: "Toggle candid ticket annotations",
  },
  {
    key: "comic_sans",
    descriptor: "prod locked",
    defaultValue: false,
    persistence: "none",
    disabled: true,
    accessibleLabel: "Comic Sans disabled",
  },
] as const;

export type FeatureFlagState = Record<FeatureFlagKey, boolean>;

export const authoredFlagState: FeatureFlagState = {
  dark_mode: false,
  confetti_on_scroll: true,
  candid_mode: true,
  comic_sans: false,
};
