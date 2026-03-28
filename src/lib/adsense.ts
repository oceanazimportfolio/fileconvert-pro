export type AdPlacementId =
  | 'homepage_in_content'
  | 'all_tools_in_content'
  | 'tool_page_in_content'

export type AdFormat = 'auto' | 'horizontal' | 'rectangle'

interface AdPlacement {
  slot: string
  format: AdFormat
  fullWidthResponsive: boolean
  minHeight: number
  enabled: boolean
}

interface ToolPageAdContext {
  slug: string
  component: string
  featureCount: number
  relatedToolsCount: number
}

export const ADSENSE_CLIENT_ID = 'ca-pub-3379852787762258'
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`

// Add the shared responsive unit slot here when it is created in AdSense.
const SHARED_IN_CONTENT_SLOT = ''
const hasConfiguredSharedSlot = Boolean(SHARED_IN_CONTENT_SLOT)

const placements: Record<AdPlacementId, AdPlacement> = {
  homepage_in_content: {
    slot: SHARED_IN_CONTENT_SLOT,
    format: 'auto',
    fullWidthResponsive: true,
    minHeight: 250,
    enabled: hasConfiguredSharedSlot,
  },
  all_tools_in_content: {
    slot: SHARED_IN_CONTENT_SLOT,
    format: 'auto',
    fullWidthResponsive: true,
    minHeight: 250,
    enabled: hasConfiguredSharedSlot,
  },
  tool_page_in_content: {
    slot: SHARED_IN_CONTENT_SLOT,
    format: 'auto',
    fullWidthResponsive: true,
    minHeight: 280,
    enabled: hasConfiguredSharedSlot,
  },
}

const densePrimaryToolComponents = new Set(['BackgroundRemover'])

export function getAdPlacement(id: AdPlacementId): AdPlacement | null {
  const placement = placements[id]

  if (!placement.enabled || !placement.slot) {
    return null
  }

  return placement
}

export function shouldRenderToolPageAd({
  slug,
  component,
  featureCount,
  relatedToolsCount,
}: ToolPageAdContext): boolean {
  if (!slug || densePrimaryToolComponents.has(component)) {
    return false
  }

  return featureCount >= 3 && relatedToolsCount >= 3
}
