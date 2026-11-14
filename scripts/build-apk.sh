#!/bin/bash
# Build a fully-offline LOCALIZED APK: static web bundle → Capacitor sync → debug APK.
#
# Usage:  bash scripts/build-apk.sh [fa|en]
#   fa (default) → download/color-world-fa.apk   «دنیای رنگ‌ها» — فارسی، مخصوص ایران
#   en           → download/color-world-en.apk   Color World Kids — English, international
#
# The two APKs differ in:
#   • baked-in default language (no language chooser — the app opens ready)
#   • launcher/app name shown on the phone
#   • applicationId for the English build (…en) so both can sit side by side;
#     the Persian build keeps the original id so it updates in place and keeps
#     the saved drawings.
#
# Requires: Android SDK (ANDROID_HOME or android/local.properties) + JDK 17+.
set -e
cd "$(dirname "$0")/.."

L="${1:-fa}"
case "$L" in
  fa)
    APP_NAME='دنیای رنگ‌ها'
    APP_ID='com.candyteam.colorworld'
    ;;
  en)
    APP_NAME='Color World Kids'
    APP_ID='com.candyteam.colorworld.en'
    ;;
  *)
    echo "usage: bash scripts/build-apk.sh [fa|en]" >&2
    exit 1
    ;;
esac

STRINGS="android/app/src/main/res/values/strings.xml"
GRADLE="android/app/build.gradle"

# put the neutral values back so the git sources stay clean
restore() {
  sed -i 's|<string name="app_name">.*</string>|<string name="app_name">دنیای رنگ‌ها</string>|' "$STRINGS"
  sed -i 's|<string name="title_activity_main">.*</string>|<string name="title_activity_main">دنیای رنگ‌ها</string>|' "$STRINGS"
  sed -i 's|applicationId ".*"|applicationId "com.candyteam.colorworld"|' "$GRADLE"
}
trap restore EXIT

echo "→ building ${L} APK (${APP_NAME} / ${APP_ID})…"

# 1) static web bundle with the baked-in default language
NEXT_PUBLIC_DEFAULT_LANG="$L" bash scripts/build-web-apk.sh

# 2) copy web assets + register plugins into the android project
bun x cap sync android

# 3) localize the launcher/app name + application id for THIS build
sed -i "s|<string name=\"app_name\">.*</string>|<string name=\"app_name\">${APP_NAME}</string>|" "$STRINGS"
sed -i "s|<string name=\"title_activity_main\">.*</string>|<string name=\"title_activity_main\">${APP_NAME}</string>|" "$STRINGS"
sed -i "s|applicationId \".*\"|applicationId \"${APP_ID}\"|" "$GRADLE"

# 4) gradle debug APK
( cd android && ./gradlew assembleDebug )

APK="android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK" ]; then
  mkdir -p download
  cp "$APK" "download/color-world-${L}.apk"
  echo "✓ APK → download/color-world-${L}.apk  (${APP_NAME})"
else
  echo "✗ APK not found at $APK" >&2
  exit 1
fi
