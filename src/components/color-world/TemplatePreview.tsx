'use client'

import { cn } from '@/lib/utils'

/** Renders a coloring template's SVG inline (vector, crisp at any size). */
export function TemplatePreview({
  svg,
  className,
  rounded = true,
}: {
  svg: string
  className?: string
  rounded?: boolean
}) {
  return (
    <div
      className={cn('tpl-preview overflow-hidden', rounded && 'rounded-2xl', className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-hidden
    />
  )
}
