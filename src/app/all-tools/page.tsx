import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { toolsConfig } from '@/app/tools/[slug]/page'
import {
  Image as ImageIcon, Binary, FileText, Palette, Key, Youtube, ArrowLeft, Sparkles
} from 'lucide-react'

const getCategoryIcon = (cat: string) => {
  if (cat.includes('Image')) return ImageIcon
  if (cat.includes('Developer')) return Binary
  if (cat.includes('Text')) return FileText
  if (cat.includes('Design')) return Palette
  if (cat.includes('Social')) return Youtube
  return Key
}

export const metadata = {
  title: 'All Tools - Free Online Converters & Utilities | ConvertFiles',
  description: 'Browse our complete collection of free online tools, including image converters, developer utilities, text transformers, and secure password generators.',
  alternates: {
    canonical: 'https://convertfiles.qzz.io/all-tools/',
  }
}

export default function AllToolsPage() {
  const categorizedTools = Object.entries(toolsConfig).reduce((acc, [slug, tool]) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push({ slug, ...tool })
    return acc
  }, {} as Record<string, any[]>)

  const categoryOrder = [
    'Image Tools',
    'Image Conversion',
    'Text Tools',
    'Developer Tools',
    'Design Tools',
    'Utilities',
    'Social Media'
  ]

  // Add any categories from toolsConfig that are missing in categoryOrder
  Object.keys(categorizedTools).forEach(cat => {
    if (!categoryOrder.includes(cat)) categoryOrder.push(cat)
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="px-4 max-w-7xl mx-auto py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group transition-all active:scale-95">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-primary shadow-lg shadow-primary/20">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xl font-black text-white tracking-tight">ConvertFiles</div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Free Online Tools</p>
              </div>
            </Link>

            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 max-w-7xl mx-auto py-12">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">All Active Tools</Badge>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Everything in one place</h1>
          <p className="text-lg text-muted-foreground">
            Browse our complete collection of 100% free, private, browser-based utilities.
          </p>
        </div>

        <div className="space-y-16">
          {/* Featured & Popular */}
          <section aria-labelledby="featured-popular">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <h2 id="featured-popular" className="text-2xl font-black text-white">Featured & Popular</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {['image-compress', 'json-formatter', 'password-generator', 'qr-code-generator', 'word-counter', 'color-palette'].map((slug) => {
                const tool = toolsConfig[slug]
                if (!tool) return null
                return (
                  <Link key={`feat-${slug}`} href={`/tools/${slug}/`} className="group h-full">
                    <Card className="h-full border-amber-400/30 bg-amber-400/5 hover:border-amber-400/60 hover:bg-amber-400/10 hover:shadow-xl hover:shadow-amber-400/10 transition-all duration-300 overflow-hidden relative p-5">
                      <div className="flex flex-col h-full">
                        <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors leading-tight line-clamp-2">
                          {tool.schemaData.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {tool.schemaData.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>

          {categoryOrder.map((catName) => {
            const currentGroup = categorizedTools[catName]
            if (!currentGroup || currentGroup.length === 0) return null
            
            const IconComponent = getCategoryIcon(catName)

            return (
              <section key={catName} aria-labelledby={`category-${catName.replace(/\s+/g, '-')}`}>
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                  <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <h2 id={`category-${catName.replace(/\s+/g, '-')}`} className="text-2xl font-black text-white">{catName}</h2>
                  <Badge variant="secondary" className="ml-auto">{currentGroup.length} tools</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentGroup.map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}/`} className="group h-full">
                      <Card className="h-full hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden relative p-5">
                        <div className="flex flex-col h-full">
                          <h3 className="text-base font-bold text-white mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                            {tool.schemaData.name}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {tool.schemaData.description}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}
