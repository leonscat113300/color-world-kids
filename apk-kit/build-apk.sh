#!/usr/bin/env bash
# =============================================================================
# Color World Kids (دنیای رنگ‌ها) — one-command offline APK builder
#
#   bash apk-kit/build-apk.sh
#
# Produces: download/color-world-kids.apk  (fully offline — no server needed)
#
# Requirements:
#   - Node.js 18+ (or Bun) — for the Next.js static export
#   - JDK 17+ WITH javac (e.g. Temurin 21) — set JAVA_HOME if needed
#   - Android SDK (Android Studio, or command-line tools)
#     * set ANDROID_HOME, or let the script use ANDROID_SDK_ROOT,
#       or an existing <kit>/android/local.properties
#   - Python 3 with Pillow (optional — regenerates the launcher icons)
# =============================================================================
set -euo pipefail

KIT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$KIT_DIR/.." && pwd)"
cd "$ROOT"

echo "==> Color World Kids APK builder"
echo "    project root : $ROOT"

# ------------------------------------------------------------------ 0. tools
find_pkg_manager() {
  if command -v bun >/dev/null 2>&1; then echo bun
  elif command -v npm >/dev/null 2>&1; then echo npm
  else echo ""; fi
}
PM="$(find_pkg_manager)"
[ -z "$PM" ] && { echo "ERROR: need Node.js (npm) or Bun to build the web app"; exit 1; }
echo "    pkg manager  : $PM"

# use the JDK's bin dir when javac isn't on PATH already
if [ -n "${JAVA_HOME:-}" ] && [ -x "$JAVA_HOME/bin/javac" ]; then
  export PATH="$JAVA_HOME/bin:$PATH"
fi

if command -v javac >/dev/null 2>&1; then
  echo "    javac        : $(javac -version 2>&1)"
else
  echo "ERROR: javac not found — install JDK 17+ (e.g. Temurin 21) and set JAVA_HOME"
  exit 1
fi

# ------------------------------------------------------------------ 1. static export
echo "==> [1/6] Building the web app (static export)"
cp next.config.ts next.config.ts.bak
BAKED=1
restore() {
  [ "${BAKED:-0}" = "1" ] && mv -f next.config.ts.bak next.config.ts 2>/dev/null || true
  [ -d .apk-api-tmp ] && mv .apk-api-tmp src/app/api 2>/dev/null || true
}
trap restore EXIT

cat > next.config.ts <<'EOF'
import type { NextConfig } from "next";

// Temporary static-export config used only for the APK build (apk-kit/build-apk.sh).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};

export default nextConfig;
EOF

if [ -d src/app/api ]; then mv src/app/api .apk-api-tmp; fi
if [ "$PM" = "bun" ]; then bun run build || true; else npm run build || true; fi
[ -f out/index.html ] || { echo "ERROR: static export failed (no out/index.html)"; exit 1; }
restore
BAKED=0
trap - EXIT
echo "    static export ready ($(du -sh out | cut -f1))"

# ------------------------------------------------------------------ 2. web assets
echo "==> [2/6] Refreshing web assets"
mkdir -p "$KIT_DIR/web"
rm -rf "$KIT_DIR/web"/*
cp -r out/* "$KIT_DIR/web/"

# ------------------------------------------------------------------ 3. capacitor deps
# NOTE: the generated Android project references node_modules INSIDE apk-kit,
# so Capacitor packages must be installed here (not in the repo root).
echo "==> [3/6] Installing Capacitor packages (inside apk-kit)"
if [ "$PM" = "bun" ]; then
  (cd "$KIT_DIR" && bun install && bun add @capacitor/core @capacitor/cli @capacitor/android)
else
  (cd "$KIT_DIR" && npm install && npm install @capacitor/core @capacitor/cli @capacitor/android)
fi

# ------------------------------------------------------------------ 4. android project
echo "==> [4/6] Preparing the Android project"
if [ ! -d "$KIT_DIR/android" ]; then
  (cd "$KIT_DIR" && npx cap add android)
fi
(cd "$KIT_DIR" && npx cap sync android)

# native bits: GallerySaver plugin (save/share artwork on the phone) + FileProvider
echo "==> [4b/6] Patching the Android project (GallerySaver plugin + FileProvider)"
python3 "$KIT_DIR/native/patch_android.py" "$KIT_DIR/android"

# launcher icons from the app icon (best effort)
if command -v python3 >/dev/null 2>&1 && python3 -c "import PIL" 2>/dev/null; then
  python3 - "$KIT_DIR" <<'EOF'
import sys
from PIL import Image, ImageDraw
import os
kit = sys.argv[1]
src = Image.open(os.path.join(kit, 'web/icons/icon-512.png')).convert('RGBA')
res = os.path.join(kit, 'android/app/src/main/res')
for dpi, s in {'mdpi':48,'hdpi':72,'xhdpi':96,'xxhdpi':144,'xxxhdpi':192}.items():
    d = os.path.join(res, f'mipmap-{dpi}'); os.makedirs(d, exist_ok=True)
    sq = src.resize((s, s), Image.LANCZOS)
    sq.save(os.path.join(d, 'ic_launcher.png'))
    m = Image.new('L', (s*4, s*4), 0)
    ImageDraw.Draw(m).ellipse((0, 0, s*4, s*4), fill=255)
    m = m.resize((s, s), Image.LANCZOS)
    r = Image.new('RGBA', (s, s), (0, 0, 0, 0)); r.paste(sq, (0, 0), m)
    r.save(os.path.join(d, 'ic_launcher_round.png'))
    fs = int(s * 108 / 72)
    c = Image.new('RGBA', (fs, fs), (0, 0, 0, 0))
    i = src.resize((s, s), Image.LANCZOS)
    c.paste(i, ((fs - s) // 2, (fs - s) // 2), i)
    c.save(os.path.join(d, 'ic_launcher_foreground.png'))
print('    launcher icons regenerated')
EOF
fi

# locate the Android SDK
SDK_DIR="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
if [ -n "$SDK_DIR" ] && [ -d "$SDK_DIR" ]; then
  echo "sdk.dir=$SDK_DIR" > "$KIT_DIR/android/local.properties"
elif [ ! -f "$KIT_DIR/android/local.properties" ]; then
  echo "ERROR: Android SDK not found. Install Android Studio or cmdline-tools,"
  echo "       then run with: ANDROID_HOME=/path/to/sdk bash apk-kit/build-apk.sh"
  exit 1
fi

# ------------------------------------------------------------------ 5. gradle build
echo "==> [5/6] Assembling the debug APK (first run downloads Gradle + dependencies)"
cd "$KIT_DIR/android"
./gradlew assembleDebug --no-daemon
cd "$ROOT"

APK_OUT="$KIT_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
[ -f "$APK_OUT" ] || { echo "ERROR: APK not produced"; exit 1; }

# ------------------------------------------------------------------ 6. deliver
echo "==> [6/6] Copying the APK to download/"
mkdir -p download
cp "$APK_OUT" download/color-world-kids.apk
echo ""
echo "DONE -> $(pwd)/download/color-world-kids.apk ($(du -h download/color-world-kids.apk | cut -f1))"
echo "Install it on any Android 7+ phone (allow 'install unknown apps' when asked)."
