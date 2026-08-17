/**
 * COMPATIBILITY SURFACE — shared signal bus only.
 *
 * The mascot rendering system (MascotExperience, SourcedMascotScene,
 * robot rig/poses, posters, capability policy) was retired in Task 9 /
 * Gate F after `src/features/world/**` passed its integration gates.
 * What remains here is the single shared signal bus (`signals.ts`) and
 * reaction semantics (`reaction-machine.ts`) that the board, flags,
 * journey, and world modules all publish/subscribe through. There is
 * intentionally no duplicate event bus in `src/features/world`.
 */
export {
  emitMascotSignal,
  subscribeMascotSignals,
  type MascotReaction,
  type MascotSignal,
} from "./signals";
export {
  advanceMascotState,
  createMascotState,
  receiveMascotSignal,
  type MascotReactionState,
  type QueuedMascotReaction,
} from "./reaction-machine";
