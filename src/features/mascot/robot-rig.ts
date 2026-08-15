import { Bone, type Object3D } from "three";

export interface RobotBones {
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

export function resolveRobotBones(root: Object3D): RobotBones {
  return {
    head: requireBone(root, "Head"),
    // GLTFLoader applies PropertyBinding.sanitizeNodeName(), removing dots.
    neck: requireBone(root, "spine004"),
    spine: requireBone(root, "spine002"),
    leftUpperArm: requireBone(root, "upper_armL"),
    rightUpperArm: requireBone(root, "upper_armR"),
    leftForearm: requireBone(root, "forearmL"),
    rightForearm: requireBone(root, "forearmR"),
    leftHand: requireBone(root, "handL"),
    rightHand: requireBone(root, "handR"),
  };
}
