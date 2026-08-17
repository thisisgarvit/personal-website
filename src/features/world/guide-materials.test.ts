import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from "three";
import { describe, expect, it } from "vitest";
import {
  applyGuideBaseMaterials,
  GUIDE_AUTHORED_MATERIAL,
} from "./guide-materials";

describe("guide material authorship", () => {
  it("reskins the sourced figure without bleaching authored hardware", () => {
    const root = new Group();
    const sourceMaterial = new MeshStandardMaterial({ color: "#ffffff" });
    const suit = new Mesh(new BoxGeometry(), sourceMaterial);
    const pagerMaterial = new MeshBasicMaterial({ color: "#ff4c35" });
    const pager = new Mesh(new BoxGeometry(), pagerMaterial);
    pager.userData[GUIDE_AUTHORED_MATERIAL] = true;
    root.add(suit, pager);

    const owned = applyGuideBaseMaterials(root);

    expect(suit.material).not.toBe(sourceMaterial);
    expect((suit.material as MeshStandardMaterial).color.getHexString()).toBe(
      "f2f3ef",
    );
    expect(pager.material).toBe(pagerMaterial);
    expect(pagerMaterial.color.getHexString()).toBe("ff4c35");
    expect(owned).toHaveLength(1);
  });
});
