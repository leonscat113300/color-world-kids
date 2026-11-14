'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type RangoMood = 'idle' | 'wave' | 'happy' | 'celebrate' | 'sad' | 'paint' | 'think'

const INK = '#35445B'

const armByMood = (mood: RangoMood): { left: number | number[]; right: number | number[] } => {
  switch (mood) {
    case 'wave':
      return { left: 0, right: [-75, -45, -75, -45, -75] }
    case 'happy':
    case 'celebrate':
      return { left: 55, right: -55 }
    case 'paint':
      return { left: 0, right: [0, -16, 0] }
    case 'think':
      return { left: 0, right: -108 }
    case 'sad':
      return { left: 12, right: -12 }
    default:
      return { left: 0, right: 0 }
  }
}

const bodyAnim = (mood: RangoMood) => {
  switch (mood) {
    case 'happy':
      return { y: [0, -14, 0] }
    case 'celebrate':
      return { y: [0, -18, 0], rotate: [0, -3, 3, 0] }
    case 'sad':
      return { y: [0, 4, 0] }
    default:
      return { y: [0, -3, 0] }
  }
}

const bodyDur = (mood: RangoMood) => (mood === 'happy' ? 0.5 : mood === 'celebrate' ? 0.45 : 2.6)

const Mouth = ({ mood }: { mood: RangoMood }) => {
  if (mood === 'happy' || mood === 'celebrate') {
    return <path d="M 84 114 Q 100 140 116 114 Z" fill={INK} />
  }
  if (mood === 'sad') {
    return <path d="M 86 126 Q 100 112 114 126" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
  }
  if (mood === 'think') {
    return <path d="M 90 122 Q 100 128 110 122" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
  }
  return <path d="M 84 114 Q 100 130 116 114" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
}

export function Rango({
  mood = 'idle',
  size = 150,
  className,
}: {
  mood?: RangoMood
  size?: number
  className?: string
}) {
  const arms = armByMood(mood)
  const headTilt = mood === 'sad' ? 8 : mood === 'think' ? -7 : 0
  return (
    <motion.svg
      viewBox="0 0 200 248"
      width={size}
      height={(size * 248) / 200}
      className={className}
      animate={bodyAnim(mood)}
      transition={{ duration: bodyDur(mood), repeat: Infinity, ease: 'easeInOut' }}
      role="img"
      aria-label="Rango the painter"
    >
      {/* legs */}
      <path d="M 88 206 L 80 230" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M 112 206 L 120 230" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
      <ellipse cx="76" cy="235" rx="13" ry="8" fill="#FFFFFF" stroke={INK} strokeWidth="5" />
      <ellipse cx="124" cy="235" rx="13" ry="8" fill="#FFFFFF" stroke={INK} strokeWidth="5" />

      {/* body */}
      <path
        d="M 86 156 Q 100 164 114 156 L 112 210 Q 100 218 88 210 Z"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth="7"
        strokeLinejoin="round"
      />

      {/* left arm */}
      <motion.g
        style={{ transformOrigin: '74px 168px', transformBox: 'view-box' }}
        animate={{ rotate: arms.left }}
        transition={typeof arms.left === 'number' ? { duration: 0.3 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M 74 168 Q 62 182 62 196" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="62" cy="202" r="11" fill="#FFFFFF" stroke={INK} strokeWidth="6" />
      </motion.g>

      {/* right arm + brush */}
      <motion.g
        style={{ transformOrigin: '126px 168px', transformBox: 'view-box' }}
        animate={{ rotate: arms.right }}
        transition={typeof arms.right === 'number' ? { duration: 0.3 } : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M 126 168 Q 140 180 146 192" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="148" cy="198" r="11" fill="#FFFFFF" stroke={INK} strokeWidth="6" />
        <g transform="rotate(35 148 198)">
          <rect x="143" y="150" width="10" height="46" rx="5" fill="#B9A0F5" stroke={INK} strokeWidth="4" />
          <rect x="140" y="141" width="16" height="11" rx="3" fill="#E8E8E8" stroke={INK} strokeWidth="4" />
          <path d="M 141 141 L 155 141 L 151 126 L 145 126 Z" fill="#78C8F8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        </g>
      </motion.g>

      {/* head */}
      <motion.g
        style={{ transformOrigin: '100px 100px', transformBox: 'view-box' }}
        animate={{ rotate: headTilt }}
        transition={{ duration: 0.4 }}
      >
        <circle cx="100" cy="100" r="58" fill="#FFFFFF" stroke={INK} strokeWidth="7" />
        <g className="rango-eyes">
          <circle cx="80" cy="97" r="10.5" fill={INK} />
          <circle cx="83.5" cy="93" r="3.6" fill="#FFFFFF" />
          <circle cx="120" cy="97" r="10.5" fill={INK} />
          <circle cx="123.5" cy="93" r="3.6" fill="#FFFFFF" />
        </g>
        <circle cx="68" cy="115" r="8" fill="#FFB5C2" opacity="0.75" />
        <circle cx="132" cy="115" r="8" fill="#FFB5C2" opacity="0.75" />
        <Mouth mood={mood} />
        {/* painter beret */}
        <path
          d="M 44 60 Q 52 20 100 22 Q 148 20 156 60 Q 100 74 44 60 Z"
          fill="#B9A0F5"
          stroke={INK}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <circle cx="76" cy="40" r="6" fill="#FF91B8" />
        <circle cx="104" cy="32" r="6" fill="#FFD65A" />
        <circle cx="128" cy="46" r="6" fill="#8DDEB0" />
        <circle cx="100" cy="20" r="7" fill="#FFD65A" stroke={INK} strokeWidth="4" />
      </motion.g>
    </motion.svg>
  )
}

/** Cartoon speech bubble. */
export function SpeechBubble({
  text,
  visible,
  className,
}: {
  text: string
  visible: boolean
  className?: string
}) {
  return (
    <motion.div
      initial={false}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.7, y: 8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'pointer-events-none relative rounded-3xl border-[3px] border-[#35445B]/25 bg-white px-5 py-3 text-center font-bold text-[#35445B] shadow-[0_4px_0_rgba(53,68,91,0.12)]',
        className
      )}
    >
      {text}
      <span className="absolute -bottom-[11px] start-8 h-5 w-5 rotate-45 border-b-[3px] border-e-[3px] border-[#35445B]/25 bg-white" />
    </motion.div>
  )
}
