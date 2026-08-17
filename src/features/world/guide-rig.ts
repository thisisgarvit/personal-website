import { PropertyBinding, type Object3D } from "three";

export interface GuideRig {
  root: Object3D;
  hips: Object3D;
  spine: Object3D;
  chest: Object3D;
  neck: Object3D;
  head: Object3D;
  leftUpperArm: Object3D;
  rightUpperArm: Object3D;
  leftForearm: Object3D;
  rightForearm: Object3D;
  leftHand: Object3D;
  rightHand: Object3D;
}

const MUKO_RIG_NAMES: Readonly<Record<keyof GuideRig, string>> = {
  root: "_rootJoint",
  hips: "mixamorig:Hips_01",
  spine: "mixamorig:Spine_02",
  chest: "mixamorig:Spine2_04",
  neck: "mixamorig:Neck_00",
  head: "mixamorig:Head_05",
  leftUpperArm: "mixamorig:LeftArm_08",
  rightUpperArm: "mixamorig:RightArm_028",
  leftForearm: "mixamorig:LeftForeArm_09",
  rightForearm: "mixamorig:RightForeArm_029",
  leftHand: "mixamorig:LeftHand_010",
  rightHand: "mixamorig:RightHand_030",
};

export function resolveGuideRig(scene: Object3D): GuideRig {
  const rig = {} as GuideRig;
  const missing: (keyof GuideRig)[] = [];

  for (const [semantic, name] of Object.entries(MUKO_RIG_NAMES) as [
    keyof GuideRig,
    string,
  ][]) {
    // GLTFLoader sanitizes reserved animation-binding characters at runtime.
    // Keep source names authoritative here and derive the runtime seam once.
    const bone = scene.getObjectByName(PropertyBinding.sanitizeNodeName(name));
    if (bone) rig[semantic] = bone;
    else missing.push(semantic);
  }

  if (missing.length > 0) {
    throw new Error(`Missing guide rig semantics: ${missing.join(", ")}`);
  }

  return rig;
}
