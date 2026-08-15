"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  MeshStandardMaterial,
  type Group,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { MascotReaction } from "./signals";
import {
  reactionPose,
  splitLookTarget,
  stepSpring,
  type SpringState,
} from "./rig";

export interface MascotPalette {
  ink: string;
  release: string;
  incident: string;
  merge: string;
  panel: string;
}

interface ProceduralMascotSceneProps {
  reaction: MascotReaction;
  playing: boolean;
  palette: MascotPalette;
  onFirstFrame(): void;
  onRendererFailure(): void;
}

type Joint =
  | "torsoYaw"
  | "torsoLean"
  | "headYaw"
  | "headPitch"
  | "headTilt"
  | "pupilX"
  | "pupilY"
  | "leftArmZ"
  | "rightArmZ"
  | "pagerScale";

const JOINTS: Record<Joint, SpringState> = {
  torsoYaw: { value: 0, velocity: 0 },
  torsoLean: { value: 0, velocity: 0 },
  headYaw: { value: 0, velocity: 0 },
  headPitch: { value: 0, velocity: 0 },
  headTilt: { value: 0, velocity: 0 },
  pupilX: { value: 0, velocity: 0 },
  pupilY: { value: 0, velocity: 0 },
  leftArmZ: { value: 0.18, velocity: 0 },
  rightArmZ: { value: -0.18, velocity: 0 },
  pagerScale: { value: 1, velocity: 0 },
};

function makeMaterial(color: string): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color,
    roughness: 0.92,
    metalness: 0,
  });
}

function RoundedPrimitive({
  args,
  radius,
  smoothness,
  position,
  rotation,
  material,
}: {
  args: [number, number, number];
  radius: number;
  smoothness: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  material: MeshStandardMaterial;
}) {
  const [width, height, depth] = args;
  const geometry = useMemo(
    () =>
      new RoundedBoxGeometry(
        width,
        height,
        depth,
        smoothness,
        radius,
      ),
    [depth, height, radius, smoothness, width],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      material={material}
    />
  );
}

function ProceduralFigure({
  palette,
  reaction,
}: {
  palette: MascotPalette;
  reaction: MascotReaction;
}) {
  "use no memo";

  const root = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const head = useRef<Group>(null);
  const eyeRig = useRef<Group>(null);
  const pupils = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const pager = useRef<Group>(null);
  const look = useRef({ x: 0.12, y: 0.02 });
  const joints = useRef<Record<Joint, SpringState>>(
    Object.fromEntries(
      Object.entries(JOINTS).map(([key, value]) => [key, { ...value }]),
    ) as Record<Joint, SpringState>,
  );
  const nextBlink = useRef(3.8);
  const blinkUntil = useRef(0);

  const materials = useMemo(
    () => ({
      ink: makeMaterial(palette.ink),
      release: makeMaterial(palette.release),
      incident: makeMaterial(palette.incident),
      merge: makeMaterial(palette.merge),
      panel: makeMaterial(palette.panel),
    }),
    [palette],
  );

  useEffect(
    () => () => {
      Object.values(materials).forEach((material) => material.dispose());
    },
    [materials],
  );

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;
      look.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("pointermove", update, { passive: true });
    return () => window.removeEventListener("pointermove", update);
  }, []);

  useFrame(({ clock }, delta) => {
    if (
      !root.current ||
      !torso.current ||
      !head.current ||
      !eyeRig.current ||
      !pupils.current ||
      !leftArm.current ||
      !rightArm.current ||
      !pager.current
    ) {
      return;
    }

    const lookPose = splitLookTarget(look.current);
    const authored = reactionPose(reaction);
    const updateJoint = (joint: Joint, target: number) => {
      const next = stepSpring(joints.current[joint], target, delta);
      joints.current[joint] = next;
      return next.value;
    };

    torso.current.rotation.y = updateJoint("torsoYaw", lookPose.torsoYaw);
    torso.current.rotation.z = updateJoint("torsoLean", authored.torsoLean);
    head.current.rotation.y = updateJoint("headYaw", lookPose.headYaw);
    head.current.rotation.x = updateJoint("headPitch", lookPose.headPitch);
    head.current.rotation.z = updateJoint("headTilt", authored.headTilt);
    pupils.current.position.x = updateJoint("pupilX", lookPose.pupilX);
    pupils.current.position.y = updateJoint("pupilY", lookPose.pupilY);
    leftArm.current.rotation.z = updateJoint(
      "leftArmZ",
      authored.leftArmZ,
    );
    rightArm.current.rotation.z = updateJoint(
      "rightArmZ",
      authored.rightArmZ,
    );
    const pagerScale = updateJoint("pagerScale", authored.pagerScale);
    pager.current.scale.setScalar(pagerScale);

    const elapsed = clock.elapsedTime;
    if (elapsed >= nextBlink.current) {
      blinkUntil.current = elapsed + 0.11;
      nextBlink.current = elapsed + 2.6 + Math.random() * 2.6;
    }
    eyeRig.current.scale.y = elapsed < blinkUntil.current ? 0.08 : 1;
  });

  return (
    <group
      ref={root}
      position={[0, -0.98, 0]}
      rotation={[0, -0.2, 0]}
      scale={[1.5, 1.3, 1.3]}
    >
      <group ref={torso}>
        <RoundedPrimitive
          args={[1.22, 1.25, 0.7]}
          radius={0.19}
          smoothness={4}
          position={[0, 0.12, 0]}
          material={materials.release}
        />
        <mesh position={[0, 0.92, 0]} material={materials.ink}>
          <cylinderGeometry args={[0.18, 0.22, 0.32, 16]} />
        </mesh>

        <group ref={leftArm} position={[-0.68, 0.54, 0]}>
          <mesh position={[0, -0.43, 0]} material={materials.ink}>
            <capsuleGeometry args={[0.13, 0.62, 6, 12]} />
          </mesh>
          <mesh position={[0, -0.88, 0]} material={materials.ink}>
            <sphereGeometry args={[0.15, 14, 10]} />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.68, 0.54, 0]}>
          <mesh position={[0, -0.43, 0]} material={materials.ink}>
            <capsuleGeometry args={[0.13, 0.62, 6, 12]} />
          </mesh>
          <mesh position={[0, -0.88, 0]} material={materials.ink}>
            <sphereGeometry args={[0.15, 14, 10]} />
          </mesh>
        </group>

        <group ref={pager} position={[0.37, 0.3, 0.43]} rotation={[0, 0, 0.08]}>
          <RoundedPrimitive
            args={[0.44, 0.36, 0.12]}
            radius={0.055}
            smoothness={3}
            material={materials.incident}
          />
          <mesh position={[-0.07, 0.035, 0.075]} material={materials.ink}>
            <boxGeometry args={[0.19, 0.09, 0.035]} />
          </mesh>
          <mesh position={[0.14, 0.04, 0.084]} material={materials.merge}>
            <sphereGeometry args={[0.045, 12, 8]} />
          </mesh>
        </group>
      </group>

      <group ref={head} position={[0, 1.42, 0]}>
        <mesh scale={[0.78, 0.71, 0.72]} material={materials.ink}>
          <sphereGeometry args={[0.72, 28, 20]} />
        </mesh>
        <group ref={eyeRig} position={[0, 0.02, 0.53]}>
          <mesh position={[-0.23, 0, 0]} material={materials.panel}>
            <sphereGeometry args={[0.15, 16, 12]} />
          </mesh>
          <mesh position={[0.23, 0, 0]} material={materials.panel}>
            <sphereGeometry args={[0.15, 16, 12]} />
          </mesh>
          <group ref={pupils} position={[0, 0, 0.13]}>
            <mesh position={[-0.23, 0, 0]} material={materials.release}>
              <sphereGeometry args={[0.065, 12, 8]} />
            </mesh>
            <mesh position={[0.23, 0, 0]} material={materials.release}>
              <sphereGeometry args={[0.065, 12, 8]} />
            </mesh>
          </group>
        </group>
        <mesh
          position={[0, -0.22, 0.62]}
          rotation={[0, 0, 0.14]}
          material={materials.panel}
        >
          <torusGeometry args={[0.17, 0.018, 8, 22, Math.PI * 0.9]} />
        </mesh>
        <mesh
          position={[0, 0.08, 0]}
          rotation={[0, 0, 0.06]}
          material={materials.incident}
        >
          <torusGeometry args={[0.57, 0.045, 8, 28, Math.PI]} />
        </mesh>
        <mesh position={[0.57, -0.02, 0.05]} material={materials.incident}>
          <boxGeometry args={[0.12, 0.3, 0.22]} />
        </mesh>
        <mesh
          position={[0.69, -0.25, 0.26]}
          rotation={[0, 0, 0.72]}
          material={materials.incident}
        >
          <cylinderGeometry args={[0.025, 0.025, 0.48, 10]} />
        </mesh>
      </group>
    </group>
  );
}

function RendererControl({
  playing,
  onFirstFrame,
  onRendererFailure,
}: Pick<
  ProceduralMascotSceneProps,
  "playing" | "onFirstFrame" | "onRendererFailure"
>) {
  const { gl, invalidate } = useThree();
  const committed = useRef(false);

  useEffect(() => {
    if (playing) invalidate();
  }, [invalidate, playing]);

  useEffect(() => {
    const canvas = gl.domElement;
    const contextLost = (event: Event) => {
      event.preventDefault();
      onRendererFailure();
    };
    canvas.addEventListener("webglcontextlost", contextLost);
    return () => canvas.removeEventListener("webglcontextlost", contextLost);
  }, [gl, onRendererFailure]);

  useFrame((state) => {
    try {
      state.gl.render(state.scene, state.camera);
      if (!committed.current) {
        committed.current = true;
        onFirstFrame();
      }
    } catch {
      onRendererFailure();
    }
  }, 1);

  return null;
}

export function ProceduralMascotScene({
  reaction,
  playing,
  palette,
  onFirstFrame,
  onRendererFailure,
}: ProceduralMascotSceneProps) {
  "use no memo";

  return (
    <Canvas
      aria-hidden="true"
      orthographic
      dpr={[1, 1.5]}
      frameloop={playing ? "always" : "never"}
      camera={{ position: [3.8, 2.5, 7], zoom: 60, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, 0.48, 0);
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 5, 6]} intensity={2.3} />
      <ProceduralFigure palette={palette} reaction={reaction} />
      <RendererControl
        playing={playing}
        onFirstFrame={onFirstFrame}
        onRendererFailure={onRendererFailure}
      />
    </Canvas>
  );
}
