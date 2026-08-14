export interface TicketSettleHandle {
  getVelocity: () => { x: number; y: number; rotation: number };
  stop: () => void;
}

export interface PresentationTransform {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export function readPresentationTransform(
  element: HTMLElement,
): PresentationTransform {
  const transform = getComputedStyle(element).transform;
  if (!transform || transform === "none") {
    return { x: 0, y: 0, rotation: 0, scale: 1 };
  }

  // DOMMatrix is required here rather than parsing our authored transform:
  // computed style is the browser's live presentation value mid-spring.
  const Matrix = globalThis.DOMMatrixReadOnly ?? globalThis.DOMMatrix;
  const matrix = new Matrix(transform);
  return {
    x: matrix.m41,
    y: matrix.m42,
    rotation: (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI,
    scale: Math.hypot(matrix.a, matrix.b),
  };
}

export function interruptTicketSettle(
  element: HTMLElement,
  settle?: TicketSettleHandle,
) {
  const presentation = readPresentationTransform(element);
  const velocity = settle?.getVelocity() ?? { x: 0, y: 0, rotation: 0 };
  settle?.stop();
  return { presentation, velocity };
}
