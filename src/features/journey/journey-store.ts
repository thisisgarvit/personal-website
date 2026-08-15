import { JOURNEY_STORAGE_KEY } from "@/data/storage";
import type { WorkSlug } from "@/data/work";
import { emitMascotSignal } from "@/features/mascot/signals";

export const journeyStages = [
  "landed",
  "scrolled",
  "played",
  "read-work",
  "converted",
] as const;

export type JourneyStage = (typeof journeyStages)[number];
export type JourneyConversion = "resume" | "contact";
export type JourneyPlayKind =
  | "flag"
  | "dark_mode"
  | "drag"
  | "keyboard-move"
  | "popover"
  | "board-incident";

export type JourneyEvent =
  | { type: "scrolled" }
  | { type: "played"; kind: JourneyPlayKind }
  | { type: "read-work"; slug: WorkSlug }
  | { type: "converted"; target: JourneyConversion };

export type StoredJourneyEvent =
  | { type: "landed"; at: number }
  | { type: "scrolled"; at: number }
  | { type: "played"; at: number; kind: JourneyPlayKind }
  | { type: "read-work"; at: number; slug: WorkSlug }
  | { type: "converted"; at: number; target: JourneyConversion };

export interface JourneyState {
  events: readonly StoredJourneyEvent[];
  startedAt: number | null;
  reached: Record<JourneyStage, boolean>;
  interactions: number;
  darkModeToggles: number;
  workReads: number;
  boardDemotions: number;
  conversion: JourneyConversion | null;
  lastEvent: JourneyStage;
}

const makeInitialState = (): JourneyState => ({
  events: [],
  startedAt: null,
  reached: {
    landed: true,
    scrolled: false,
    played: false,
    "read-work": false,
    converted: false,
  },
  interactions: 0,
  darkModeToggles: 0,
  workReads: 0,
  boardDemotions: 0,
  conversion: null,
  lastEvent: "landed",
});

const listeners = new Set<() => void>();
const SERVER_SNAPSHOT = makeInitialState();
let state = makeInitialState();

function isStoredEvent(value: unknown): value is StoredJourneyEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Record<string, unknown>;
  if (
    typeof event.at !== "number" ||
    !journeyStages.includes(event.type as JourneyStage)
  ) {
    return false;
  }
  if (event.type === "played") {
    return [
      "flag",
      "dark_mode",
      "drag",
      "keyboard-move",
      "popover",
      "board-incident",
    ].includes(String(event.kind));
  }
  if (event.type === "read-work") {
    return [
      "stay-portal",
      "maxie",
      "agentic-calendar",
      "dynamic-island",
    ].includes(String(event.slug));
  }
  if (event.type === "converted") {
    return event.target === "resume" || event.target === "contact";
  }
  return true;
}

function deriveState(events: readonly StoredJourneyEvent[]): JourneyState {
  const reached: Record<JourneyStage, boolean> = {
    landed: true,
    scrolled: false,
    played: false,
    "read-work": false,
    converted: false,
  };
  let darkModeToggles = 0;
  let workReads = 0;
  let boardDemotions = 0;
  let conversion: JourneyConversion | null = null;
  let lastEvent: JourneyStage = "landed";

  for (const event of events) {
    reached[event.type] = true;
    lastEvent = event.type;
    if (event.type === "played" && event.kind === "dark_mode") {
      darkModeToggles += 1;
    }
    if (event.type === "played" && event.kind === "board-incident") {
      boardDemotions += 1;
    }
    if (event.type === "read-work") workReads += 1;
    if (event.type === "converted") conversion = event.target;
  }

  return {
    events,
    startedAt: events[0]?.at ?? null,
    reached,
    interactions: events.filter(
      (event) =>
        event.type === "played" ||
        event.type === "read-work" ||
        event.type === "converted",
    ).length,
    darkModeToggles,
    workReads,
    boardDemotions,
    conversion,
    lastEvent,
  };
}

function readStoredEvents(): StoredJourneyEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(
      sessionStorage.getItem(JOURNEY_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(parsed) ? parsed.filter(isStoredEvent).slice(-80) : [];
  } catch {
    return [];
  }
}

function persist(events: readonly StoredJourneyEvent[]): void {
  try {
    sessionStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // The same in-tab memory snapshot still powers the visible experience.
  }
}

function publish(events: readonly StoredJourneyEvent[]): void {
  state = deriveState(events);
  persist(events);
  listeners.forEach((listener) => listener());
}

export function getJourneySnapshot(): JourneyState {
  return state;
}

export function getJourneyServerSnapshot(): JourneyState {
  return SERVER_SNAPSHOT;
}

export function subscribeJourney(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function startJourney(now = Date.now()): void {
  if (state.startedAt !== null) return;
  const stored = readStoredEvents();
  if (stored.length > 0) {
    state = deriveState(stored);
    listeners.forEach((listener) => listener());
    return;
  }
  publish([{ type: "landed", at: now }]);
}

function milestoneSignal(stage: Exclude<JourneyStage, "landed">): void {
  emitMascotSignal({
    reaction: stage === "converted" ? "shipped" : "milestone",
    source: `journey:${stage}`,
    timestamp: Date.now(),
  });
}

export function recordJourneyEvent(event: JourneyEvent): void {
  startJourney();
  const stage: Exclude<JourneyStage, "landed"> =
    event.type === "read-work" ? "read-work" : event.type;
  if (stage === "scrolled" && state.reached.scrolled) return;
  const firstReach = !state.reached[stage];
  const stored = { ...event, at: Date.now() } as StoredJourneyEvent;
  publish([...state.events, stored].slice(-80));
  if (firstReach) milestoneSignal(stage);
}

export function furthestJourneyStage(current: JourneyState): JourneyStage {
  return [...journeyStages].reverse().find((stage) => current.reached[stage])!;
}

export function nextJourneyStage(current: JourneyState): JourneyStage | null {
  return journeyStages.find((stage) => !current.reached[stage]) ?? null;
}

export function deriveJourneyInsights(current: JourneyState): string[] {
  const insights: string[] = [];
  if (current.darkModeToggles === 2) {
    insights.push("You toggled dark mode twice. Decisive.");
  } else if (current.darkModeToggles > 2) {
    insights.push(
      `Dark mode changed ${current.darkModeToggles} times. Still calibrating.`,
    );
  }
  if (current.boardDemotions > 0) {
    insights.push("Shipped work was demoted. Churn risk: self-inflicted.");
  }
  if (current.conversion === "resume") {
    insights.push("Resume downloaded. A conversion, but make it useful.");
  } else if (current.conversion === "contact") {
    insights.push("You chose the direct route. Garvit approves.");
  } else if (current.workReads > 0) {
    insights.push(
      `${current.workReads} case ${current.workReads === 1 ? "preview" : "previews"} opened. Evidence over adjectives.`,
    );
  } else if (current.reached.played) {
    insights.push("You tested the product before reading the pitch. Fair.");
  }
  if (insights.length === 0) {
    insights.push("Session started. The analyst is trying not to overreact.");
  }
  return insights.slice(0, 2);
}

export function resetJourneyForTests(): void {
  state = makeInitialState();
  try {
    sessionStorage.removeItem(JOURNEY_STORAGE_KEY);
  } catch {
    // Tests without a DOM still reset the tab-local source.
  }
}
