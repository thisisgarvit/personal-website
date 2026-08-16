# Task 1 acquisition and inspection report

Status: Gate A evidence complete; Codex selected Muko with a 36/40 PASS.

Base: `4364525` in `/Users/garvits/Documents/Side-Projects/Garvit-Portfolio-July`.

## Gate A decision

Codex selected Muko_Art's *Astronaut character stylized rigged free model* at 36/40 and rejected the free Quaternius Superhero Male fallback at 20/40. This is source selection only: final material treatment, fitted hardware, procedural reactions, scale normalization, renderer draw calls, transfer size, posters, and production GLB approval remain Task 4 gates.

## Commands and versions

```text
/opt/homebrew/bin/blender --version
Blender 5.2.0 LTS · fbe6228777e7

pnpm dlx @gltf-transform/cli@4.4.2 --version
4.4.2

pnpm dlx @gltf-transform/cli@4.4.2 inspect <candidate.gltf> --format md
/opt/homebrew/bin/blender --background --python /private/tmp/garvit-guide-source/{muko,quaternius}/render_*.py
shasum -a 256 <source and preview files>
pnpm typecheck
```

Quaternius was downloaded through the official itch.io zero-price Standard upload ID `15861669`. The 600MB Source tier is paid and was not acquired. Muko's extracted official Sketchfab package was found under `/private/tmp/garvit-guide-source/muko/`; its embedded asset extras and `license.txt` match the locked canonical source.

## Rights and hashes

- Muko: Muko_Art, CC-BY-4.0, canonical model `c8daa753952e454eb3c6195446751e88`. Package metadata lacks a revision/date, so all five source component hashes are the immutable revision record; see `docs/qa/immersive/source-manifests/muko.json`.
- Quaternius: CC0-1.0, official August 2025 pack; Standard upload dated 2025-12-16. Archive SHA-256 `fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40`.
- No source archive or candidate GLB was copied into the repository. Temporary preview GLBs stay under `/private/tmp/garvit-guide-source/optim/`.
- `/private/tmp/garvit-guide-source/selected-source.gltf` is the canonical selected-original alias to the untouched Muko `scene.gltf`. The exact Step 9 glob hashes it to `0de174a9a2458b70d7a234e18910f16514c0f74f9a11e67d50908d8d10ddb6ff`, matching `muko.json.sourceSha256`.

## Measurements

- Muko: 66 nodes, 58 joints, one mesh/material/primitive, 11,458 triangles, three 2048² textures, one zero-duration bind-pose animation. Source file set 7,001,981 bytes. Temporary preview 287,236 bytes.
- Quaternius Superhero Male: 69 nodes, 65 joints, three meshes/materials/primitives, 14,318 triangles, five 2048² and two 256² textures, no animation. Standard archive 128,968,391 bytes. Temporary preview 372,572 bytes.
- Production R3F draw calls were not obtainable in Task 1 because no production GLB/canvas exists; source primitive counts are recorded as proxies and Task 4 owns the renderer measurement.

## Render outputs

Seven PNGs per candidate are in `docs/qa/immersive/contact-sheets/`: one unmodified neutral source read plus front-three-quarter, profile, 1440 hero, 390 mobile, light, and dark test-palette views. The 12 required comparison PNGs now carry an in-image evidence strip with candidate, view, triangles, source primitive/draw-call proxy, source bytes, and optimized dry-run bytes. Their dimensions and crops are unchanged; neutral-source images remain unlabelled source reads. `model-inspection.md` remains the evidence index.

## Checks and concerns

- `gltf-transform inspect` passes for Muko.
- Unmodified Quaternius inspect fails because two official normal-map URIs reference missing `_png` filenames; staging aliases repair it without changing the archive, after which inspection and Blender import pass.
- Both rigs contain the semantic bones needed by the planned adapter.
- Muko is already an outfitted, helmeted field-agent species. Quaternius free Standard is a realistic-faced superhero mannequin and requires substantially more silhouette work.
- Quaternius Regular/Teen is not in the free archive. This is a decision-context blocker, not hidden as successful acquisition.
- Codex recorded Muko as the 36/40 winner and Gate A as PASS. The exact source-license record remains in `docs/qa/immersive/source-manifests/muko-LICENSE.txt`; attribution placement follows Garvit's recorded product ruling.
