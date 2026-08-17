#!/usr/bin/env bash
# Gate C: generate 0.25x slowed review copies of the normal-speed
# interaction recordings (same frames, quarter playback speed) with
# ffmpeg setpts. Run after scripts/gate-c-interaction-matrix.mjs.
set -euo pipefail
cd "$(dirname "$0")/../docs/qa/immersive/gate-c"
for name in look-tracking wave-settle scene-target-interrupt \
  reaction-sequence ship-mid-wave-interrupt; do
  src="${name}-normal.webm"
  out="${name}-0.25x.webm"
  [ -f "$src" ] || { echo "missing $src" >&2; exit 1; }
  ffmpeg -y -loglevel error -i "$src" -filter:v "setpts=4*PTS" -an "$out"
  echo "wrote $out"
done
