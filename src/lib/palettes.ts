import { Lang } from './i18n'

export interface Palette {
  id: 'happy' | 'pastel' | 'nature' | 'rainbow' | 'night' | 'fantasy'
  fa: string
  en: string
  colors: string[]
}

export const PALETTES: Palette[] = [
  {
    id: 'happy',
    fa: 'رنگ‌های شاد',
    en: 'Happy',
    colors: ['#E63946', '#FFAA62', '#FFD65A', '#A8D94E', '#4CC178', '#78C8F8', '#B9A0F5', '#FF91B8', '#FF6FB5', '#35445B'],
  },
  {
    id: 'pastel',
    fa: 'رنگ‌های پاستلی',
    en: 'Pastel',
    colors: ['#FFB5C2', '#FFD9C0', '#FFF3B0', '#C9F2C7', '#BDE6E1', '#C6D8FF', '#E2D1F9', '#F9D5E0', '#FBE7C6', '#DAD2D8'],
  },
  {
    id: 'nature',
    fa: 'رنگ‌های طبیعت',
    en: 'Nature',
    colors: ['#2D6A4F', '#40916C', '#74C69D', '#B7E4C7', '#A3B18A', '#DDA15E', '#BC6C25', '#606C38', '#8AB17D', '#E9F5DB'],
  },
  {
    id: 'rainbow',
    fa: 'رنگین‌کمان',
    en: 'Rainbow',
    colors: ['#E63946', '#F77F00', '#FCBF49', '#FEE440', '#8BC34A', '#00A896', '#219EBC', '#8ECAE6', '#8338EC', '#FF66C4'],
  },
  {
    id: 'night',
    fa: 'رنگ‌های شب',
    en: 'Night',
    colors: ['#0B132B', '#1C2541', '#3A506B', '#5BC0BE', '#6FFFE9', '#7B2CBF', '#9D4EDD', '#C77DFF', '#FFD166', '#E0AAFF'],
  },
  {
    id: 'fantasy',
    fa: 'رنگ‌های فانتزی',
    en: 'Fantasy',
    colors: ['#FF477E', '#FF8FA3', '#FFB3C6', '#A66CFF', '#6C4AB6', '#00C2A8', '#FFD93D', '#FF7B54', '#4D96FF', '#9B5DE5'],
  },
]

export const MAIN_COLORS = [
  '#E63946', '#F77F00', '#FFD65A', '#8BC34A', '#4CC178', '#78C8F8',
  '#B9A0F5', '#FF91B8', '#8B5E3C', '#35445B', '#FFFFFF', '#303030',
]

export const paletteTitle = (p: Palette, lang: Lang) => (lang === 'fa' ? p.fa : p.en)
