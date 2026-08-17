"use client";

import { ContactShadows, RoundedBox, useGLTF } from "@react-three/drei";
import {
  addAfterEffect,
  addEffect,
  createPortal,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  Euler,
  Group,
  Mesh,
  Quaternion,
  Vector3,
} from "three";
import { useEffect, useMemo, useRef } from "react";
import {
  applyGuideBaseMaterials,
  GUIDE_AUTHORED_MATERIAL,
} from "./guide-materials";
import { resolveGuideRig, type GuideRig } from "./guide-rig";
import {
  gestureForWorldState,
  stepCriticalSpring,
  stepSpringRecord,
  targetForScene,
  targetForSceneProgress,
  type GuideGesture,
  type SpringValue,
} from "./scene-motion";
import type { WorldDirector } from "./types";

const MODEL_URL = "/models/guide/guide.glb";

interface GuideSceneProps {
  director: WorldDirector;
  playing: boolean;
  onFirstFrame(): void;
}

type MotionKey =
  | "x"
  | "y"
  | "z"
  | "rx"
  | "ry"
  | "rz"
  | "scale"
  | "cameraX"
  | "cameraY"
  | "cameraZ"
  | "lookX"
  | "lookY";

interface GuidePose {
  spineX: number;
  spineZ: number;
  headX: number;
  headZ: number;
  leftArmX: number;
  rightArmX: number;
  leftArmZ: number;
  rightArmZ: number;
  leftForearmX: number;
  rightForearmX: number;
  leftHandZ: number;
  rightHandZ: number;
  lift: number;
  statusPulse: number;
}

function poseForGesture(gesture: GuideGesture, phase: number): GuidePose {
  const beat = Math.sin(phase * Math.PI * 2);
  const neutral = {
    spineX: 0,
    spineZ: 0,
    headX: 0,
    headZ: 0,
    leftArmX: 0.96,
    rightArmX: 0.96,
    leftArmZ: 0.17,
    rightArmZ: -0.17,
    leftForearmX: 0.08,
    rightForearmX: 0.08,
    leftHandZ: 0,
    rightHandZ: 0,
    lift: Math.sin(phase * Math.PI) * 0.012,
    statusPulse: 0,
  };
  switch (gesture) {
    case "wave":
      return {
        ...neutral,
        spineZ: -0.06,
        headZ: 0.08,
        rightArmX: 0.08,
        rightArmZ: -0.08,
        rightForearmX: -1.22,
        rightHandZ: beat * 0.42,
        lift: 0.025,
      };
    case "board-guide":
      return {
        ...neutral,
        spineX: -0.06,
        spineZ: 0.08,
        headX: -0.08,
        leftArmX: 0.46,
        leftArmZ: 0.1,
        leftForearmX: -0.68,
      };
    case "drag-watch":
      return {
        ...neutral,
        spineX: -0.26,
        headX: 0.18,
        leftArmX: 0.68,
        rightArmX: 0.68,
        lift: -0.025,
      };
    case "pager-check":
      return {
        ...neutral,
        spineX: -0.09,
        headX: -0.18,
        headZ: -0.06,
        rightArmX: 0.42,
        rightArmZ: -0.08,
        rightForearmX: -1.05,
        statusPulse: 0.55 + Math.max(0, beat) * 0.45,
      };
    case "ship-celebration":
      return {
        ...neutral,
        spineX: 0.08,
        leftArmX: 0.16,
        rightArmX: 0.16,
        leftArmZ: 0.08,
        rightArmZ: -0.08,
        leftForearmX: -0.5,
        rightForearmX: -0.5,
        lift: 0.09 + Math.max(0, beat) * 0.025,
        statusPulse: 1,
      };
    case "resolution":
      return {
        ...neutral,
        spineX: 0.05,
        spineZ: 0.05,
        headX: 0.12,
        headZ: -0.08,
        leftArmX: 0.62,
        rightForearmX: -0.48,
        lift: 0.025,
        statusPulse: 0.28,
      };
    default:
      return neutral;
  }
}

function addRotation(
  bone: GuideRig[keyof GuideRig],
  base: Quaternion,
  x: number,
  y: number,
  z: number,
) {
  bone.quaternion
    .copy(base)
    .multiply(new Quaternion().setFromEuler(new Euler(x, y, z, "XYZ")));
}

function seedMotion(
  director: WorldDirector,
): Record<MotionKey, SpringValue> {
  const target = targetForScene(
    director.getSnapshot().activeScene,
    window.innerWidth < 720,
  );
  return {
    x: { value: target.position[0], velocity: 0 },
    y: { value: target.position[1], velocity: 0 },
    z: { value: target.position[2], velocity: 0 },
    rx: { value: target.rotation[0], velocity: 0 },
    ry: { value: target.rotation[1], velocity: 0 },
    rz: { value: target.rotation[2], velocity: 0 },
    scale: { value: target.scale, velocity: 0 },
    cameraX: { value: target.camera[0], velocity: 0 },
    cameraY: { value: target.camera[1], velocity: 0 },
    cameraZ: { value: target.camera[2], velocity: 0 },
    lookX: { value: target.lookAt[0], velocity: 0 },
    lookY: { value: target.lookAt[1], velocity: 0 },
  };
}

function seedPose(pose: GuidePose): Record<keyof GuidePose, SpringValue> {
  return Object.fromEntries(
    (Object.keys(pose) as (keyof GuidePose)[]).map((key) => [
      key,
      { value: pose[key], velocity: 0 },
    ]),
  ) as Record<keyof GuidePose, SpringValue>;
}

function readPose(motion: Record<keyof GuidePose, SpringValue>): GuidePose {
  return {
    spineX: motion.spineX.value,
    spineZ: motion.spineZ.value,
    headX: motion.headX.value,
    headZ: motion.headZ.value,
    leftArmX: motion.leftArmX.value,
    rightArmX: motion.rightArmX.value,
    leftArmZ: motion.leftArmZ.value,
    rightArmZ: motion.rightArmZ.value,
    leftForearmX: motion.leftForearmX.value,
    rightForearmX: motion.rightForearmX.value,
    leftHandZ: motion.leftHandZ.value,
    rightHandZ: motion.rightHandZ.value,
    lift: motion.lift.value,
    statusPulse: motion.statusPulse.value,
  };
}

function StatusHardware({ pulse }: { pulse: React.MutableRefObject<number> }) {
  const light = useRef<Mesh>(null);
  useFrame(() => {
    if (!light.current) return;
    const value = pulse.current;
    light.current.scale.setScalar(0.78 + value * 0.3);
  });
  return (
    <group position={[0.07, 0.02, 0.14]} rotation={[-0.05, 0, -0.05]}>
      <RoundedBox
        args={[0.2, 0.13, 0.032]}
        radius={0.022}
        smoothness={4}
        userData={{ [GUIDE_AUTHORED_MATERIAL]: true }}
      >
        <meshBasicMaterial color="#ff4c35" toneMapped={false} />
      </RoundedBox>
      <RoundedBox
        args={[0.1, 0.05, 0.009]}
        radius={0.009}
        smoothness={3}
        position={[-0.022, -0.002, 0.021]}
        userData={{ [GUIDE_AUTHORED_MATERIAL]: true }}
      >
        <meshBasicMaterial color="#171923" toneMapped={false} />
      </RoundedBox>
      <mesh
        ref={light}
        position={[0.076, 0.032, 0.028]}
        userData={{ [GUIDE_AUTHORED_MATERIAL]: true }}
      >
        <sphereGeometry args={[0.018, 18, 12]} />
        <meshBasicMaterial color="#cbed45" toneMapped={false} />
      </mesh>
    </group>
  );
}

function HeadsetHardware() {
  const authored = { [GUIDE_AUTHORED_MATERIAL]: true };
  return (
    <group position={[0, 0.145, 0.045]}>
      {[-1, 1].map((side) => (
        <RoundedBox
          key={side}
          args={[0.045, 0.09, 0.038]}
          radius={0.015}
          smoothness={4}
          position={[side * 0.218, 0, 0.008]}
          userData={authored}
        >
          <meshStandardMaterial
            color="#4053ff"
            roughness={0.48}
            metalness={0.08}
          />
        </RoundedBox>
      ))}
      <mesh position={[0.218, 0.028, 0.034]} userData={authored}>
        <sphereGeometry args={[0.013, 16, 10]} />
        <meshBasicMaterial color="#ff4c35" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Character({
  director,
  playing,
  onFirstFrame,
}: GuideSceneProps) {
  "use no memo";
  const source = useGLTF(MODEL_URL);
  const figure = useMemo(() => cloneSkeleton(source.scene), [source.scene]);
  const character = useRef<Group>(null);
  const motion = useRef(seedMotion(director));
  const pointer = useRef({ x: 0.18, y: 0.04 });
  const lastPointerAt = useRef(Number.NEGATIVE_INFINITY);
  const startedAt = useRef<number | null>(null);
  const firstFrameSent = useRef(false);
  const statusPulse = useRef(0);
  const poseMotion = useRef(seedPose(poseForGesture("idle", 0)));
  const pointerMotion = useRef({
    x: { value: 0.18, velocity: 0 },
    y: { value: 0.04, velocity: 0 },
  });
  const idleTimer = useRef<number | null>(null);
  const diagnosticFrame = useRef(0);
  const { camera, gl, invalidate } = useThree();
  const diagnosticCanvas = useRef(gl.domElement);
  const diagnosticInfo = useRef(gl.info);
  const diagnosticsEnabled =
    typeof window !== "undefined" && window.location.pathname === "/dev/world";
  const rig = useMemo(() => resolveGuideRig(figure), [figure]);
  const bases = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(rig).map(([key, bone]) => [
          key,
          bone.quaternion.clone(),
        ]),
      ) as Record<keyof GuideRig, Quaternion>,
    [rig],
  );
  const hardware = useMemo(
    () => <StatusHardware pulse={statusPulse} />,
    [],
  );
  const headset = useMemo(() => <HeadsetHardware />, []);

  useEffect(() => {
    const owned = applyGuideBaseMaterials(figure);
    return () => owned.forEach((material) => material.dispose());
  }, [figure]);

  useEffect(() => {
    if (!playing) return;
    const discrete = director.subscribe(invalidate);
    const presentation = director.subscribePresentation(invalidate);
    return () => {
      discrete();
      presentation();
    };
  }, [director, invalidate, playing]);

  useEffect(() => {
    if (!playing) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType === "touch") return;
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      };
      lastPointerAt.current = performance.now();
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => invalidate(), 4200);
      invalidate();
    };
    window.addEventListener("pointermove", update, { passive: true });
    return () => {
      window.removeEventListener("pointermove", update);
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    };
  }, [invalidate, playing]);

  useEffect(() => {
    if (playing) invalidate();
  }, [invalidate, playing]);

  useEffect(() => {
    if (!diagnosticsEnabled) return;
    diagnosticCanvas.current.dataset.guidePlaying = String(playing);
    if (!diagnosticCanvas.current.dataset.guideFrame) {
      diagnosticCanvas.current.dataset.guideFrame = String(
        diagnosticFrame.current,
      );
    }
  }, [diagnosticsEnabled, playing]);

  useEffect(() => {
    if (!diagnosticsEnabled) return;
    const info = diagnosticInfo.current;
    const canvas = diagnosticCanvas.current;
    const autoReset = info.autoReset;
    info.autoReset = false;
    const removeBefore = addEffect(() => info.reset());
    const removeAfter = addAfterEffect(() => {
      canvas.dataset.guideDrawCalls = String(info.render.calls);
    });
    return () => {
      removeBefore();
      removeAfter();
      info.autoReset = autoReset;
      info.reset();
    };
  }, [diagnosticsEnabled]);

  useFrame((state, delta) => {
    if (!playing) return;
    if (startedAt.current === null) startedAt.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startedAt.current;
    const snapshot = director.getSnapshot();
    const narrow = state.size.width < 720;
    const progress =
      director.readAnchor(snapshot.activeScene)?.viewportProgress ?? 0.5;
    const target = targetForSceneProgress(
      snapshot.activeScene,
      narrow,
      progress,
    );
    const targets: Record<MotionKey, number> = {
      x: target.position[0],
      y: target.position[1],
      z: target.position[2],
      rx: target.rotation[0],
      ry: target.rotation[1],
      rz: target.rotation[2],
      scale: target.scale,
      cameraX: target.camera[0],
      cameraY: target.camera[1],
      cameraZ: target.camera[2],
      lookX: target.lookAt[0],
      lookY: target.lookAt[1],
    };
    let unsettled = false;
    for (const key of Object.keys(targets) as MotionKey[]) {
      motion.current[key] = stepCriticalSpring(
        motion.current[key],
        targets[key],
        delta,
      );
      if (
        Math.abs(motion.current[key].value - targets[key]) > 0.0005 ||
        Math.abs(motion.current[key].velocity) > 0.0005
      ) {
        unsettled = true;
      }
    }

    const group = character.current;
    if (group) {
      group.position.set(
        motion.current.x.value,
        motion.current.y.value,
        motion.current.z.value,
      );
      group.rotation.set(
        motion.current.rx.value,
        motion.current.ry.value,
        motion.current.rz.value,
      );
      group.scale.setScalar(motion.current.scale.value);
    }
    camera.position.set(
      motion.current.cameraX.value,
      motion.current.cameraY.value,
      motion.current.cameraZ.value,
    );
    camera.lookAt(
      new Vector3(
        motion.current.lookX.value,
        motion.current.lookY.value,
        0,
      ),
    );

    const waving = snapshot.activeScene === "hero" && elapsed < 1.65;
    const gesture = waving ? "wave" : gestureForWorldState(snapshot);
    const poseTarget = poseForGesture(gesture, elapsed * 0.8);
    poseMotion.current = stepSpringRecord(
      poseMotion.current,
      poseTarget,
      delta,
      0.2,
    );
    const pose = readPose(poseMotion.current);
    const poseUnsettled = (Object.keys(poseTarget) as (keyof GuidePose)[]).some(
      (key) =>
        Math.abs(poseMotion.current![key].value - poseTarget[key]) > 0.0005 ||
        Math.abs(poseMotion.current![key].velocity) > 0.0005,
    );
    const idle = performance.now() - lastPointerAt.current > 4200;
    const look = idle ? { x: -0.34, y: -0.24 } : pointer.current;
    pointerMotion.current = stepSpringRecord(
      pointerMotion.current,
      {
        x: Math.max(-1, Math.min(1, look.x)),
        y: Math.max(-1, Math.min(1, look.y)),
      },
      delta,
      0.16,
    );
    const lookX = pointerMotion.current.x.value;
    const lookY = pointerMotion.current.y.value;
    const lookUnsettled = (Object.keys(pointerMotion.current) as ("x" | "y")[])
      .some(
        (key) =>
          Math.abs(pointerMotion.current[key].value - look[key]) > 0.0005 ||
          Math.abs(pointerMotion.current[key].velocity) > 0.0005,
      );
    addRotation(
      rig.spine,
      bases.spine,
      pose.spineX,
      lookX * 0.055,
      pose.spineZ,
    );
    addRotation(
      rig.head,
      bases.head,
      pose.headX + lookY * 0.09,
      lookX * 0.16,
      pose.headZ,
    );
    addRotation(
      rig.leftUpperArm,
      bases.leftUpperArm,
      pose.leftArmX,
      0,
      pose.leftArmZ,
    );
    addRotation(
      rig.rightUpperArm,
      bases.rightUpperArm,
      pose.rightArmX,
      0,
      pose.rightArmZ,
    );
    addRotation(
      rig.leftForearm,
      bases.leftForearm,
      pose.leftForearmX,
      0,
      0,
    );
    addRotation(
      rig.rightForearm,
      bases.rightForearm,
      pose.rightForearmX,
      0,
      0,
    );
    addRotation(rig.leftHand, bases.leftHand, 0, 0, pose.leftHandZ);
    addRotation(rig.rightHand, bases.rightHand, 0, 0, pose.rightHandZ);
    if (group) group.position.y += pose.lift;
    statusPulse.current = pose.statusPulse;

    if (diagnosticsEnabled) {
      diagnosticFrame.current += 1;
      const canvas = diagnosticCanvas.current;
      canvas.dataset.guideFrame = String(diagnosticFrame.current);
      canvas.dataset.guideScene = snapshot.activeScene;
      canvas.dataset.guideReaction = snapshot.reaction.reaction;
      canvas.dataset.guideGesture = gesture;
      canvas.dataset.guideProgress = progress.toFixed(4);
      canvas.dataset.guidePosition = [
        motion.current.x.value,
        motion.current.y.value,
        motion.current.z.value,
      ]
        .map((value) => value.toFixed(4))
        .join(",");
    }

    if (!firstFrameSent.current) {
      firstFrameSent.current = true;
      onFirstFrame();
    }
    const pointerActive = performance.now() - lastPointerAt.current < 500;
    if (
      unsettled ||
      poseUnsettled ||
      lookUnsettled ||
      waving ||
      pointerActive
    ) {
      invalidate();
    }
  });

  return (
    <group ref={character}>
      <primitive object={figure} />
      {createPortal(hardware, rig.chest)}
      {createPortal(headset, rig.head)}
    </group>
  );
}

export function GuideScene(props: GuideSceneProps) {
  return (
    <>
      <ambientLight intensity={0.34} color="#c7d0ff" />
      <directionalLight
        position={[4.6, 6.2, 5.5]}
        intensity={1.75}
        color="#fff1df"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-5, 2.4, 3.2]}
        intensity={0.72}
        color="#7489ff"
      />
      <pointLight
        position={[1.8, 3.2, -1.2]}
        intensity={7}
        distance={7}
        color="#ff816f"
      />
      <Character {...props} />
      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.28}
        scale={7}
        blur={2.8}
        far={4}
      />
    </>
  );
}

useGLTF.preload(MODEL_URL);
