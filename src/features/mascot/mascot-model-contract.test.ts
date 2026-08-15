import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

interface GltfNode {
  name?: string;
  mesh?: number;
}

interface GltfDocument {
  nodes: GltfNode[];
}

function readEmbeddedGltf(): GltfDocument {
  const model = readFileSync(
    join(process.cwd(), "public/mascot/session-analyst-robot.glb"),
  );
  const jsonLength = model.readUInt32LE(12);
  return JSON.parse(model.subarray(20, 20 + jsonLength).toString()) as GltfDocument;
}

describe("session analyst robot asset", () => {
  it("ships the stylized mesh roles and bones needed by the existing reaction rig", () => {
    const gltf = readEmbeddedGltf();
    const names = new Set(gltf.nodes.map((node) => node.name));

    expect(names).toEqual(
      expect.objectContaining(
        new Set([
          "Head",
          "spine.002",
          "upper_arm.L",
          "upper_arm.R",
          "forearm.L",
          "forearm.R",
          "hand.L",
          "hand.R",
          "Face",
          "Chest",
          "Bottom",
          "Llimbs and head",
        ]),
      ),
    );
  });

  it("does not carry the realistic human base, skin, outfit, or hair nodes", () => {
    const names = readEmbeddedGltf().nodes
      .map((node) => node.name ?? "")
      .join(" ");

    expect(names).not.toMatch(/hair|ranger|superhero|male|female|skin/i);
  });
});
