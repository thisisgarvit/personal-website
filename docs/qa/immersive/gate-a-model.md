# Gate A — guide model selection

**Status:** PASS  
**Judge:** Codex  
**Selected source:** Muko_Art, *Astronaut character stylized rigged free model*  
**Rejected fallback:** Quaternius, *Universal Base Characters — Superhero Male*

## Decision

Muko advances to production adaptation. It is the only candidate that already
reads as the required abstract metaverse guide in the actual hero and mobile
crops: the helmet supplies a large graphic head, the opaque visor removes the
uncanny-face problem, the existing suit accepts the product palette, and the
chest/belt architecture gives the milestone hardware a credible attachment
point. It looks like a character with a role, not a dressed-up avatar.

This PASS selects a source mesh. It does **not** approve the contact-sheet
material treatment as final art, publish a production GLB, or waive the Task 4
renderer, asset-budget, pose, poster, and fitted-prop gates.

## Scored comparison

Scores use a 1–5 scale, where 5 means the candidate satisfies the criterion
with little structural invention and 1 means it conflicts with the direction.

| Criterion | Muko | Quaternius | Judgment |
|---|---:|---:|---|
| Silhouette | 5 | 2 | Muko's helmet and compact outfitted body read immediately; Quaternius is a generic anatomical base. |
| Friendly/default read | 4 | 1 | Muko is abstract and approachable; Quaternius's realistic fixed face triggers the uncanny/game-NPC rejection. |
| Hero/mobile crop strength | 5 | 2 | Muko keeps its identity at both crops; Quaternius becomes a cropped torso and face with no product-world signal. |
| Material response | 4 | 3 | Muko's visor, shell, and collar accents separate cleanly; both candidates still need production material tuning. |
| Rig usefulness | 4 | 4 | Both expose the required humanoid semantics; neither supplies authored motion. |
| Fitted-prop feasibility | 5 | 1 | Muko already has helmet, collar, chest, and belt attachment logic; Quaternius requires a new outfit and helmet. |
| Light/dark parity | 4 | 2 | Muko keeps readable volume in both scenes; dark-mode rim/visor separation still needs deliberate tuning. |
| Budget headroom | 5 | 5 | Both clear the raw ceilings; Muko starts lower and avoids the geometry cost of inventing the whole silhouette. |
| **Total / 40** | **36** | **20** | **Muko wins on rendered merit and lower art-direction risk.** |

## Evidence

- Technical comparison: [`model-inspection.md`](./model-inspection.md)
- Frozen source metadata: [`source-manifests/muko.json`](./source-manifests/muko.json)
- Exact source license notice: [`source-manifests/muko-LICENSE.txt`](./source-manifests/muko-LICENSE.txt)
- Muko hero crop: [`contact-sheets/muko-hero1440.png`](./contact-sheets/muko-hero1440.png)
- Muko mobile crop: [`contact-sheets/muko-mobile390.png`](./contact-sheets/muko-mobile390.png)
- Muko light/dark reads: [`contact-sheets/muko-light.png`](./contact-sheets/muko-light.png), [`contact-sheets/muko-dark.png`](./contact-sheets/muko-dark.png)
- Rejected-candidate hero/mobile evidence: [`contact-sheets/quaternius-hero1440.png`](./contact-sheets/quaternius-hero1440.png), [`contact-sheets/quaternius-mobile390.png`](./contact-sheets/quaternius-mobile390.png)

## Rejection record — Quaternius

The freely available archive does not contain the Regular/Teen model named in
the original fallback; it supplies the Superhero base instead. That render has
a realistic fixed face and effectively unclothed silhouette, triggering two
explicit Gate A rejection conditions: uncanny/game-NPC read and a requirement
for grafted replacement architecture. Its sound rig and acceptable raw budget
do not compensate for rebuilding the character's entire visual identity.

## Task 4 obligations carried forward

- Normalize the baked 0.01 conversion hierarchy to the world scene's authored
  units without breaking skinning.
- Build all required gestures procedurally; the source contains only a
  zero-duration bind-pose clip.
- Resolve the thin white visor-rim seam visible at extreme profile.
- Author the final opaque graphite visor, porcelain shell, release-blue
  underlayer, and fitted coral milestone hardware. Headset and pager must read
  as integrated parts of the suit, never floating or runtime-grafted props.
- Tune a friendly default pose and legible wave, board-guide, drag-watch,
  milestone/pager, celebration, and resolution reactions at the real crops.
- Preserve dark-scene silhouette separation with authored rim and material
  response; do not rely on exposure alone.
- Produce and measure the final local GLB: no more than 25k triangles, 30 R3F
  renderer draw calls, 1.8 MB transferred, and 512–1024px textures.
- Preserve creator, source URL, CC-BY-4.0 text, original/final hashes, and the
  modification record in the repository. Per Garvit's product decision, no
  visible site credit is required.

Gate A is released. Scene 1 may begin from this selected source; the public
homepage remains blocked until the later composition and world gates pass.
