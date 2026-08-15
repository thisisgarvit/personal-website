"use client";

import { ContactShadows, useGLTF } from "@react-three/drei";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  Color,
  Euler,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  QuadraticBezierCurve3,
  Quaternion,
  Vector3,
} from "three";
import { useEffect, useMemo, useRef } from "react";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  characterPose,
  type CharacterGesture,
  type CharacterPose,
} from "./character-poses";
import { splitLookTarget, stepSpring, type SpringState } from "./rig";
import { resolveRobotBones, type RobotBones } from "./robot-rig";
import type { MascotReaction } from "./signals";

export interface MascotPalette {
  ink: string;
  release: string;
  incident: string;
  merge: string;
  panel: string;
}

interface SourcedMascotSceneProps {
  reaction: MascotReaction;
  playing: boolean;
  palette: MascotPalette;
  onFirstFrame(): void;
  onRendererFailure(): void;
}

type AnimatedValue = keyof CharacterPose | "lookTorso" | "lookHeadX" | "lookHeadY";

const MODEL_URL = "/mascot/session-analyst-robot.glb";
const springSeed = (): Record<AnimatedValue, SpringState> => ({
  rootY: { value: 0, velocity: 0 },
  rootRoll: { value: 0, velocity: 0 },
  spinePitch: { value: 0, velocity: 0 },
  spineRoll: { value: 0, velocity: 0 },
  headPitch: { value: 0, velocity: 0 },
  headRoll: { value: 0, velocity: 0 },
  leftUpperArm: { value: 0, velocity: 0 },
  rightUpperArm: { value: 0, velocity: 0 },
  leftForearm: { value: 0, velocity: 0 },
  rightForearm: { value: 0, velocity: 0 },
  leftHand: { value: 0, velocity: 0 },
  rightHand: { value: 0, velocity: 0 },
  pagerPulse: { value: 0, velocity: 0 },
  lookTorso: { value: 0, velocity: 0 },
  lookHeadX: { value: 0, velocity: 0 },
  lookHeadY: { value: 0, velocity: 0 },
});

function addLocalRotation(
  bone: RobotBones[keyof RobotBones],
  base: Quaternion,
  x: number,
  y: number,
  z: number,
): void {
  const offset = new Quaternion().setFromEuler(new Euler(x, y, z, "XYZ"));
  bone.quaternion.copy(base).multiply(offset);
}

function gestureForReaction(reaction: MascotReaction): CharacterGesture {
  return reaction === "milestone" ? "flag-check" : reaction;
}

function usePointerLook(lastActivity: React.MutableRefObject<number>) {
  const target = useRef({ x: 0.18, y: 0.06 });

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;
      target.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      };
      lastActivity.current = performance.now();
    };
    const markActivity = () => {
      lastActivity.current = performance.now();
    };
    window.addEventListener("pointermove", update, { passive: true });
    window.addEventListener("pointerdown", markActivity, { passive: true });
    window.addEventListener("keydown", markActivity);
    return () => {
      window.removeEventListener("pointermove", update);
      window.removeEventListener("pointerdown", markActivity);
      window.removeEventListener("keydown", markActivity);
    };
  }, [lastActivity]);

  return target;
}

function RoundedPager({ palette }: { palette: MascotPalette }) {
  const body = useMemo(
    () => new RoundedBoxGeometry(0.19, 0.135, 0.055, 5, 0.024),
    [],
  );
  useEffect(() => () => body.dispose(), [body]);

  return (
    <group name="mascot-pager" rotation={[0, -0.08, -0.06]}>
      <mesh position={[0, 0, -0.035]}>
        <boxGeometry args={[0.11, 0.16, 0.024]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
      <mesh geometry={body} castShadow>
        <meshBasicMaterial color={palette.incident} />
      </mesh>
      <mesh position={[-0.02, 0.012, 0.03]}>
        <planeGeometry args={[0.088, 0.044]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
      <mesh name="pager-status" position={[0.06, 0.032, 0.034]}>
        <sphereGeometry args={[0.014, 18, 12]} />
        <meshBasicMaterial
          color={palette.merge}
        />
      </mesh>
    </group>
  );
}

function Headset({ palette }: { palette: MascotPalette }) {
  return (
    <group name="mascot-headset" position={[0, 0.62, 0.78]}>
      <mesh castShadow>
        <torusGeometry args={[0.39, 0.035, 16, 64, Math.PI]} />
        <meshBasicMaterial color={palette.incident} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.43, -0.055, 0.025]}
          scale={[0.48, 1, 1]}
          castShadow
        >
          <sphereGeometry args={[0.12, 20, 16]} />
          <meshBasicMaterial color={palette.incident} />
        </mesh>
      ))}
      <mesh position={[0.325, -0.14, 0.1]} rotation={[0, 0, -2.27]}>
        <cylinderGeometry args={[0.01, 0.01, 0.27, 16]} />
        <meshBasicMaterial color={palette.incident} />
      </mesh>
      <mesh position={[0.2, -0.23, 0.11]}>
        <sphereGeometry args={[0.026, 16, 12]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
    </group>
  );
}

function FriendlySmile({ palette }: { palette: MascotPalette }) {
  const curve = useMemo(
    () =>
      new QuadraticBezierCurve3(
        new Vector3(-0.12, 0.02, 0),
        new Vector3(0, -0.045, 0),
        new Vector3(0.12, 0.02, 0),
      ),
    [],
  );

  return (
    <mesh name="mascot-smile" position={[0, 0.16, 1.1]}>
      <tubeGeometry args={[curve, 24, 0.018, 8, false]} />
      <meshBasicMaterial color={palette.ink} />
    </mesh>
  );
}

function SourcedCharacter({
  palette,
  reaction,
}: {
  palette: MascotPalette;
  reaction: MascotReaction;
}) {
  "use no memo";
  const source = useGLTF(MODEL_URL);
  const figure = useMemo(() => cloneSkeleton(source.scene), [source.scene]);
  const root = useRef<Group>(null);
  const springs = useRef(springSeed());
  const mountedAt = useRef(0);
  const lastActivity = useRef(0);
  const guided = useRef(false);
  const pointer = usePointerLook(lastActivity);
  const bones = useMemo(() => resolveRobotBones(figure), [figure]);
  const bases = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(bones).map(([key, bone]) => [key, bone.quaternion.clone()]),
      ) as Record<keyof RobotBones, Quaternion>,
    [bones],
  );

  useEffect(() => {
    const now = performance.now();
    mountedAt.current = now;
    lastActivity.current = now;
  }, []);

  useEffect(() => {
    const owned: MeshStandardMaterial[] = [];
    figure.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      if (child.name.startsWith("mascot-")) return;
      let owner = child.parent;
      while (owner) {
        if (owner.name.startsWith("mascot-")) return;
        owner = owner.parent;
      }
      child.castShadow = true;
      // ContactShadows ground the figure; self-receiving the low-resolution
      // directional map creates stippled shadow acne on the compact stage.
      child.receiveShadow = false;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      const clones = materials.map((material, index) => {
        const clone = material.clone() as MeshStandardMaterial;
        clone.map = null;
        clone.roughness = child.name === "Face" ? 0.62 : 0.38;
        clone.metalness = 0;
        clone.envMapIntensity = 0.68;
        clone.flatShading = false;
        if (child.name === "Bottom") clone.color.set(palette.ink);
        else if (child.name === "Face") {
          clone.color.set(index === 0 ? palette.panel : palette.ink);
          if (index === 0) {
            clone.emissive.set(palette.panel);
            clone.emissiveIntensity = 0.06;
          }
        } else clone.color.set(palette.release);
        clone.needsUpdate = true;
        owned.push(clone);
        return clone;
      });
      child.material = Array.isArray(child.material) ? clones : clones[0];
    });
    return () => {
      owned.forEach((material) => material.dispose());
    };
  }, [figure, palette.ink, palette.panel, palette.release]);

  useEffect(() => {
    if (reaction !== "idle") lastActivity.current = performance.now();
  }, [reaction]);

  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    const now = performance.now();
    const introAge = now - mountedAt.current;
    let gesture = gestureForReaction(reaction);
    if (reaction === "idle" && introAge < 2300) {
      gesture = "wave";
    } else if (
      reaction === "idle" &&
      !guided.current &&
      now - lastActivity.current > 10000
    ) {
      gesture = "guide";
      if (now - lastActivity.current > 12600) {
        guided.current = true;
        lastActivity.current = now;
      }
    }

    const authored = characterPose(gesture, clock.elapsedTime * 0.8);
    const look = splitLookTarget(pointer.current);
    const response = gesture === "incident" ? 0.18 : 0.3;
    const value = (key: AnimatedValue, target: number) => {
      const next = stepSpring(springs.current[key], target, delta, response, 0.92);
      springs.current[key] = next;
      return next.value;
    };

    root.current.position.y = -0.58 + value("rootY", authored.rootY);
    root.current.rotation.z = value("rootRoll", authored.rootRoll);
    const lookTorso = value("lookTorso", look.torsoYaw);
    const lookHeadX = value("lookHeadX", look.headYaw);
    const lookHeadY = value("lookHeadY", look.headPitch);

    const pose = {
      spinePitch: value("spinePitch", authored.spinePitch),
      spineRoll: value("spineRoll", authored.spineRoll),
      headPitch: value("headPitch", authored.headPitch),
      headRoll: value("headRoll", authored.headRoll),
      leftUpperArm: value("leftUpperArm", authored.leftUpperArm),
      rightUpperArm: value("rightUpperArm", authored.rightUpperArm),
      leftForearm: value("leftForearm", authored.leftForearm),
      rightForearm: value("rightForearm", authored.rightForearm),
      leftHand: value("leftHand", authored.leftHand),
      rightHand: value("rightHand", authored.rightHand),
    };

    const applyPose = (
      rig: RobotBones,
      rest: Record<keyof RobotBones, Quaternion>,
    ) => {
      addLocalRotation(rig.spine, rest.spine, pose.spinePitch, lookTorso, pose.spineRoll);
      addLocalRotation(
        rig.neck,
        rest.neck,
        pose.headPitch + lookHeadY * 0.35,
        lookHeadX * 0.42,
        pose.headRoll,
      );
      addLocalRotation(rig.head, rest.head, lookHeadY * 0.65, lookHeadX * 0.58, 0);
      addLocalRotation(rig.leftUpperArm, rest.leftUpperArm, 0, 0, pose.leftUpperArm);
      addLocalRotation(rig.rightUpperArm, rest.rightUpperArm, 0, 0, pose.rightUpperArm);
      addLocalRotation(rig.leftForearm, rest.leftForearm, pose.leftForearm, 0, 0);
      addLocalRotation(rig.rightForearm, rest.rightForearm, pose.rightForearm, 0, 0);
      addLocalRotation(rig.leftHand, rest.leftHand, 0, pose.leftHand, 0);
      addLocalRotation(rig.rightHand, rest.rightHand, 0, pose.rightHand, 0);
    };
    applyPose(bones, bases);

    const pager = figure.getObjectByName("pager-status") as Mesh | undefined;
    if (pager?.material instanceof MeshBasicMaterial) {
      const incident = reaction === "incident";
      const color = new Color(incident ? palette.incident : palette.merge);
      pager.material.color.lerp(color, Math.min(1, delta * 12));
      pager.scale.setScalar(1 + Math.max(0, authored.pagerPulse) * 0.2);
    }
  });

  return (
    <group
      ref={root}
      position={[0.5, -0.58, 0]}
      rotation={[0, 0.06, 0]}
      scale={1.45}
    >
      <primitive object={figure} />
      {createPortal(<Headset palette={palette} />, bones.head)}
      {createPortal(<FriendlySmile palette={palette} />, bones.head)}
      {createPortal(
        <group position={[0.1, 0.15, 1]} scale={1.18}>
          <RoundedPager palette={palette} />
        </group>,
        bones.spine,
      )}
    </group>
  );
}

function RendererControl({
  playing,
  onFirstFrame,
  onRendererFailure,
}: Pick<
  SourcedMascotSceneProps,
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

export function SourcedMascotScene({
  reaction,
  playing,
  palette,
  onFirstFrame,
  onRendererFailure,
}: SourcedMascotSceneProps) {
  "use no memo";
  return (
    <Canvas
      aria-hidden="true"
      shadows
      dpr={[1, 1.6]}
      frameloop={playing ? "always" : "never"}
      camera={{ position: [0.05, 1.2, 4.4], fov: 29, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0.05, 1.08, 0);
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={0.5} />
      <hemisphereLight color={palette.panel} groundColor={palette.ink} intensity={1.45} />
      <directionalLight
        castShadow
        color="#fff7ea"
        position={[-3.2, 5.5, 4.2]}
        intensity={3.5}
        shadow-mapSize={[512, 512]}
      />
      <pointLight color={palette.release} position={[3.5, 2.8, 2]} intensity={2.5} distance={7} />
      <pointLight color={palette.incident} position={[-2.4, 1.2, -1.5]} intensity={4.5} distance={6} />
      <SourcedCharacter palette={palette} reaction={reaction} />
      <ContactShadows
        position={[0, -0.38, 0]}
        opacity={0.32}
        scale={3.2}
        blur={2.6}
        far={3.2}
        color={palette.ink}
      />
      <RendererControl
        playing={playing}
        onFirstFrame={onFirstFrame}
        onRendererFailure={onRendererFailure}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
