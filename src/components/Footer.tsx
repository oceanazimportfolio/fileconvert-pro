'use client'

import Link from 'next/link'
import { ArrowUpRight, Github, Shield, Zap } from 'lucide-react'

const repoUrl = 'https://github.com/oceanazimportfolio/fileconvert-pro'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
      <div className="container-standard py-12 md:py-14">
        <div className="grid gap-10 border-b border-slate-800 pb-10 md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr_1fr_1fr]">
          <div className="md:col-span-2 xl:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <span className="text-xl font-bold text-white">ConvertFiles</span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
              ConvertFiles is a privacy-first tool platform for image conversion, compression, text utilities,
              and everyday browser-based workflows. No upload required, no installation, and no account needed.
            </p>
            <div className="grid gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-yellow-400" />
                Instant results with local browser processing
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-green-400" />
                Files stay on your device for stronger privacy
              </span>
            </div>
          </div>

          <nav aria-label="Image and media tools">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Image Tools</h3>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><Link href="/tools/image-converter/" className="transition-colors hover:text-blue-400">Image Converter</Link></li>
              <li><Link href="/tools/image-compress/" className="transition-colors hover:text-blue-400">Image Compressor</Link></li>
              <li><Link href="/tools/background-remover/" className="transition-colors hover:text-blue-400">Background Remover</Link></li>
              <li><Link href="/tools/png-to-jpg/" className="transition-colors hover:text-blue-400">PNG to JPG Converter</Link></li>
              <li><Link href="/tools/webp-to-png/" className="transition-colors hover:text-blue-400">WebP to PNG Converter</Link></li>
            </ul>
          </nav>

          <nav aria-label="Developer and utility tools">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Popular Utilities</h3>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><Link href="/tools/json-formatter/" className="transition-colors hover:text-blue-400">JSON Formatter and Validator</Link></li>
              <li><Link href="/tools/password-generator/" className="transition-colors hover:text-blue-400">Password Generator</Link></li>
              <li><Link href="/tools/qr-code-generator/" className="transition-colors hover:text-blue-400">QR Code Generator</Link></li>
              <li><Link href="/tools/word-counter/" className="transition-colors hover:text-blue-400">Word Counter</Link></li>
              <li><Link href="/all-tools/" className="inline-block font-semibold text-white transition-colors hover:text-blue-400">Browse all tools</Link></li>
            </ul>
          </nav>

          <nav aria-label="Guides and discovery pages">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Discover</h3>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><Link href="/guides/" className="transition-colors hover:text-blue-400">Workflow Guides</Link></li>
              <li><Link href="/compare/" className="transition-colors hover:text-blue-400">Compare Formats</Link></li>
              <li><Link href="/categories/image-tools/" className="transition-colors hover:text-blue-400">Image Tools Hub</Link></li>
              <li><Link href="/categories/bangla-tools/" className="transition-colors hover:text-blue-400">Bangla Tools Hub</Link></li>
              <li><Link href="/categories/" className="inline-block font-semibold text-white transition-colors hover:text-blue-400">All categories</Link></li>
            </ul>
          </nav>

          <nav aria-label="Trust and company">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><Link href="/about/" className="transition-colors hover:text-blue-400">About ConvertFiles</Link></li>
              <li><Link href="/privacy-policy/" className="transition-colors hover:text-blue-400">Privacy Policy</Link></li>
              <li><Link href="/terms/" className="transition-colors hover:text-blue-400">Terms of Service</Link></li>
              <li><Link href="/contact/" className="transition-colors hover:text-blue-400">Contact</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Transparency</h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Explore the project, review the privacy-first positioning, or get in touch before listing ConvertFiles in
              directories, tool roundups, or resource pages.
            </p>
            <div className="space-y-3">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-400"
              >
                <Github className="h-4 w-4" />
                View GitHub repository
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <Link
                href="/about/"
                className="block text-sm font-medium text-slate-400 transition-colors hover:text-blue-400"
              >
                Learn how local processing works
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-8 text-center">
          <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
            ConvertFiles helps you convert images, clean up data, and generate assets faster with free browser tools
            built for privacy, speed, and clear results.
          </p>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium">
            <Link href="/all-tools/" className="text-slate-400 transition-colors hover:text-blue-400">All Tools</Link>
            <Link href="/guides/" className="text-slate-400 transition-colors hover:text-blue-400">Guides</Link>
            <Link href="/compare/" className="text-slate-400 transition-colors hover:text-blue-400">Compare</Link>
            <Link href="/categories/" className="text-slate-400 transition-colors hover:text-blue-400">Categories</Link>
            <Link href="/about/" className="text-slate-400 transition-colors hover:text-blue-400">About</Link>
            <Link href="/privacy-policy/" className="text-slate-400 transition-colors hover:text-blue-400">Privacy Policy</Link>
            <Link href="/terms/" className="text-slate-400 transition-colors hover:text-blue-400">Terms</Link>
            <Link href="/contact/" className="text-slate-400 transition-colors hover:text-blue-400">Contact</Link>
          </nav>

          <div className="w-full border-t border-slate-800/60 pt-4">
            <p className="text-sm font-medium text-slate-500">© {currentYear} ConvertFiles</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
