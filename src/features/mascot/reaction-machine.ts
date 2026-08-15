import type { MascotReaction, MascotSignal } from "./signals";

const ACTIVE_MS: Readonly<Partial<Record<MascotReaction, number>>> = {
  notice: 900,
  "flag-check": 1000,
  shipped: 1400,
};

const PRIORITY: Readonly<Record<MascotReaction, number>> = {
  idle: 0,
  notice: 1,
  "flag-check": 2,
  shipped: 3,
  "drag-watch": 4,
};

export interface QueuedMascotReaction {
  reaction: Exclude<MascotReaction, "idle" | "drag-watch">;
  source: MascotSignal["source"];
  expiresAt: number;
}

export interface MascotReactionState {
  reaction: MascotReaction;
  source: MascotSignal["source"];
  expiresAt: number | null;
  queued: QueuedMascotReaction | null;
}

export function createMascotState(): MascotReactionState {
  return {
    reaction: "idle",
    source: "release",
    expiresAt: null,
    queued: null,
  };
}

function timedReaction(
  signal: MascotSignal,
): QueuedMascotReaction | null {
  if (signal.reaction === "idle" || signal.reaction === "drag-watch") {
    return null;
  }
  return {
    reaction: signal.reaction,
    source: signal.source,
    expiresAt: signal.timestamp + ACTIVE_MS[signal.reaction]!,
  };
}

function isLive(
  reaction: QueuedMascotReaction | null,
  now: number,
): reaction is QueuedMascotReaction {
  return reaction !== null && reaction.expiresAt > now;
}

function idleState(source: MascotSignal["source"]): MascotReactionState {
  return { reaction: "idle", source, expiresAt: null, queued: null };
}

export function advanceMascotState(
  state: MascotReactionState,
  now: number,
): MascotReactionState {
  const queued = isLive(state.queued, now) ? state.queued : null;
  if (
    state.reaction !== "idle" &&
    state.reaction !== "drag-watch" &&
    state.expiresAt !== null &&
    state.expiresAt <= now
  ) {
    return idleState(state.source);
  }
  return queued === state.queued ? state : { ...state, queued };
}

/**
 * Applies PRD §9 arbitration. Drag-watch is direct manipulation and owns the
 * rig until its matching idle/release signal; timed reactions continue to age
 * while queued, so a stale hover never fires after a long drag.
 */
export function receiveMascotSignal(
  current: MascotReactionState,
  signal: MascotSignal,
  now: number,
): MascotReactionState {
  const state = advanceMascotState(current, now);

  if (signal.reaction === "drag-watch") {
    const active =
      state.reaction !== "idle" && state.reaction !== "drag-watch"
        ? {
            reaction: state.reaction,
            source: state.source,
            expiresAt: state.expiresAt!,
          }
        : state.queued;
    return {
      reaction: "drag-watch",
      source: signal.source,
      expiresAt: null,
      queued: isLive(active, now) ? active : null,
    };
  }

  if (state.reaction === "drag-watch") {
    if (signal.reaction === "idle") {
      return isLive(state.queued, now)
        ? {
            reaction: state.queued.reaction,
            source: state.queued.source,
            expiresAt: state.queued.expiresAt,
            queued: null,
          }
        : idleState(signal.source);
    }

    const incoming = timedReaction(signal);
    if (!isLive(incoming, now)) return state;
    if (
      !isLive(state.queued, now) ||
      PRIORITY[incoming.reaction] >= PRIORITY[state.queued.reaction]
    ) {
      return { ...state, queued: incoming };
    }
    return state;
  }

  if (signal.reaction === "idle") {
    return state;
  }

  const incoming = timedReaction(signal);
  if (!isLive(incoming, now)) return state;
  if (PRIORITY[incoming.reaction] < PRIORITY[state.reaction]) return state;

  return {
    reaction: incoming.reaction,
    source: incoming.source,
    expiresAt: incoming.expiresAt,
    queued: null,
  };
}
