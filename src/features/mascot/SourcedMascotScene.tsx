"use client";

import { ContactShadows, useGLTF } from "@react-three/drei";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  Bone,
  Color,
  Euler,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
} from "three";
import { useEffect, useMemo, useRef } from "react";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  characterPose,
  type CharacterGesture,
  type CharacterPose,
} from "./character-poses";
import { splitLookTarget, stepSpring, type SpringState } from "./rig";
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

const MODEL_URL = "/mascot/session-analyst.gltf";
const OUTFIT_URL = "/mascot/session-analyst-outfit.gltf";
const HAIR_URL = "/mascot/session-analyst-hair.gltf";
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

interface CharacterBones {
  head: Bone;
  neck: Bone;
  spine: Bone;
  leftUpperArm: Bone;
  rightUpperArm: Bone;
  leftForearm: Bone;
  rightForearm: Bone;
  leftHand: Bone;
  rightHand: Bone;
}

function requireBone(root: Object3D, name: string): Bone {
  const bone = root.getObjectByName(name);
  if (!(bone instanceof Bone)) throw new Error(`Mascot rig is missing ${name}`);
  return bone;
}

function getBones(root: Object3D): CharacterBones {
  return {
    head: requireBone(root, "Head"),
    neck: requireBone(root, "neck_01"),
    spine: requireBone(root, "spine_02"),
    leftUpperArm: requireBone(root, "upperarm_l"),
    rightUpperArm: requireBone(root, "upperarm_r"),
    leftForearm: requireBone(root, "lowerarm_l"),
    rightForearm: requireBone(root, "lowerarm_r"),
    leftHand: requireBone(root, "hand_l"),
    rightHand: requireBone(root, "hand_r"),
  };
}

function addLocalRotation(
  bone: Bone,
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
    () => new RoundedBoxGeometry(0.15, 0.105, 0.045, 4, 0.018),
    [],
  );
  useEffect(() => () => body.dispose(), [body]);

  return (
    <group rotation={[0.04, -0.18, -0.08]}>
      <mesh geometry={body} castShadow>
        <meshPhysicalMaterial
          color={palette.incident}
          roughness={0.44}
          clearcoat={0.28}
          clearcoatRoughness={0.5}
        />
      </mesh>
      <mesh position={[-0.018, 0.012, 0.025]}>
        <planeGeometry args={[0.072, 0.036]} />
        <meshStandardMaterial color={palette.ink} roughness={0.78} />
      </mesh>
      <mesh name="pager-status" position={[0.048, 0.024, 0.03]}>
        <sphereGeometry args={[0.012, 18, 12]} />
        <meshStandardMaterial
          color={palette.merge}
          emissive={palette.merge}
          emissiveIntensity={0.45}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

function Headset({ palette }: { palette: MascotPalette }) {
  return (
    <group position={[0, 0.105, 0.005]} rotation={[0, 0, -0.03]}>
      <mesh rotation={[0, 0, Math.PI]} castShadow>
        <torusGeometry args={[0.135, 0.014, 12, 40, Math.PI]} />
        <meshPhysicalMaterial
          color={palette.incident}
          roughness={0.42}
          clearcoat={0.34}
          clearcoatRoughness={0.45}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.137, -0.012, 0]} castShadow>
          <capsuleGeometry args={[0.027, 0.055, 6, 12]} />
          <meshPhysicalMaterial
            color={palette.incident}
            roughness={0.38}
            clearcoat={0.28}
          />
        </mesh>
      ))}
      <mesh position={[0.112, -0.075, 0.045]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.006, 0.006, 0.15, 12]} />
        <meshStandardMaterial color={palette.incident} roughness={0.48} />
      </mesh>
      <mesh position={[0.165, -0.128, 0.056]}>
        <sphereGeometry args={[0.012, 12, 8]} />
        <meshStandardMaterial color={palette.ink} roughness={0.7} />
      </mesh>
    </group>
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
  const outfitSource = useGLTF(OUTFIT_URL);
  const hairSource = useGLTF(HAIR_URL);
  const figure = useMemo(() => cloneSkeleton(source.scene), [source.scene]);
  const outfit = useMemo(
    () => cloneSkeleton(outfitSource.scene),
    [outfitSource.scene],
  );
  const hair = useMemo(
    () => cloneSkeleton(hairSource.scene),
    [hairSource.scene],
  );
  const root = useRef<Group>(null);
  const springs = useRef(springSeed());
  const mountedAt = useRef(0);
  const lastActivity = useRef(0);
  const guided = useRef(false);
  const pointer = usePointerLook(lastActivity);
  const bones = useMemo(() => getBones(figure), [figure]);
  const outfitBones = useMemo(() => getBones(outfit), [outfit]);
  const hairBones = useMemo(() => getBones(hair), [hair]);
  const bases = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(bones).map(([key, bone]) => [key, bone.quaternion.clone()]),
      ) as Record<keyof CharacterBones, Quaternion>,
    [bones],
  );
  const outfitBases = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(outfitBones).map(([key, bone]) => [
          key,
          bone.quaternion.clone(),
        ]),
      ) as Record<keyof CharacterBones, Quaternion>,
    [outfitBones],
  );
  const hairBases = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(hairBones).map(([key, bone]) => [
          key,
          bone.quaternion.clone(),
        ]),
      ) as Record<keyof CharacterBones, Quaternion>,
    [hairBones],
  );

  useEffect(() => {
    const now = performance.now();
    mountedAt.current = now;
    lastActivity.current = now;
  }, []);

  useEffect(() => {
    const owned: MeshStandardMaterial[] = [];
    const ownedGeometry = [] as Mesh["geometry"][];
    [figure, outfit, hair].forEach((model) => {
      model.traverse((child) => {
        if (!(child instanceof Mesh)) return;
        if (
          child.name === "Male_Ranger_Head_Hood" ||
          child.name === "Male_Ranger_Acc_Pauldron" ||
          child.name === "Male_Ranger_Arms_Bracer"
        ) {
          child.visible = false;
          return;
        }
        if (child.name === "SuperHero_Male") {
          const geometry = child.geometry.clone();
          const positions = geometry.getAttribute("position");
          const indices = geometry.index;
          if (indices) {
            const kept: number[] = [];
            for (let offset = 0; offset < indices.count; offset += 3) {
              const a = indices.getX(offset);
              const b = indices.getX(offset + 1);
              const c = indices.getX(offset + 2);
              if (
                positions.getY(a) > 1.43 &&
                positions.getY(b) > 1.43 &&
                positions.getY(c) > 1.43
              ) {
                kept.push(a, b, c);
              }
            }
            geometry.setIndex(kept);
            child.geometry = geometry;
            ownedGeometry.push(geometry);
          }
        }
        child.castShadow = true;
        child.receiveShadow = true;
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        const clones = materials.map((material) => {
          const clone = material.clone() as MeshStandardMaterial;
          clone.roughness = Math.min(0.78, Math.max(0.42, clone.roughness));
          clone.metalness = 0;
          clone.envMapIntensity = 0.72;
          if (child.name === "Hair_SimpleParted") {
            clone.color.set("#171923");
            clone.roughness = 0.62;
          }
          owned.push(clone);
          return clone;
        });
        child.material = Array.isArray(child.material) ? clones : clones[0];
      });
    });
    return () => {
      owned.forEach((material) => material.dispose());
      ownedGeometry.forEach((geometry) => geometry.dispose());
    };
  }, [figure, hair, outfit]);

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

    root.current.position.y = -2.38 + value("rootY", authored.rootY);
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
      rig: CharacterBones,
      rest: Record<keyof CharacterBones, Quaternion>,
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
    applyPose(outfitBones, outfitBases);
    applyPose(hairBones, hairBases);

    const pager = figure.getObjectByName("pager-status") as Mesh | undefined;
    if (pager?.material instanceof MeshStandardMaterial) {
      const incident = reaction === "incident";
      const color = new Color(incident ? palette.incident : palette.merge);
      pager.material.color.lerp(color, Math.min(1, delta * 12));
      pager.material.emissive.lerp(color, Math.min(1, delta * 12));
      pager.material.emissiveIntensity =
        0.35 + value("pagerPulse", authored.pagerPulse) * 1.2;
      pager.scale.setScalar(1 + Math.max(0, authored.pagerPulse) * 0.2);
    }
  });

  return (
    <group
      ref={root}
      position={[0.16, -2.38, 0]}
      rotation={[0, 0.08, 0]}
      scale={2.05}
    >
      <primitive object={figure} />
      <primitive object={outfit} />
      <primitive object={hair} />
      {createPortal(<Headset palette={palette} />, bones.head)}
      {createPortal(
        <group position={[0.16, 0.055, 0.16]}>
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
      camera={{ position: [0.05, 1.15, 4.6], fov: 28, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0.05, 1.02, 0);
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
      <pointLight color={palette.release} position={[3.5, 2.8, 2]} intensity={9} distance={7} />
      <pointLight color={palette.incident} position={[-2.4, 1.2, -1.5]} intensity={4.5} distance={6} />
      <SourcedCharacter palette={palette} reaction={reaction} />
      <ContactShadows
        position={[0, -0.34, 0]}
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
useGLTF.preload(OUTFIT_URL);
useGLTF.preload(HAIR_URL);
