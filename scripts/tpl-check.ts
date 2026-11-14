import { GEN_TEMPLATES } from '../src/lib/templates-gen'
const cats = ['animals','vehicles','magic','nature','food','stickman','shapes']
const counts: Record<string, number> = {}
const ids = new Set<string>()
let bad = 0
for (const t of GEN_TEMPLATES) {
  counts[t.category] = (counts[t.category] ?? 0) + 1
  if (ids.has(t.id)) { console.log('DUP ID', t.id); bad++ }
  ids.add(t.id)
  if (/NaN|undefined|Infinity/.test(t.svg)) { console.log('BAD SVG', t.id); bad++ }
  if (!t.svg.includes('viewBox="0 0 512 512"')) { console.log('NO VIEWBOX', t.id); bad++ }
  if (!/#FFFFFF/.test(t.svg)) { console.log('NO WHITE REGION', t.id); bad++ }
}
console.log(counts, 'total', GEN_TEMPLATES.length)
for (const c of cats) if (counts[c] !== 100) { console.log('COUNT FAIL', c, counts[c]); bad++ }
if (bad > 0) process.exit(1)
console.log('ALL OK')
