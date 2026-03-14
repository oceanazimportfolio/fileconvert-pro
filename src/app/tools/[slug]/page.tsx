import { Metadata } from 'next'
import { ToolPageClient } from './ToolPageClient'

// ==========================================
// SEO-OPTIMIZED TOOL PAGES
// Each tool has its own URL, meta tags, and schema
// ==========================================

// Tool configuration with SEO data
export const toolsConfig: Record<string, {
  title: string
  description: string
  keywords: string[]
  h1: string
  h2: string
  component: string
  category: string
  breadcrumb: string
  schemaData: {
    name: string
    description: string
    category: string
  }
}> = {
  'image-converter': {
    title: 'Free Image Converter - PNG to JPG, WebP, AVIF | FileConvert.pro',
    description: 'Convert images for free. PNG to JPG, JPG to PNG, WebP converter, AVIF converter. Batch convert multiple images. No upload to servers, 100% browser-based.',
    keywords: ['png to jpg converter', 'jpg to png', 'webp converter', 'avif converter', 'image converter', 'batch image converter', 'free image converter', 'online image converter'],
    h1: 'Free Online Image Converter',
    h2: 'Convert PNG, JPG, WebP, AVIF images instantly. Batch conversion supported.',
    component: 'ImageConverter',
    category: 'Image Tools',
    breadcrumb: 'Image Tools',
    schemaData: {
      name: 'Image Converter',
      description: 'Free online image converter supporting PNG, JPG, WebP, and AVIF formats. Batch convert multiple images at once.',
      category: 'Image Conversion Tool'
    }
  },
  'image-compress': {
    title: 'Image Compressor & Resizer - Reduce Image Size Free | FileConvert.pro',
    description: 'Compress and resize images for free. Reduce image file size without losing quality. Batch compress multiple images. 100% browser-based.',
    keywords: ['compress image', 'image compressor', 'reduce image size', 'resize image', 'image optimizer', 'batch image compressor', 'free image compressor', 'online image resizer'],
    h1: 'Free Image Compressor & Resizer',
    h2: 'Reduce image file size without losing quality. Batch processing supported.',
    component: 'ImageCompressResize',
    category: 'Image Tools',
    breadcrumb: 'Image Tools',
    schemaData: {
      name: 'Image Compressor & Resizer',
      description: 'Free online image compressor to reduce file size and resize images. Batch processing supported.',
      category: 'Image Optimization Tool'
    }
  },
  'image-enhancer': {
    title: 'Image Enhancer - Brightness, Contrast, Sharpen Free | FileConvert.pro',
    description: 'Enhance images for free. Adjust brightness, contrast, saturation, sharpness. Auto-enhance feature. All processing in browser, no uploads.',
    keywords: ['image enhancer', 'photo enhancer', 'enhance image quality', 'increase brightness', 'adjust contrast', 'sharpen image', 'free image enhancer', 'online photo editor'],
    h1: 'Free Online Image Enhancer',
    h2: 'Enhance image quality with brightness, contrast, saturation, and sharpening tools.',
    component: 'ImageEnhancer',
    category: 'Image Tools',
    breadcrumb: 'Image Tools',
    schemaData: {
      name: 'Image Enhancer',
      description: 'Free online image enhancer with brightness, contrast, saturation, and sharpening adjustments.',
      category: 'Image Enhancement Tool'
    }
  },
  'background-remover': {
    title: 'Background Remover - Remove Image Background Free | FileConvert.pro',
    description: 'Remove image backgrounds for free. Make transparent PNG images. Perfect for product photos and portraits. 100% browser-based, no uploads.',
    keywords: ['background remover', 'remove background', 'transparent background', 'remove image background', 'free background remover', 'online background remover', 'make transparent png'],
    h1: 'Free Background Remover',
    h2: 'Remove image backgrounds and create transparent PNGs. No uploads required.',
    component: 'BackgroundRemover',
    category: 'Image Tools',
    breadcrumb: 'Image Tools',
    schemaData: {
      name: 'Background Remover',
      description: 'Free online background remover to create transparent PNG images from any photo.',
      category: 'Image Editing Tool'
    }
  },
  'json-formatter': {
    title: 'JSON Formatter & Validator - Format JSON Free | FileConvert.pro',
    description: 'Format and validate JSON for free. JSON beautifier, minifier, and validator. Syntax highlighting. Copy formatted JSON. 100% browser-based.',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'format json', 'json minifier', 'validate json', 'free json formatter', 'online json editor'],
    h1: 'Free JSON Formatter & Validator',
    h2: 'Format, validate, and beautify JSON data instantly. Syntax highlighting included.',
    component: 'JsonFormatter',
    category: 'Developer Tools',
    breadcrumb: 'Developer Tools',
    schemaData: {
      name: 'JSON Formatter',
      description: 'Free online JSON formatter, validator, and beautifier with syntax highlighting.',
      category: 'Developer Tool'
    }
  },
  'base64-encoder': {
    title: 'Base64 Encoder & Decoder - Free Online Tool | FileConvert.pro',
    description: 'Encode and decode Base64 for free. Convert text to Base64 and vice versa. Image to Base64 converter. 100% browser-based, secure.',
    keywords: ['base64 encoder', 'base64 decoder', 'encode base64', 'decode base64', 'base64 converter', 'image to base64', 'free base64 encoder', 'online base64 tool'],
    h1: 'Free Base64 Encoder & Decoder',
    h2: 'Encode text to Base64 or decode Base64 to text. Image encoding supported.',
    component: 'Base64Tool',
    category: 'Developer Tools',
    breadcrumb: 'Developer Tools',
    schemaData: {
      name: 'Base64 Encoder/Decoder',
      description: 'Free online Base64 encoder and decoder for text and images.',
      category: 'Developer Tool'
    }
  },
  'url-encoder': {
    title: 'URL Encoder & Decoder - Encode URL Free | FileConvert.pro',
    description: 'Encode and decode URLs for free. Convert special characters to URL-safe format. Percent encoding. 100% browser-based.',
    keywords: ['url encoder', 'url decoder', 'encode url', 'decode url', 'percent encoding', 'url encoding', 'free url encoder', 'online url encoder'],
    h1: 'Free URL Encoder & Decoder',
    h2: 'Convert URLs to URL-safe format or decode encoded URLs back to text.',
    component: 'UrlEncoder',
    category: 'Developer Tools',
    breadcrumb: 'Developer Tools',
    schemaData: {
      name: 'URL Encoder/Decoder',
      description: 'Free online URL encoder and decoder with percent encoding support.',
      category: 'Developer Tool'
    }
  },
  'case-converter': {
    title: 'Case Converter - Uppercase, Lowercase, Title Case Free | FileConvert.pro',
    description: 'Convert text case for free. Uppercase, lowercase, title case, sentence case, camelCase, snake_case. Instant conversion.',
    keywords: ['case converter', 'uppercase converter', 'lowercase converter', 'title case', 'text case converter', 'camel case converter', 'free case converter', 'online text converter'],
    h1: 'Free Case Converter',
    h2: 'Convert text to uppercase, lowercase, title case, and more formats.',
    component: 'CaseConverter',
    category: 'Text Tools',
    breadcrumb: 'Text Tools',
    schemaData: {
      name: 'Case Converter',
      description: 'Free online case converter supporting uppercase, lowercase, title case, and more.',
      category: 'Text Tool'
    }
  },
  'word-counter': {
    title: 'Word Counter & Character Counter - Free Online Tool | FileConvert.pro',
    description: 'Count words and characters for free. Word count, character count, sentence count, reading time. Perfect for writers and students.',
    keywords: ['word counter', 'character counter', 'word count', 'character count', 'text counter', 'reading time calculator', 'free word counter', 'online word counter'],
    h1: 'Free Word Counter & Character Counter',
    h2: 'Count words, characters, sentences, and estimate reading time instantly.',
    component: 'WordCounter',
    category: 'Text Tools',
    breadcrumb: 'Text Tools',
    schemaData: {
      name: 'Word Counter',
      description: 'Free online word and character counter with reading time estimation.',
      category: 'Text Tool'
    }
  },
  'lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator - Free Placeholder Text | FileConvert.pro',
    description: 'Generate Lorem Ipsum placeholder text for free. Paragraphs, sentences, or words. Perfect for designers and developers.',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'lorem ipsum', 'text generator', 'free lorem ipsum', 'online lorem ipsum generator'],
    h1: 'Free Lorem Ipsum Generator',
    h2: 'Generate placeholder text for your designs, mockups, and documents.',
    component: 'LoremIpsumGenerator',
    category: 'Text Tools',
    breadcrumb: 'Text Tools',
    schemaData: {
      name: 'Lorem Ipsum Generator',
      description: 'Free online Lorem Ipsum placeholder text generator.',
      category: 'Text Tool'
    }
  },
  'color-palette': {
    title: 'Color Palette Generator - Free Color Scheme Tool | FileConvert.pro',
    description: 'Generate beautiful color palettes for free. Create color schemes for designs. Export as CSS or JSON. Perfect for designers.',
    keywords: ['color palette generator', 'color scheme generator', 'color palette', 'color combinations', 'hex color generator', 'free color palette', 'design color palette'],
    h1: 'Free Color Palette Generator',
    h2: 'Create beautiful color palettes for your designs. Export as CSS or JSON.',
    component: 'ColorPalette',
    category: 'Design Tools',
    breadcrumb: 'Design Tools',
    schemaData: {
      name: 'Color Palette Generator',
      description: 'Free online color palette generator for designers and developers.',
      category: 'Design Tool'
    }
  },
  'password-generator': {
    title: 'Password Generator - Create Strong Secure Passwords Free | FileConvert.pro',
    description: 'Generate strong, secure passwords for free. Customizable length and characters. Cryptographically secure. No data stored.',
    keywords: ['password generator', 'secure password', 'random password', 'strong password', 'password creator', 'free password generator', 'online password generator'],
    h1: 'Free Password Generator',
    h2: 'Create strong, secure passwords with customizable options. Cryptographically secure.',
    component: 'PasswordGenerator',
    category: 'Utilities',
    breadcrumb: 'Utilities',
    schemaData: {
      name: 'Password Generator',
      description: 'Free online password generator creating strong, secure passwords.',
      category: 'Security Tool'
    }
  },
  'qr-code-generator': {
    title: 'QR Code Generator - Create QR Codes Free | FileConvert.pro',
    description: 'Generate QR codes for free. Create QR codes for URLs, text, WiFi, and more. Download as PNG. No registration required.',
    keywords: ['qr code generator', 'qr code creator', 'create qr code', 'qr code maker', 'free qr code', 'online qr generator', 'url qr code'],
    h1: 'Free QR Code Generator',
    h2: 'Create QR codes for URLs, text, and more. Download instantly.',
    component: 'QrCodeGenerator',
    category: 'Utilities',
    breadcrumb: 'Utilities',
    schemaData: {
      name: 'QR Code Generator',
      description: 'Free online QR code generator for URLs, text, and more.',
      category: 'Utility Tool'
    }
  },
  'youtube-thumbnail': {
    title: 'YouTube Thumbnail Downloader - Download HD Thumbnails Free | FileConvert.pro',
    description: 'Download YouTube video thumbnails for free. Get HD thumbnails from any YouTube video. No registration required. Instant download.',
    keywords: ['youtube thumbnail downloader', 'download youtube thumbnail', 'youtube thumbnail', 'video thumbnail downloader', 'yt thumbnail', 'free youtube thumbnail', 'hd thumbnail downloader'],
    h1: 'Free YouTube Thumbnail Downloader',
    h2: 'Download HD thumbnails from any YouTube video instantly.',
    component: 'YouTubeThumbnail',
    category: 'Social Media',
    breadcrumb: 'Social Media',
    schemaData: {
      name: 'YouTube Thumbnail Downloader',
      description: 'Free online tool to download HD thumbnails from YouTube videos.',
      category: 'Social Media Tool'
    }
  }
}

// Generate static paths for all tools
export async function generateStaticParams() {
  return Object.keys(toolsConfig).map((slug) => ({
    slug,
  }))
}

// Generate metadata for each tool page
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const tool = toolsConfig[slug]
  
  if (!tool) {
    return {
      title: 'Tool Not Found | FileConvert.pro'
    }
  }

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `https://fileconvert.pro/tools/${slug}`,
      siteName: 'FileConvert.pro',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
    },
    alternates: {
      canonical: `https://fileconvert.pro/tools/${slug}`,
    }
  }
}

export default async function ToolPageWrapper({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const tool = toolsConfig[slug]
  
  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tool Not Found</h1>
          <p className="text-slate-400">The tool you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }
  
  return <ToolPageClient slug={slug} tool={tool} />
}
