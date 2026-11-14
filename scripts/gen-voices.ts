// One-shot script: generates missing Rango voice lines via z-ai TTS.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs'

const OUT = '/home/z/my-project/public/voice'

// NOTE: legacy script — canonical generator is gen_voices_fa.py (edge-tts).
// rHello («سلام هنرمند کوچولو!») and rSaved («نقاشیت ذخیره شد!») were removed
// on purpose; do not re-add them.
const LINES = {
  fa: {
    rReady: 'بریم نقاشی بکشیم!',
    rColor: 'چه رنگ قشنگی!',
    rGood: 'آفرین! عالی شد!',
    rWow: 'وای! چقدر قشنگ!',
    rAnother: 'یه رنگ دیگه!',
  },
  en: {
    rReady: "Let's paint!",
    rColor: 'What a pretty color!',
    rGood: 'Great job!',
    rWow: "Wow! That's amazing!",
    rAnother: 'Another color!',
  },
}

async function main() {
  const { default: ZAI } = await import('z-ai-web-dev-sdk')
  const zai = await ZAI.create()
  for (const lang of ['fa', 'en'] as const) {
    mkdirSync(`${OUT}/${lang}`, { recursive: true })
    for (const [key, text] of Object.entries(LINES[lang])) {
      const mp3 = `${OUT}/${lang}/${key}.mp3`
      if (existsSync(mp3)) continue
      let done = false
      for (let attempt = 0; attempt < 3 && !done; attempt++) {
        try {
          const res = await zai.audio.tts.create({
            input: text,
            voice: 'chuichui',
            speed: 1.0,
            response_format: 'wav',
            stream: false,
          })
          const buf = Buffer.from(new Uint8Array(await res.arrayBuffer()))
          if (buf.length < 1000) throw new Error('empty audio')
          writeFileSync(`/tmp/tts-${lang}-${key}.wav`, buf)
          done = true
          console.log(`wav ok: ${lang}/${key} (${buf.length}b)`)
        } catch (e) {
          console.log(`retry ${lang}/${key}:`, (e as Error).message)
          await new Promise((r) => setTimeout(r, 1500))
        }
      }
      if (done) {
        // convert via ffmpeg
        const { execSync } = await import('child_process')
        try {
          execSync(
            `ffmpeg -y -i /tmp/tts-${lang}-${key}.wav -codec:a libmp3lame -b:a 64k -ac 1 "${mp3}"`,
            { stdio: 'ignore' }
          )
          console.log(`mp3 ok: ${lang}/${key}`)
        } catch {
          console.log(`ffmpeg failed for ${lang}/${key}`)
        }
      }
    }
  }
  // summary
  for (const lang of ['fa', 'en']) {
    for (const key of Object.keys(LINES[lang as 'fa' | 'en'])) {
      const p = `${OUT}/${lang}/${key}.mp3`
      console.log(existsSync(p) ? `OK ${lang}/${key} ${readFileSync(p).length}b` : `MISSING ${lang}/${key}`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
