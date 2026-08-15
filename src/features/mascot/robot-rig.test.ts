import { Bone, Group } from "three";
import { describe, expect, it } from "vitest";
import { resolveRobotBones } from "./robot-rig";

const required = [
  "Head",
  "spine004",
  "spine002",
  "upper_armL",
  "upper_armR",
  "forearmL",
  "forearmR",
  "handL",
  "handR",
] as const;

describe("robot reaction rig mapping", () => {
  it("maps the stylized robot skeleton onto the existing pose channels", () => {
    const root = new Group();
    for (const name of required) {
      const bone = new Bone();
      bone.name = name;
      root.add(bone);
    }

    const rig = resolveRobotBones(root);

    expect(rig.head.name).toBe("Head");
    expect(rig.neck.name).toBe("spine004");
    expect(rig.spine.name).toBe("spine002");
    expect(rig.leftUpperArm.name).toBe("upper_armL");
    expect(rig.rightUpperArm.name).toBe("upper_armR");
    expect(rig.leftForearm.name).toBe("forearmL");
    expect(rig.rightForearm.name).toBe("forearmR");
    expect(rig.leftHand.name).toBe("handL");
    expect(rig.rightHand.name).toBe("handR");
  });

  it("fails loudly when the source rig loses a required pose bone", () => {
    expect(() => resolveRobotBones(new Group())).toThrow(
      "Mascot rig is missing Head",
    );
  });
});
