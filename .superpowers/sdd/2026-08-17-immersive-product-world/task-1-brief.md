### Task 1: Acquire, inspect, and select the guide model — Gate A

**Owner:** Claude performs acquisition, inspection, contact-sheet rendering, and reporting; Codex selects/rejects on visual and technical merit.

**Files:**
- Create: `docs/qa/immersive/model-inspection.md`
- Create: `docs/qa/immersive/gate-a-model.md`
- Create: `docs/qa/immersive/contact-sheets/muko-*.png`
- Create: `docs/qa/immersive/contact-sheets/quaternius-*.png`
- Create: `docs/qa/immersive/source-manifests/muko.json`
- Create: `docs/qa/immersive/source-manifests/quaternius.json`
- Modify after selection: `DESIGN.md`

**Interfaces:**
- Consumes: Muko candidate URL `https://sketchfab.com/3d-models/astronaut-character-stylized-rigged-free-model-c8daa753952e454eb3c6195446751e88`; Quaternius candidate URL `https://quaternius.com/packs/universalbasecharacters.html`; asset limits in Global Constraints.
- Produces: selected candidate identity plus inspection metadata `{ sourceUrl, creator, license, sourceSha256, sourceNodes, sourceBones, sourceTriangles, sourceMaterials, textureDimensions, animations }`. Task 1 deliberately does not create the stable production GLB or final hash; fitted props, final topology/materials, optimization, renderer draw-call measurement, and production manifest belong to Task 4.

- [ ] **Step 1: Verify the local 3D tool path before downloading**

Run:

```bash
command -v blender || true
pnpm dlx @gltf-transform/cli@4.4.2 --version
```

Expected: record exact versions. If Blender is absent, stop and ask Garvit before installing it; do not use runtime Three.js primitives as a substitute for fitted geometry.

- [ ] **Step 2: Acquire both original candidates into a temporary evidence workspace**

Claude downloads the original archives, records final source URLs, displayed revision/date, creator, license text, and SHA-256 hashes. Reject a candidate immediately if download rights, texture rights, or source provenance cannot be verified.

- [ ] **Step 3: Inspect technical anatomy before modification**

For each candidate, record mesh names/count, triangle count, draw calls, material names, texture paths/dimensions/color space, skeleton/root/bone names, bind pose, animation clips/durations, root scale, bone orientation, and presence of trademarks or third-party patches. Render the unmodified neutral pose once to expose missing textures and visor-sorting defects.

- [ ] **Step 4: Prepare reversible web previews**

Duplicate source files, remove trademark patches, apply only the shared test palette and opaque graphite visor, and preserve the original archive untouched. Do not join skinned meshes or resample animation clips before validating the bind pose.

- [ ] **Step 5: Render the required six-view sheets for both candidates**

Export front three-quarter, profile, 1440 hero crop, 390 mobile crop, light scene, and dark scene using the same neutral camera family and soft-key/cool-fill/rim rig. Label each image with candidate, view, triangles, draw calls, and source/optimized size.

- [ ] **Step 6: Run the model gate checks**

Reject any candidate with an uncanny or game-NPC face, weak silhouette at mobile crop, unusable humanoid rig, floating/grafted accessory requirement, ambiguous rights, >25k triangles after safe cleanup, >30 projected production draw calls, or >1.8 MB after texture-first optimization. Counts below those ceilings are acceptable when the rendered character meets the visual bar.

- [ ] **Step 7: Codex selects on merit and records the decision**

Codex scores silhouette, friendly/default read, crop strength, material response, rig usefulness, fitted-prop feasibility, light/dark parity, and budget. `gate-a-model.md` must name the winner, rejected candidate, evidence, known rig limitations, and either `PASS` or `STOP`.

- [ ] **Step 8: Freeze the selected source record**

Keep the untouched winning source in the approved temporary art workspace for Task 4 and commit only its source manifest, contact-sheet evidence, exact license text, and original SHA-256 under `docs/qa/immersive/`. If Muko wins, record creator, CC-BY text/link, source URL, and planned modification disclosure without adding a public-site credit. Do not write `public/models/guide/guide.glb` yet.

- [ ] **Step 9: Run asset checks**

Run against the staged original and committed manifest:

```bash
shasum -a 256 /private/tmp/garvit-guide-source/selected-source.*
rg -n 'sourceUrl|creator|license|sourceSha256|sourceBones|sourceTriangles|sourceMaterials|textureDimensions|animations' docs/qa/immersive/source-manifests
pnpm typecheck
```

Expected: the original hash matches the selected manifest, ceilings are feasible, and `gate-a-model.md` says PASS.

- [ ] **Step 10: Commit Gate A**

```bash
git add DESIGN.md docs/qa/immersive/model-inspection.md docs/qa/immersive/gate-a-model.md docs/qa/immersive/contact-sheets docs/qa/immersive/source-manifests
git commit -m "assets: select immersive guide model"
```

**STOP:** Do not start Scene 1 until `gate-a-model.md` is PASS.

