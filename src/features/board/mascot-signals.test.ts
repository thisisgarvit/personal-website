import { afterEach, describe, expect, it } from "vitest";
import {
  emitMascotSignal,
  subscribeMascotSignals,
  type MascotSignal,
} from "@/features/mascot/signals";

describe("MascotSignal contract", () => {
  afterEach(() => window.dispatchEvent(new Event("garvit:test-cleanup")));

  it("delivers the exact reaction, source, and timestamp to decorative consumers", () => {
    const received: MascotSignal[] = [];
    const unsubscribe = subscribeMascotSignals((signal) => received.push(signal));

    emitMascotSignal({
      reaction: "drag-watch",
      source: "maxie",
      timestamp: 1234,
    });

    expect(received).toEqual([
      { reaction: "drag-watch", source: "maxie", timestamp: 1234 },
    ]);
    unsubscribe();
  });
});
