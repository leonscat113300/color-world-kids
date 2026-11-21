import { ColoringTemplate } from './template-types'
import { CORE_TEMPLATES } from './templates-core'
import { EXTRA_TEMPLATES } from './templates-extra'
import { GEN_TEMPLATES } from './templates-gen'
import { GEN2_TEMPLATES } from './templates-gen2'

export type CategoryId =
  | 'animals'
  | 'vehicles'
  | 'magic'
  | 'nature'
  | 'food'
  | 'stickman'
  | 'shapes'
  | 'birds'
  | 'sea'
  | 'insects'
  | 'dino'
  | 'weather'
  | 'space'
  | 'sports'
  | 'music'
  | 'clothes'
  | 'school'
  | 'party'
  | 'farm'
  | 'castle'

export interface Category {
  id: CategoryId
  fa: string
  en: string
  color: string
}

/** 20 categories for kids. */
export const CATEGORIES: Category[] = [
  { id: 'animals', fa: 'حیوانات بامزه', en: 'Cute Animals', color: '#FF91B8' },
  { id: 'vehicles', fa: 'ماشین‌های رنگی', en: 'Colorful Vehicles', color: '#FFAA62' },
  { id: 'magic', fa: 'دنیای پری‌ها', en: 'Magic World', color: '#B9A0F5' },
  { id: 'nature', fa: 'طبیعت زیبا', en: 'Beautiful Nature', color: '#8DDEB0' },
  { id: 'food', fa: 'خوراکی‌های خوشمزه', en: 'Yummy Food', color: '#FFD65A' },
  { id: 'stickman', fa: 'استیک‌من‌های بامزه', en: 'Funny Stickmen', color: '#78C8F8' },
  { id: 'shapes', fa: 'اشکال و نقاشی آزاد', en: 'Shapes & Free Draw', color: '#F7B7C8' },
  { id: 'birds', fa: 'پرنده‌های شاد', en: 'Happy Birds', color: '#FFB5A7' },
  { id: 'sea', fa: 'زیر دریا', en: 'Under the Sea', color: '#66D2CE' },
  { id: 'insects', fa: 'حشرات کوچولو', en: 'Little Bugs', color: '#B5D99C' },
  { id: 'dino', fa: 'دنیای دایناسورها', en: 'Dino World', color: '#95D5B2' },
  { id: 'weather', fa: 'آب‌وهوا و فصل‌ها', en: 'Weather & Seasons', color: '#A8D8EA' },
  { id: 'space', fa: 'فضا و ستاره‌ها', en: 'Space & Stars', color: '#D9B8F5' },
  { id: 'sports', fa: 'ورزش و بازی', en: 'Sports & Play', color: '#FFC15E' },
  { id: 'music', fa: 'آلات موسیقی', en: 'Music Time', color: '#E4AFC3' },
  { id: 'clothes', fa: 'لباس و اکسسوری', en: 'Dress Up', color: '#D4B483' },
  { id: 'school', fa: 'لوازم مدرسه', en: 'School Time', color: '#FF9B85' },
  { id: 'party', fa: 'جشن و تولد', en: 'Party Time', color: '#F49FBC' },
  { id: 'farm', fa: 'مزرعه و روستا', en: 'Farm Life', color: '#B8C77E' },
  { id: 'castle', fa: 'قلعه و سلطنتی', en: 'Royal Castle', color: '#E8B4BC' },
]

/** Exactly 100 drawings per category (20 categories = 2000 drawings). */
const buildAll = (): ColoringTemplate[] => {
  const curated = [...CORE_TEMPLATES, ...EXTRA_TEMPLATES]
  const perCat: Record<string, number> = {}
  for (const t of curated) perCat[t.category] = (perCat[t.category] ?? 0) + 1
  const genUsed: Record<string, number> = {}
  const gen: ColoringTemplate[] = []
  for (const t of GEN_TEMPLATES) {
    const target = 100 - (perCat[t.category] ?? 0)
    if ((genUsed[t.category] ?? 0) < target) {
      gen.push(t)
      genUsed[t.category] = (genUsed[t.category] ?? 0) + 1
    }
  }
  return [...curated, ...gen, ...GEN2_TEMPLATES]
}

export const ALL_TEMPLATES: ColoringTemplate[] = buildAll()

export const templateById = (id: string): ColoringTemplate | undefined =>
  ALL_TEMPLATES.find((t) => t.id === id)

export const templatesByCategory = (cat: string): ColoringTemplate[] =>
  ALL_TEMPLATES.filter((t) => t.category === cat)

/** Representative template used as a category card preview. */
export const categoryPreview = (cat: string): ColoringTemplate => {
  const preferred: Record<string, string> = {
    animals: 'cat',
    vehicles: 'race-car',
    magic: 'unicorn',
    nature: 'sun',
    food: 'ice-cream',
    stickman: 'stick-painter',
    shapes: 'shape-circle',
    birds: 'birds-g1',
    sea: 'sea-g1',
    insects: 'insects-g1',
    dino: 'dino-g1',
    weather: 'weather-g1',
    space: 'space-g1',
    sports: 'sports-g1',
    music: 'music-g1',
    clothes: 'clothes-g1',
    school: 'school-g1',
    party: 'party-g1',
    farm: 'farm-g1',
    castle: 'castle-g1',
  }
  return templateById(preferred[cat]) ?? templatesByCategory(cat)[0]
}

/** Deterministic "drawing of the day". */
export const dailyTemplate = (): ColoringTemplate => {
  const day = Math.floor(Date.now() / 86400000)
  return ALL_TEMPLATES[day % ALL_TEMPLATES.length]
}

export const randomTemplate = (): ColoringTemplate =>
  ALL_TEMPLATES[Math.floor(Math.random() * ALL_TEMPLATES.length)]

export type { ColoringTemplate, Difficulty } from './template-types'
