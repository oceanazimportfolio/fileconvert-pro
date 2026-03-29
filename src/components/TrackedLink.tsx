'use client'

import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'
import type { ReactNode } from 'react'

interface TrackedLinkProps {
  href: string
  eventName: string
  eventParams?: Record<string, string>
  className?: string
  children: ReactNode
}

export function TrackedLink({ href, eventName, eventParams, className, children }: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackEvent(eventName, {
          destination: href,
          ...eventParams,
        })
      }}
    >
      {children}
    </Link>
  )
}
