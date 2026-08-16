# Gate A candidate inspection

Status: technical evidence complete; visual selection is intentionally pending Codex.

## Toolchain

- Blender 5.2.0 LTS, hash `fbe6228777e7`.
- `@gltf-transform/cli` 4.4.2.
- Shared checkout: `/Users/garvits/Documents/Side-Projects/Garvit-Portfolio-July`.
- Untouched/staged binaries: `/private/tmp/garvit-guide-source/`; no source archive or production GLB is committed.

## Candidate comparison

| Measurement | Muko | Quaternius Standard |
|---|---:|---:|
| License | CC-BY-4.0 | CC0-1.0 |
| Source triangles | 11,458 | 14,318 |
| Source mesh/material primitives | 1 / 1 | 3 / 3 |
| Source primitive draw-call proxy | 1 | 3 |
| Rig | 58-joint Mixamo hierarchy | 65-joint humanoid hierarchy |
| Clips | one 0-second bind-pose clip | none |
| Source textures | 3 × 2048² | 5 × 2048² plus 2 × 256² |
| Temporary preview GLB | 287,236 bytes | 372,572 bytes |
| Silhouette read before judgment | helmeted, large graphic visor, outfitted | realistic-faced superhero mannequin |

The source primitive count is inspection evidence, not the final ≤30 production-renderer draw-call measurement. Task 4 owns the fitted/optimized production GLB and R3F measurement.

## Muko

- Official package metadata embeds the title, creator `Muko_Art`, canonical Sketchfab URL, and CC-BY-4.0 license.
- Package file-set size: 7,001,981 bytes. `scene.gltf` SHA-256 is `0de174a9a2458b70d7a234e18910f16514c0f74f9a11e67d50908d8d10ddb6ff`; all component hashes are frozen in `source-manifests/muko.json`.
- Anatomy: 66 nodes, one skinned mesh, one material, 58 joints, 11,458 triangles. Required hips/spine/neck/head/upper-arm/forearm/hand semantics exist.
- The `mixamo.com` animation has 41 one-keyframe channels and zero duration. The rig is poseable, but there is no reusable authored motion clip.
- Textures: base color, combined metallic/roughness/occlusion, and normal, each 2048². Material is opaque and double-sided; no visor alpha-sorting defect appeared.
- No visible trademark patch. The source already contains helmet, visor, belt/chest modules, and suit topology, reducing grafted-prop risk.
- Reversible evidence changes: source files remain untouched; Blender clears the zero-duration action, lowers arms into a neutral pose, normalizes height, and remaps the existing texture through graphite/release-blue/porcelain test colors in-memory only.
- Attribution caveat: the downloaded license asks for author credit. If selected, Garvit's approved product policy is repository-only attribution; preserve the exact license/creator/source/revision/hash/modification record.

## Quaternius

- Official page and included `License_Standard.txt` identify Quaternius and dedicate the Standard archive under CC0 1.0. Archive SHA-256: `fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40`.
- The free archive is 128,968,391 bytes and contains only Superhero male/female bases. The brief's Regular/Teen masculine models and rigged `.blend` sources are available only in the paid Source tier. The rendered candidate is therefore the closest freely downloadable masculine base, not the exact specified proportion.
- Anatomy: 69 nodes, three skinned meshes/materials, 65 joints, 14,318 triangles, no animation clips. Required hips/spine/neck/head/arm/hand semantics exist.
- Official glTF defect: two normal-map URIs contain an extra `_png` suffix absent from the archive. Unmodified `gltf-transform inspect` fails with `ENOENT`. The staged preview copied the supplied images to the referenced names; the untouched archive remains unchanged.
- Textures are 2048² except 256² eyes. Safe 512–1024px texture-first optimization is technically feasible.
- No visible trademark patch. The free mesh is a realistic-faced, minimally outfitted superhero mannequin; helmet, visor, headset, pager, and clothing silhouette would require substantially more authored geometry than Muko.
- Reversible evidence changes: missing URI aliases only in staging, arms lowered through the rig, and a solid release-blue/graphite test palette applied in-memory.

## Render evidence

Every file name is the image label; this table supplies the required candidate/view/measurement caption. Source/temporary-preview sizes are 7,001,981 bytes / 287,236 bytes for Muko and 128,968,391 bytes / 372,572 bytes for Quaternius. Muko uses 11,458 triangles / one source primitive; Quaternius uses 14,318 triangles / three source primitives.

| View | Muko | Quaternius |
|---|---|---|
| Unmodified neutral source | `contact-sheets/muko-neutral-source.png` | `contact-sheets/quaternius-neutral-source.png` |
| Front three-quarter | `contact-sheets/muko-front-three-quarter.png` | `contact-sheets/quaternius-front-three-quarter.png` |
| Profile | `contact-sheets/muko-profile.png` | `contact-sheets/quaternius-profile.png` |
| 1440×900 hero crop | `contact-sheets/muko-hero-1440.png` | `contact-sheets/quaternius-hero-1440.png` |
| 390×844 mobile crop | `contact-sheets/muko-mobile-390.png` | `contact-sheets/quaternius-mobile-390.png` |
| Light scene | `contact-sheets/muko-light.png` | `contact-sheets/quaternius-light.png` |
| Dark scene | `contact-sheets/muko-dark.png` | `contact-sheets/quaternius-dark.png` |

The six comparison views use the same camera family and soft-key/cool-fill/coral-rim rig. The extra neutral-source view documents each unmodified material read before the reversible test pose/palette.

## Technical gate observations

- Both candidates are below the 25k triangle ceiling and have complete humanoid joints for procedural posing.
- Temporary optimization proves sub-1.8MB feasibility, but neither temporary GLB is production-authoritative or committed.
- Final fitted-prop topology, 512–1024px atlas choice, exact production hash, and R3F renderer draw calls remain Task 4 work.
- Quaternius cannot be considered the exact requested Regular/Teen fallback without purchasing the Source tier or amending the candidate to Superhero Male.
