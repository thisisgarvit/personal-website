# Gate A candidate inspection

Status: technical evidence complete; Codex selected Muko and released Gate A.

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
- Reversible evidence changes: source files remain untouched; the contact-sheet renderer lowers the arms through pose bones only and recolors the loaded base-color image in memory (graphite visor region, release-blue collar accents). No geometry, topology, UV, or animation data is altered.
- Root scale: the glTF resolves a baked 0.01 FBX conversion matrix; resulting world bounds are ≈6.40 m tall. Production integration must rescale to scene units (the evidence camera frames relative to measured bounds, so renders are scale-neutral).
- Attribution caveat: the downloaded license asks for author credit. If selected, Garvit's approved product policy is repository-only attribution; preserve the exact license/creator/source/revision/hash/modification record.

## Quaternius

- Official page and included `License_Standard.txt` identify Quaternius and dedicate the Standard archive under CC0 1.0. Archive SHA-256: `fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40`.
- The free archive is 128,968,391 bytes and contains only Superhero male/female bases. The brief's Regular/Teen masculine models and rigged `.blend` sources are available only in the paid Source tier. The rendered candidate is therefore the closest freely downloadable masculine base, not the exact specified proportion.
- Anatomy: 69 nodes, three skinned meshes/materials, 65 joints, 14,318 triangles, no animation clips. Required hips/spine/neck/head/arm/hand semantics exist.
- Official glTF defect: two normal-map URIs contain an extra `_png` suffix absent from the archive. Unmodified `gltf-transform inspect` fails with `ENOENT`. The staged preview copied the supplied images to the referenced names; the untouched archive remains unchanged.
- Textures are 2048² except 256² eyes. Safe 512–1024px texture-first optimization is technically feasible.
- No visible trademark patch. The free mesh is a realistic-faced, minimally outfitted superhero mannequin; helmet, visor, headset, pager, and clothing silhouette would require substantially more authored geometry than Muko.
- Reversible evidence changes: missing URI aliases only in staging, arms lowered through pose bones only, and a release-blue in-memory recolor of the briefs. No geometry, topology, UV, or animation data is altered.
- Root scale: identity at the armature root; world bounds ≈1.82 m tall in T-pose.

## Render evidence

Every file name is the image label; this table supplies the required candidate/view/measurement caption. Source/temporary-preview sizes are 7,001,981 bytes / 287,236 bytes for Muko and 128,968,391 bytes / 372,572 bytes for Quaternius. Muko uses 11,458 triangles / one source primitive; Quaternius uses 14,318 triangles / three source primitives.

| View | Muko | Quaternius |
|---|---|---|
| Unmodified neutral source | `contact-sheets/muko-neutral-source.png` | `contact-sheets/quaternius-neutral-source.png` |
| Front three-quarter (1080×1440) | `contact-sheets/muko-front34.png` | `contact-sheets/quaternius-front34.png` |
| Profile (1080×1440) | `contact-sheets/muko-profile.png` | `contact-sheets/quaternius-profile.png` |
| 1440×900 hero crop | `contact-sheets/muko-hero1440.png` | `contact-sheets/quaternius-hero1440.png` |
| 390×844 mobile crop | `contact-sheets/muko-mobile390.png` | `contact-sheets/quaternius-mobile390.png` |
| Light scene (1080×1350) | `contact-sheets/muko-light.png` | `contact-sheets/quaternius-light.png` |
| Dark scene (1080×1350) | `contact-sheets/muko-dark.png` | `contact-sheets/quaternius-dark.png` |

The six comparison views use one camera family (identical distance/target/lens multipliers relative to each character's measured bounds) and one lighting rig: large soft warm key, broad cool fill, narrow cool rim strip, and a grounded soft contact shadow on a background-matched floor. Light scene background is `#EDF0EB`; dark scene background is `#101319`. The hero1440 view places the character in the right ~45% of a 1440×900 frame with a deliberate 40–50% lower-body crop; mobile390 is an upper-torso crop at 390×844. The extra neutral-source view documents each unmodified material read before the reversible test pose/palette.

Web-preview fairness modifications (the only changes applied; all in-memory and reversible; no re-topology, no mesh joining, no animation resampling):

- Muko: pose-bone arm lowering to a neutral A-pose (upper arms +55° local X, +12° forearm), opaque graphite recolor of the teal visor UV region, and release-blue `#3F49E8` recolor of the existing indigo collar accents (one clothing element; boot accents left at their original color).
- Quaternius: pose-bone arm lowering to the matching A-pose (upper arms ∓52° local Z, ∓10° forearm) and release-blue `#3F49E8` recolor of the briefs, its only clothing element. No visor exists to receive the graphite treatment; helmet/visor architecture would be new authored geometry in Task 4.

Render observations:

- Muko reads as the target silhouette out of the box: helmeted large graphic head, opaque visor after the graphite preview, friendly proportions at hero and mobile crops, readable volume on both `#EDF0EB` and `#101319`. At extreme profile the visor inset shows a narrow white rim seam; front and three-quarter views are clean.
- Quaternius at hero/mobile crop reads as a realistic game-NPC face (fixed stare, pale eyebrows) and is effectively unclothed; the silhouette carries no metaverse-agent vocabulary without a full authored outfit.

## Technical gate observations

- Both candidates are below the 25k triangle ceiling and have complete humanoid joints for procedural posing.
- Temporary optimization proves sub-1.8MB feasibility, but neither temporary GLB is production-authoritative or committed.
- Final fitted-prop topology, 512–1024px atlas choice, exact production hash, and R3F renderer draw calls remain Task 4 work.
- Quaternius cannot be considered the exact requested Regular/Teen fallback without purchasing the Source tier or amending the candidate to Superhero Male.

## Projected production feasibility vs ceilings

- Muko: **feasible with headroom.** 11,458 of ≤25,000 triangles (46%) before Task 4 prop fitting; 1 material/1 primitive projects far below ≤30 production draw calls even after fitted headset/pager modules; 287 KB meshopt+WebP-1024 dry run against ≤1.8 MB leaves ~1.5 MB headroom; single 2048² texture set downsamples cleanly into the 512–1024px window (one atlas already).
- Quaternius: **feasible on raw numbers, expensive on authoring.** 14,318 of ≤25,000 triangles (57%) before any clothing/helmet geometry is added; 3 materials/3 primitives still projects below ≤30 draw calls; 373 KB dry run against ≤1.8 MB; textures downsample into the window but hair/eye maps would need atlas consolidation. The budget risk is indirect: every art-direction requirement (helmet, visor, suit, hardware) is new geometry and texture work on top of these counts.

## Appendix: full skeleton bone lists

Muko (58 joints, Mixamo naming; root `_rootJoint`) — semantic bones marked:

`_rootJoint` (root), `mixamorig:Hips_01` (hips), `mixamorig:Spine_02` (spine), `mixamorig:Spine1_03` (spine1), `mixamorig:Spine2_04` (chest), `mixamorig:Neck_00` (neck), `mixamorig:Head_05` (head), `mixamorig:HeadTop_End_06`, `mixamorig:LeftShoulder_07`, `mixamorig:LeftArm_08` (left upper arm), `mixamorig:LeftForeArm_09` (left forearm), `mixamorig:LeftHand_010` (left hand), left thumb/index/middle/ring chains `LeftHandThumb1–4`, `LeftHandIndex1–4`, `LeftHandMiddle1–4`, `LeftHandRing1–4` (no pinky chain), `mixamorig:RightShoulder_027`, `mixamorig:RightArm_028` (right upper arm), `mixamorig:RightForeArm_029` (right forearm), `mixamorig:RightHand_030` (right hand), right thumb/index/middle/ring chains `RightHandThumb1–4`, `RightHandIndex1–4`, `RightHandMiddle1–4`, `RightHandRing1–4` (no pinky chain), `mixamorig:LeftUpLeg_047`, `mixamorig:LeftLeg_048`, `mixamorig:LeftFoot_049`, `mixamorig:LeftToeBase_050`, `mixamorig:LeftToe_End_051`, `mixamorig:RightUpLeg_052`, `mixamorig:RightLeg_053`, `mixamorig:RightFoot_054`, `mixamorig:RightToeBase_055`, `mixamorig:RightToe_End_056`.

All required semantics present: root, hips, spine, chest (`Spine2`), neck, head, both upper arms, forearms, hands. Note: four-finger hands (no pinky).

Quaternius Superhero_Male (65 joints, UE-mannequin naming) — semantic bones marked:

`root` (root), `pelvis` (hips), `spine_01` (spine), `spine_02`, `spine_03` (chest), `neck_01` (neck), `Head` (head), `clavicle_l`, `upperarm_l` (left upper arm), `lowerarm_l` (left forearm), `hand_l` (left hand), full five-finger left chains `thumb_01–04_leaf_l`, `index_01–04_leaf_l`, `middle_01–04_leaf_l`, `ring_01–04_leaf_l`, `pinky_01–04_leaf_l`, `clavicle_r`, `upperarm_r` (right upper arm), `lowerarm_r` (right forearm), `hand_r` (right hand), matching right finger chains, `thigh_l`, `calf_l`, `foot_l`, `ball_l`, `ball_leaf_l`, `thigh_r`, `calf_r`, `foot_r`, `ball_r`, `ball_leaf_r`.

All required semantics present: root, hips, spine, chest (`spine_03`), neck, head, both upper arms, forearms, hands. Five-finger hands with leaf tips.
