import type { LucideProps } from 'lucide-react'
import { getToolIcon } from '@/lib/toolIcons'
import { cn } from '@/lib/utils'

interface ToolIconProps extends Omit<LucideProps, 'ref'> {
  slug: string
  decorative?: boolean
  label?: string
}

export function ToolIcon({
  slug,
  decorative = true,
  label,
  className,
  strokeWidth = 2,
  ...props
}: ToolIconProps) {
  const Icon = getToolIcon(slug)

  return (
    <Icon
      {...props}
      strokeWidth={strokeWidth}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      className={cn('shrink-0', className)}
    />
  )
}
