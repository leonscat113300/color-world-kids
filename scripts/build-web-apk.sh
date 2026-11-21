#!/bin/bash
# Build the fully-static web bundle for the offline Android APK.
# API routes don't exist in a static export, so they are moved aside for the
# build and restored afterwards (the APK stores artworks in IndexedDB).
set -e
cd "$(dirname "$0")/.."

echo "→ hiding API routes for static export…"
rm -rf .api-tmp
mv src/app/api .api-tmp

restore() {
  if [ -d .api-tmp ] && [ ! -d src/app/api ]; then
    mv .api-tmp src/app/api
  fi
}
trap restore EXIT

echo "→ next build (output: export)…"
NEXT_OUTPUT=export bun x next build

restore
echo "✓ static bundle ready in ./out"
