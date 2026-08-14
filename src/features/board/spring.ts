"use client";

import { animate, motionValue } from "motion";
import { springFromResponse, type Velocity2D } from "./physics";
import type { TicketSettleHandle } from "./presentation";

const SETTLE_SPRING = springFromResponse(0.36, 1);
const FLICK_SPRING = springFromResponse(0.42, 0.82);

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

  const x = motionValue(from.x);
  const y = motionValue(from.y);
  const rotation = motionValue(from.rotation);
  const scale = motionValue(1.015);
  const render = () =>
    applyTicketTransform(
      element,
      x.get(),
      y.get(),
      rotation.get(),
      scale.get(),
    );
  const unsubscribers = [
    x.on("change", render),
    y.on("change", render),
    rotation.on("change", render),
    scale.on("change", render),
  ];

  element.dataset.settle = "spring";
  element.style.willChange = "transform";
  render();

  const xAnimation = animate(x, 0, {
    type: "spring",
    ...SETTLE_SPRING,
    velocity: velocity.x,
    restDelta: 0.35,
    restSpeed: 8,
  });
  const yAnimation = animate(y, 0, {
    type: "spring",
    ...SETTLE_SPRING,
    velocity: velocity.y,
    restDelta: 0.35,
    restSpeed: 8,
  });
  const scaleAnimation = animate(scale, 1, {
    type: "spring",
    ...SETTLE_SPRING,
    restDelta: 0.001,
    restSpeed: 0.01,
  });
  const rotationAnimation = animate(rotation, 0, {
    type: "spring",
    ...(Math.abs(from.rotation) > 0.1 ? FLICK_SPRING : SETTLE_SPRING),
    velocity: velocity.x / 180,
    restDelta: 0.02,
    restSpeed: 0.2,
  });
  const controls = [
    xAnimation,
    yAnimation,
    scaleAnimation,
    rotationAnimation,
  ];

  const finish = () => {
    if (stopped) return;
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    delete element.dataset.settle;
    element.style.removeProperty("will-change");
    element.style.removeProperty("transform");
    onComplete();
  };
  Promise.all(controls).then(finish);

  return {
    getVelocity: () => ({
      x: x.getVelocity(),
      y: y.getVelocity(),
      rotation: rotation.getVelocity(),
    }),
    stop: () => {
      stopped = true;
      controls.forEach((control) => control.stop());
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    },
  };
}
