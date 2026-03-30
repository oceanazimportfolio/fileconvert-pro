import type { LucideIcon } from 'lucide-react'
import {
  ArrowRightLeft,
  Binary,
  Braces,
  CaseSensitive,
  Eraser,
  FileText,
  Images,
  KeyRound,
  Languages,
  Link2,
  Palette,
  QrCode,
  Shrink,
  Sparkles,
  Wand2,
  WholeWord,
  Youtube,
} from 'lucide-react'

export const toolIconSlugs = [
  'image-converter',
  'image-compress',
  'image-enhancer',
  'background-remover',
  'json-formatter',
  'base64-encoder',
  'url-encoder',
  'case-converter',
  'word-counter',
  'lorem-ipsum-generator',
  'color-palette',
  'password-generator',
  'qr-code-generator',
  'youtube-thumbnail',
  'webp-to-png',
  'png-to-jpg',
  'jpg-to-png',
  'webp-to-jpg',
  'avif-to-png',
  'bangla-converter',
  'unicode-to-bijoy',
  'bijoy-to-unicode',
] as const

export type ToolIconSlug = (typeof toolIconSlugs)[number]

export const toolIconMap = {
  'image-converter': Images,
  'image-compress': Shrink,
  'image-enhancer': Wand2,
  'background-remover': Eraser,
  'json-formatter': Braces,
  'base64-encoder': Binary,
  'url-encoder': Link2,
  'case-converter': CaseSensitive,
  'word-counter': WholeWord,
  'lorem-ipsum-generator': FileText,
  'color-palette': Palette,
  'password-generator': KeyRound,
  'qr-code-generator': QrCode,
  'youtube-thumbnail': Youtube,
  'webp-to-png': ArrowRightLeft,
  'png-to-jpg': ArrowRightLeft,
  'jpg-to-png': ArrowRightLeft,
  'webp-to-jpg': ArrowRightLeft,
  'avif-to-png': ArrowRightLeft,
  'bangla-converter': Languages,
  'unicode-to-bijoy': Languages,
  'bijoy-to-unicode': Languages,
} satisfies Record<ToolIconSlug, LucideIcon>

const toolIconSlugSet = new Set<string>(toolIconSlugs)

export function isToolIconSlug(value: string): value is ToolIconSlug {
  return toolIconSlugSet.has(value)
}

export function getToolIcon(slug: string): LucideIcon {
  return isToolIconSlug(slug) ? toolIconMap[slug] : Sparkles
}

export function getToolSlugFromHref(href: string): ToolIconSlug | null {
  const match = href.match(/^\/tools\/([^/]+)\/?$/)

  if (!match) return null

  return isToolIconSlug(match[1]) ? match[1] : null
}
