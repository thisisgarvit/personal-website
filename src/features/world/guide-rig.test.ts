import { Object3D, PropertyBinding } from "three";
import { describe, expect, it } from "vitest";
import { resolveGuideRig } from "./guide-rig";

const MUKO_BONES = {
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
} as const;

function mukoRoot(omit?: keyof typeof MUKO_BONES) {
  const scene = new Object3D();
  scene.name = "GuideSceneRoot";
  for (const [semantic, name] of Object.entries(MUKO_BONES)) {
    if (semantic === omit) continue;
    const bone = new Object3D();
    bone.name = PropertyBinding.sanitizeNodeName(name);
    scene.add(bone);
  }
  return scene;
}

describe("resolveGuideRig", () => {
  it("resolves the selected Muko rig by its exact production names", () => {
    const root = mukoRoot();
    const rig = resolveGuideRig(root);

    expect(rig.root).toBe(
      root.getObjectByName(PropertyBinding.sanitizeNodeName(MUKO_BONES.root)),
    );
    expect(rig.head).toBe(
      root.getObjectByName(PropertyBinding.sanitizeNodeName(MUKO_BONES.head)),
    );
    expect(rig.leftHand).toBe(
      root.getObjectByName(
        PropertyBinding.sanitizeNodeName(MUKO_BONES.leftHand),
      ),
    );
    expect(rig.rightHand).toBe(
      root.getObjectByName(
        PropertyBinding.sanitizeNodeName(MUKO_BONES.rightHand),
      ),
    );
  });

  it("lists every missing semantic instead of failing at the first bone", () => {
    const root = new Object3D();
    root.name = "GuideSceneRoot";
    for (const semantic of ["root", "head"] as const) {
      const bone = new Object3D();
      bone.name = PropertyBinding.sanitizeNodeName(MUKO_BONES[semantic]);
      root.add(bone);
    }

    expect(() => resolveGuideRig(root)).toThrow(
      "Missing guide rig semantics: hips, spine, chest, neck, leftUpperArm, rightUpperArm, leftForearm, rightForearm, leftHand, rightHand",
    );
  });

  it("does not accept aliases from the retired robot rig", () => {
    expect(() => resolveGuideRig(mukoRoot("neck"))).toThrow(
      "Missing guide rig semantics: neck",
    );
  });
});
