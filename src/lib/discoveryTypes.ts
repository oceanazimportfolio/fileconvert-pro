export interface DiscoveryLink {
  href: string
  label: string
  description: string
}

export interface GuidePage {
  slug: string
  title: string
  searchTitle: string
  metaDescription: string
  description: string
  primaryIntent: string
  language: 'en' | 'bn' | 'mixed'
  toolSlug: string
  intro: string
  heroExample: {
    input: string
    output: string
    note: string
  }
  sections?: {
    heading: string
    paragraphs: string[]
    bullets?: string[]
  }[]
  steps: string[]
  useCases: string[]
  whenToUse: string[]
  avoidWhen: string[]
  faq: { q: string; a: string }[]
  relatedLinks: DiscoveryLink[]
  lastReviewed: string
  reviewer: string
}

export interface ComparisonPage {
  slug: string
  title: string
  searchTitle: string
  metaDescription: string
  description: string
  primaryIntent: string
  language: 'en' | 'bn' | 'mixed'
  summary: string
  bestChoice: string
  comparisonRows: { label: string; left: string; right: string }[]
  winnerScenarios: string[]
  faq: { q: string; a: string }[]
  relatedLinks: DiscoveryLink[]
  lastReviewed: string
  reviewer: string
}

export interface CategoryHub {
  slug: string
  title: string
  description: string
  metaDescription: string
  audience: string
  highlight: string
  featuredSlugs: string[]
  relatedLinks: DiscoveryLink[]
}
