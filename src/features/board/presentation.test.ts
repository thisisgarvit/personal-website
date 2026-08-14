import { afterEach, describe, expect, it, vi } from "vitest";
import { interruptTicketSettle } from "./presentation";

class TestDOMMatrixReadOnly {
  a = 1;
  b = 0;
  m41 = 0;
  m42 = 0;

  constructor(transform: string) {
    const values = transform.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    [this.a, this.b, , , this.m41, this.m42] = values;
  }
}

describe("interruptTicketSettle", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("re-grabs from the DOMMatrix presentation value with live axis velocity", () => {
    vi.stubGlobal("DOMMatrixReadOnly", TestDOMMatrixReadOnly);
    const ticket = document.createElement("article");
    ticket.style.transform =
      "matrix(0.984807, 0.173648, -0.173648, 0.984807, 32, -8)";
    document.body.append(ticket);
    let stopped = false;

    const interrupted = interruptTicketSettle(ticket, {
      getVelocity: () => ({ x: 640, y: -120, rotation: 18 }),
      stop: () => {
        stopped = true;
      },
    });

    expect(interrupted.presentation.x).toBe(32);
    expect(interrupted.presentation.y).toBe(-8);
    expect(interrupted.presentation.rotation).toBeCloseTo(10, 3);
    expect(interrupted.velocity).toEqual({ x: 640, y: -120, rotation: 18 });
    expect(stopped).toBe(true);
    ticket.remove();
  });
});
