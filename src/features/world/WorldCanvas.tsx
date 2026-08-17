"use client";

import { Canvas } from "@react-three/fiber";
import { scroll } from "motion";
import { Suspense, useEffect } from "react";
import { GuideScene } from "./GuideScene";
import type { WorldDirector } from "./types";

export interface WorldCanvasProps {
  director: WorldDirector;
  playing: boolean;
  onFirstFrame(): void;
  onRendererFailure(): void;
}

export function WorldCanvas({
  director,
  playing,
  onFirstFrame,
  onRendererFailure,
}: WorldCanvasProps) {
  useEffect(
    () =>
      scroll(() => {
        director.measure();
      }),
    [director],
  );

  return (
    <Canvas
      data-world-canvas
      aria-hidden="true"
      frameloop="demand"
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.3, 6.3], fov: 35, near: 0.1, far: 60 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      shadows
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener(
          "webglcontextlost",
          onRendererFailure,
          { once: true },
        );
      }}
    >
      <Suspense fallback={null}>
        <GuideScene
          director={director}
          playing={playing}
          onFirstFrame={onFirstFrame}
        />
      </Suspense>
    </Canvas>
  );
}
