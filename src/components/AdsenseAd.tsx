'use client'

import { useEffect, useRef } from 'react'
import { ADSENSE_CLIENT_ID, type AdFormat } from '@/lib/adsense'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

interface AdsenseAdProps {
  slot: string
  format?: AdFormat
  className?: string
  fullWidthResponsive?: boolean
  minHeight?: number
}

export function AdsenseAd({
  slot,
  format = 'auto',
  className,
  fullWidthResponsive = true,
  minHeight = 250,
}: AdsenseAdProps) {
  const adRef = useRef<HTMLModElement | null>(null)
  const hasRequestedAdRef = useRef(false)

  useEffect(() => {
    const adElement = adRef.current

    if (!slot || !adElement || hasRequestedAdRef.current) {
      return
    }

    if (adElement.getAttribute('data-adsbygoogle-status')) {
      hasRequestedAdRef.current = true
      return
    }

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      hasRequestedAdRef.current = true
    } catch {
      hasRequestedAdRef.current = false
    }
  }, [slot])

  if (!slot) {
    return null
  }

  return (
    <div className={cn('my-10', className)}>
      <div className="rounded-2xl border border-border/50 bg-card/35 p-4 md:p-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
          Advertisement
        </p>
        <div
          className="overflow-hidden rounded-xl border border-dashed border-border/50 bg-background/40 px-2 py-3"
          style={{ minHeight }}
        >
          <ins
            ref={adRef}
            className="adsbygoogle block w-full"
            style={{ display: 'block', minHeight }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
          />
        </div>
      </div>
    </div>
  )
}
