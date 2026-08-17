import {
  Color,
  Mesh,
  MeshStandardMaterial,
  type Material,
  type Object3D,
} from "three";

export const GUIDE_AUTHORED_MATERIAL = "guideAuthoredMaterial";

export function applyGuideBaseMaterials(root: Object3D): Material[] {
  const owned: Material[] = [];
  root.traverse((child) => {
    if (
      !(child instanceof Mesh) ||
      child.userData[GUIDE_AUTHORED_MATERIAL] === true
    ) {
      return;
    }
    child.castShadow = true;
    child.receiveShadow = false;
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    const replacements = materials.map((material) => {
      const next = material.clone() as MeshStandardMaterial;
      next.color = new Color("#f2f3ef");
      next.roughness = 0.58;
      next.metalness = 0.06;
      next.envMapIntensity = 0.45;
      owned.push(next);
      return next;
    });
    child.material = Array.isArray(child.material)
      ? replacements
      : replacements[0];
  });
  return owned;
}
