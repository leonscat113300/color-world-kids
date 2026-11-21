#!/usr/bin/env python3
"""Generate real voice lines for Rango using edge-tts.

Persian: fa-IR-FaridNeural (male) — lines written in colloquial (محاوره‌ای) spelling
with diacritics so the TTS reads them naturally, like a real person talking.
English: en-US-AnaNeural (real child voice) — sounds like a kid, not a robot.
Lines are intentionally SHORT & punchy so kids don't lose attention.
Output: public/voice/<lang>/<key>.mp3  (24 kHz mono mp3)
"""
import asyncio
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "voice"
OUT.mkdir(parents=True, exist_ok=True)

LANGS = {
    "fa": {
        "voice": "fa-IR-FaridNeural",
        "rate": "+6%",
        "pitch": "+6Hz",
        # colloquial Persian, written phonetically with diacritics for natural speech
        "lines": {
            "rReady": "بِریم نَقّاشی بِکِشیم!",
            "rColor": "چه رَنگِ قَشَنگی!",
            "rGood": "آفَرین! عالی شُد!",
            "rWow": "وای! چِقَدِر قَشَنگ!",
            "rAnother": "یِه رَنگِ دیگِه!",
            "rPick": "یِه نَقّاشی اِنتِخاب کُن!",
            "rStar": "آفَرین! یِه سِتارِه گِرِفتی!",
        },
    },
    "en": {
        "voice": "en-US-AnaNeural",
        "rate": "+8%",
        "pitch": "+0Hz",
        "lines": {
            "rReady": "Let's paint!",
            "rColor": "What a pretty color!",
            "rGood": "Great job!",
            "rWow": "Wow! That's amazing!",
            "rAnother": "Another color!",
            "rPick": "Pick a drawing!",
            "rStar": "Yay! A new star!",
        },
    },
}


async def gen(lang: str, key: str, text: str) -> None:
    cfg = LANGS[lang]
    dest_dir = OUT / lang
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / f"{key}.mp3"
    tmp = dest.with_suffix(".tmp.mp3")
    communicate = edge_tts.Communicate(text, cfg["voice"], rate=cfg["rate"], pitch=cfg["pitch"])
    await communicate.save(str(tmp))
    # trim tiny silence edges and normalize loudness for consistent playback
    subprocess.run(
        [
            "ffmpeg", "-y", "-v", "error", "-i", str(tmp),
            "-af", "silenceremove=start_periods=1:start_threshold=-45dB,loudnorm=I=-16:TP=-1.5:LRA=11",
            "-b:a", "64k", str(dest),
        ],
        check=True,
    )
    tmp.unlink(missing_ok=True)
    print(f"OK {lang}/{key}.mp3")


async def main() -> None:
    spec = sys.argv[1:] or ["fa", "en"]
    for spec_item in spec:
        lang, _, key = spec_item.partition(":")
        if lang not in LANGS:
            continue
        keys = [key] if key else list(LANGS[lang]["lines"])
        for k in keys:
            await gen(lang, k, LANGS[lang]["lines"][k])


if __name__ == "__main__":
    asyncio.run(main())
