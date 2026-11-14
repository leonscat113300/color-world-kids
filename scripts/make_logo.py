#!/usr/bin/env python3
"""
Regenerate the Color World Kids brand assets from the painter artwork.

Source: the cheerful painter illustration (purple beret, palette, easel).
The source is a flat RGB webp with opaque BLACK corners, so we rebuild the
rounded-corner look ourselves:

  - public/logo.webp               rounded card, transparent corners (intro/logo)
  - public/logo.svg                thin SVG wrapper around logo.webp
  - public/icons/icon-192.png      flattened on the brand sky-blue (#78C8F8)
  - public/icons/icon-512.png      flattened on the brand sky-blue
  - public/icons/icon-maskable-512.png  content at 72% inside the safe zone

Usage:  python3 scripts/make_logo.py [source-image]
"""
import sys
from PIL import Image, ImageDraw

ROOT = "/home/z/my-project"
SRC = sys.argv[1] if len(sys.argv) > 1 else f"{ROOT}/upload/Coloring Day with a Cheerful Painter.webp"
PUB = f"{ROOT}/public"

BRAND_BLUE = (120, 200, 248, 255)  # #78C8F8 — same as the app theme color

src = Image.open(SRC).convert("RGBA")
w, h = src.size
if w != h:
    side = min(w, h)
    src = src.crop(((w - side) // 2, (h - side) // 2, (w + side) // 2, (h + side) // 2))
    w = h = side

# --- rounded-corner mask (radius slightly generous so the black corners go) ---
r = int(w * 0.205)
big = w * 2
mask = Image.new("L", (big, big), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, big - 1, big - 1), radius=r * 2, fill=255)
mask = mask.resize((w, w), Image.LANCZOS)

card = Image.new("RGBA", src.size, (0, 0, 0, 0))
card.paste(src, (0, 0), mask)

# --- 1) logo.webp (transparent corners, blends on any background) ---
card.resize((1024, 1024), Image.LANCZOS).save(f"{PUB}/logo.webp", "WEBP", quality=92)

# --- 2) square icons flattened on brand blue ---
flat = Image.alpha_composite(Image.new("RGBA", src.size, BRAND_BLUE), card)
flat.resize((512, 512), Image.LANCZOS).save(f"{PUB}/icons/icon-512.png")
flat.resize((192, 192), Image.LANCZOS).save(f"{PUB}/icons/icon-192.png")

# --- 3) maskable icon: content inside the ~40% safe zone ---
canvas = Image.new("RGBA", (1024, 1024), BRAND_BLUE)
inner = flat.resize((736, 736), Image.LANCZOS)
canvas.paste(inner, ((1024 - 736) // 2, (1024 - 736) // 2), inner)
canvas.resize((512, 512), Image.LANCZOS).save(f"{PUB}/icons/icon-maskable-512.png")

# --- 4) logo.svg wrapper (file kept for backwards compatibility) ---
with open(f"{PUB}/logo.svg", "w") as f:
    f.write(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">'
        '<image width="1024" height="1024" href="/logo.webp"/></svg>'
    )

print("logo assets regenerated:",
      "logo.webp, logo.svg, icons/icon-192.png, icons/icon-512.png, icons/icon-maskable-512.png")
