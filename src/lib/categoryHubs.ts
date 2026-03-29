import type { CategoryHub } from '@/lib/discoveryTypes'

export const categoryHubs: Record<string, CategoryHub> = {
  'image-tools': {
    slug: 'image-tools',
    title: 'Image Tools',
    description: 'The fastest image workflows on ConvertFiles, from format conversion and compression to transparent PNG exports.',
    metaDescription: 'Browse ConvertFiles image tools for format changes, compression, enhancement, transparent PNG exports, and web-ready asset cleanup.',
    audience: 'Website owners, designers, ecommerce teams, and content operators',
    highlight: 'This is the strongest broad-demand cluster on the site and the main English traffic engine.',
    featuredSlugs: ['image-converter', 'image-compress', 'background-remover', 'webp-to-png', 'png-to-jpg', 'jpg-to-png', 'webp-to-jpg', 'avif-to-png'],
    relatedLinks: [
      { href: '/guides/best-format-for-website-images/', label: 'Best format for website images', description: 'Choose the right format before converting.' },
      { href: '/compare/png-vs-jpg/', label: 'PNG vs JPG', description: 'Compare the two most common web defaults.' },
      { href: '/all-tools/', label: 'Browse every tool', description: 'See the wider tool directory.' },
    ],
  },
  'developer-tools': {
    slug: 'developer-tools',
    title: 'Developer Tools',
    description: 'Browser-based utilities for formatting, encoding, and quick developer workflows.',
    metaDescription: 'Use ConvertFiles developer tools for JSON formatting, Base64 encoding, URL encoding, and fast browser-based utility work.',
    audience: 'Developers, technical writers, QA teams, and support workflows',
    highlight: 'This cluster is smaller than image search but easier to distribute through communities and technical content.',
    featuredSlugs: ['json-formatter', 'base64-encoder', 'url-encoder'],
    relatedLinks: [
      { href: '/compare/json-formatter-vs-json-validator/', label: 'Formatter vs validator', description: 'Clarify the JSON workflow quickly.' },
      { href: '/all-tools/', label: 'All tools', description: 'Move into text and utility workflows too.' },
    ],
  },
  'bangla-tools': {
    slug: 'bangla-tools',
    title: 'Bangla Tools',
    description: 'Bangla conversion workflows for Bijoy, Unicode, and related publishing compatibility tasks.',
    metaDescription: 'Browse ConvertFiles Bangla tools for Bijoy to Unicode, Unicode to Bijoy, and practical legacy publishing compatibility workflows.',
    audience: 'Bangla publishers, editors, designers, and Bangladesh-focused production teams',
    highlight: 'This is the best low-budget search opportunity because the demand is specific and the competition is less saturated than generic image-tool queries.',
    featuredSlugs: ['bangla-converter', 'bijoy-to-unicode', 'unicode-to-bijoy'],
    relatedLinks: [
      { href: '/guides/bijoy-to-unicode-online/', label: 'Bijoy to Unicode online', description: 'Use the highest-intent Bangla guide.' },
      { href: '/compare/bijoy-vs-unicode/', label: 'Bijoy vs Unicode', description: 'Choose the right standard for the next workflow.' },
      { href: '/all-tools/', label: 'All tools', description: 'Return to the wider ConvertFiles directory.' },
    ],
  },
}
