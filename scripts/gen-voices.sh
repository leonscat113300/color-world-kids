#!/bin/bash
# Generates Rango voice lines (fa + en) via z-ai TTS, converts to mp3.
set -u
cd /home/z/my-project
OUT="/home/z/my-project/public/voice"
mkdir -p "$OUT/fa" "$OUT/en"
TMP=$(mktemp -d)

# NOTE: legacy script — canonical generator is gen_voices_fa.py (edge-tts).
# rHello («سلام هنرمند کوچولو!») and rSaved («نقاشیت ذخیره شد!») were removed
# on purpose; do not re-add them.
declare -A FA=(
  [rReady]="بریم نقاشی بکشیم!"
  [rColor]="چه رنگ قشنگی!"
  [rGood]="آفرین! عالی شد!"
  [rWow]="وای! چقدر قشنگ!"
  [rAnother]="یه رنگ دیگه!"
)
declare -A EN=(
  [rReady]="Let's paint!"
  [rColor]="What a pretty color!"
  [rGood]="Great job!"
  [rWow]="Wow! That's amazing!"
  [rAnother]="Another color!"
)

gen() {
  local key="$1" text="$2" lang="$3"
  local wav="$TMP/${lang}_${key}.wav"
  if [ -f "$OUT/$lang/$key.mp3" ]; then echo "skip $lang/$key"; return; fi
  if z-ai tts -i "$text" -o "$wav" --voice chuichui >/dev/null 2>&1; then
    ffmpeg -y -i "$wav" -codec:a libmp3lame -b:a 64k -ac 1 "$OUT/$lang/$key.mp3" >/dev/null 2>&1 \
      && echo "ok  $lang/$key" || { cp "$wav" "$OUT/$lang/$key.wav"; echo "wav-fallback $lang/$key"; }
  else
    echo "FAIL $lang/$key"
  fi
}

for k in "${!FA[@]}"; do gen "$k" "${FA[$k]}" "fa"; done
for k in "${!EN[@]}"; do gen "$k" "${EN[$k]}" "en"; done

rm -rf "$TMP"
echo "=== done ==="
ls -la "$OUT/fa" "$OUT/en"
