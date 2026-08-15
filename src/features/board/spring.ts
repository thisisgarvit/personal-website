"use client";

import { springFromResponse, type Velocity2D } from "./physics";
import type { TicketSettleHandle } from "./presentation";

const SETTLE_SPRING = springFromResponse(0.36, 1);
const FLICK_SPRING = springFromResponse(0.42, 0.82);

export interface SpringState {
  position: number;
  velocity: number;
}

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

/** Semi-implicit Euler step; stable for the bounded 120Hz substeps below. */
export function stepSpring(
  state: SpringState,
  target: number,
  config: SpringConfig,
  deltaSeconds: number,
): SpringState {
  const displacement = state.position - target;
  const acceleration =
    (-config.stiffness * displacement - config.damping * state.velocity) /
    config.mass;
  const velocity = state.velocity + acceleration * deltaSeconds;
  return {
    position: state.position + velocity * deltaSeconds,
    velocity,
  };
}

function isAtRest(
  state: SpringState,
  target: number,
  restDelta: number,
  restSpeed: number,
): boolean {
  return (
    Math.abs(state.position - target) <= restDelta &&
    Math.abs(state.velocity) <= restSpeed
  );
}

interface TicketSettleOptions {
  element: HTMLElement;
  from: { x: number; y: number; rotation: number };
  velocity: Velocity2D;
  reducedMotion: boolean;
  onComplete: () => void;
}

export function applyTicketTransform(
  element: HTMLElement,
  x: number,
  y: number,
  rotation: number,
  scale: number,
): void {
  element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;
}

export function startTicketSettle({
  element,
  from,
  velocity,
  reducedMotion,
  onComplete,
}: TicketSettleOptions): TicketSettleHandle {
  let stopped = false;

  if (reducedMotion) {
    element.dataset.settle = "reduced";
    element.style.opacity = "0.58";
    applyTicketTransform(element, 0, 0, 0, 1);
    const frame = requestAnimationFrame(() => {
      element.style.opacity = "1";
    });
    const timer = window.setTimeout(() => {
      if (stopped) return;
      delete element.dataset.settle;
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
      onComplete();
    }, 160);

    return {
      getVelocity: () => ({ x: 0, y: 0, rotation: 0 }),
      stop: () => {
        stopped = true;
        cancelAnimationFrame(frame);
        clearTimeout(timer);
      },
    };
  }

  let x: SpringState = { position: from.x, velocity: velocity.x };
  let y: SpringState = { position: from.y, velocity: velocity.y };
  let rotation: SpringState = {
    position: from.rotation,
    velocity: velocity.x / 180,
  };
  let scale: SpringState = { position: 1.015, velocity: 0 };
  const rotationSpring =
    Math.abs(from.rotation) > 0.1 ? FLICK_SPRING : SETTLE_SPRING;
  const render = () =>
    applyTicketTransform(
      element,
      x.position,
      y.position,
      rotation.position,
      scale.position,
    );

  element.dataset.settle = "spring";
  element.style.willChange = "transform";
  render();

  let frame = 0;
  let previousTime: number | null = null;
  const finish = () => {
    if (stopped) return;
    stopped = true;
    x = { position: 0, velocity: 0 };
    y = { position: 0, velocity: 0 };
    rotation = { position: 0, velocity: 0 };
    scale = { position: 1, velocity: 0 };
    render();
    delete element.dataset.settle;
    element.style.removeProperty("will-change");
    element.style.removeProperty("transform");
    onComplete();
  };

  const tick = (time: number) => {
    if (stopped) return;
    const elapsed =
      previousTime === null
        ? 1 / 60
        : Math.min(1 / 30, Math.max(1 / 240, (time - previousTime) / 1000));
    previousTime = time;
    const substeps = Math.max(1, Math.ceil(elapsed / (1 / 120)));
    const delta = elapsed / substeps;
    for (let step = 0; step < substeps; step += 1) {
      x = stepSpring(x, 0, SETTLE_SPRING, delta);
      y = stepSpring(y, 0, SETTLE_SPRING, delta);
      rotation = stepSpring(rotation, 0, rotationSpring, delta);
      scale = stepSpring(scale, 1, SETTLE_SPRING, delta);
    }
    render();

    if (
      isAtRest(x, 0, 0.35, 8) &&
      isAtRest(y, 0, 0.35, 8) &&
      isAtRest(rotation, 0, 0.02, 0.2) &&
      isAtRest(scale, 1, 0.001, 0.01)
    ) {
      finish();
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return {
    getVelocity: () => ({
      x: x.velocity,
      y: y.velocity,
      rotation: rotation.velocity,
    }),
    stop: () => {
      stopped = true;
      cancelAnimationFrame(frame);
    },
  };
}
