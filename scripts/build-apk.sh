#!/bin/bash
# Full offline-APK pipeline: static web bundle → Capacitor sync → debug APK.
# Requires: Android SDK (ANDROID_HOME) + JDK 17+.
set -e
cd "$(dirname "$0")/.."

# 1) static web bundle (API routes hidden during export)
bash scripts/build-web-apk.sh

# 2) copy web assets + register plugins into the android project
bun x cap sync android

# 3) gradle debug APK
cd android
if [ -z "$ANDROID_HOME" ] && [ -f local.properties ]; then :; fi
./gradlew assembleDebug

APK="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK" ]; then
  mkdir -p ../download
  cp "$APK" "../download/color-world.apk"
  echo "✓ APK → download/color-world.apk"
fi
