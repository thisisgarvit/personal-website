import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

interface GuideManifest {
  candidate: string;
  license: string;
  sourceLicense: {
    repositoryRecord: string;
  };
  runtimeAuthoredHardware: {
    authoredMeshes: number;
    baseModelDrawCalls: number;
    maximumSceneDrawCalls: number;
    attachments: { pager: string; headset: string };
  };
  productionAsset: {
    path: string;
    sha256: string;
    bytes: number;
    geometry: {
      triangles: number;
      primitives: number;
      joints: number;
    };
    textures: Array<{ width: number; height: number }>;
  };
}

interface GlbDocument {
  nodes: Array<{ name?: string }>;
  meshes: Array<{ primitives: unknown[] }>;
  skins: Array<{ joints: number[] }>;
}

function readGlbDocument(asset: Buffer): GlbDocument {
  expect(asset.toString("utf8", 0, 4)).toBe("glTF");
  const jsonLength = asset.readUInt32LE(12);
  expect(asset.readUInt32LE(16)).toBe(0x4e4f534a);
  return JSON.parse(asset.toString("utf8", 20, 20 + jsonLength).trim());
}

const projectRoot = process.cwd();
const manifestPath = path.join(
  projectRoot,
  "public/models/guide/source.json",
);

describe("production guide asset", () => {
  it("matches its frozen provenance record and runtime ceilings", async () => {
    const manifest = JSON.parse(
      await readFile(manifestPath, "utf8"),
    ) as GuideManifest;
    const assetPath = path.join(projectRoot, manifest.productionAsset.path);
    const [asset, assetStats, licenseStats] = await Promise.all([
      readFile(assetPath),
      stat(assetPath),
      stat(
        path.join(projectRoot, manifest.sourceLicense.repositoryRecord),
      ),
    ]);

    expect(manifest.candidate).toBe("muko");
    expect(manifest.license).toBe("CC-BY-4.0");
    expect(licenseStats.size).toBeGreaterThan(0);
    expect(assetStats.size).toBe(manifest.productionAsset.bytes);
    expect(createHash("sha256").update(asset).digest("hex")).toBe(
      manifest.productionAsset.sha256,
    );
    expect(assetStats.size).toBeLessThanOrEqual(1_800_000);
    expect(manifest.productionAsset.geometry).toMatchObject({
      triangles: 11_458,
      primitives: 1,
      joints: 58,
    });
    expect(manifest.productionAsset.textures).toHaveLength(3);
    for (const texture of manifest.productionAsset.textures) {
      expect(texture.width).toBeLessThanOrEqual(1024);
      expect(texture.height).toBeLessThanOrEqual(1024);
    }

    const document = readGlbDocument(asset);
    const nodeNames = new Set(document.nodes.map((node) => node.name));
    for (const semanticName of [
      "_rootJoint",
      "mixamorig:Hips_01",
      "mixamorig:Spine_02",
      "mixamorig:Spine2_04",
      "mixamorig:Neck_00",
      "mixamorig:Head_05",
      "mixamorig:LeftArm_08",
      "mixamorig:RightArm_028",
      "mixamorig:LeftForeArm_09",
      "mixamorig:RightForeArm_029",
      "mixamorig:LeftHand_010",
      "mixamorig:RightHand_030",
    ]) {
      expect(nodeNames).toContain(semanticName);
    }
    expect(document.skins[0].joints).toHaveLength(58);
    expect(document.meshes).toHaveLength(1);
    expect(document.meshes[0].primitives).toHaveLength(1);
    expect(
      manifest.runtimeAuthoredHardware.baseModelDrawCalls +
        manifest.runtimeAuthoredHardware.authoredMeshes,
    ).toBeLessThanOrEqual(
      manifest.runtimeAuthoredHardware.maximumSceneDrawCalls,
    );
    expect(manifest.runtimeAuthoredHardware.attachments).toEqual({
      pager: "mixamorig:Spine2_04",
      headset: "mixamorig:Head_05",
    });
  });
});
