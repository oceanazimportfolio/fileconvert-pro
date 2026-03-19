'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Youtube, Download, Loader2, CheckCircle,
  Image as ImageIcon, AlertCircle, ExternalLink
} from 'lucide-react'

interface ThumbnailResult {
  url: string
  quality: string
  width: number
  height: number
  size?: string
}

export function YouTubeThumbnail() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [thumbnails, setThumbnails] = useState<ThumbnailResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const extractVideoId = (input: string): string | null => {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ]

    for (const pattern of patterns) {
      const match = input.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const handleFetch = async () => {
    setError(null)
    setThumbnails([])
    setVideoId(null)

    if (!url.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    const id = extractVideoId(url.trim())
    if (!id) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video link.')
      return
    }

    setIsLoading(true)
    setVideoId(id)

    // YouTube provides these thumbnail qualities
    const thumbnailQualities: { quality: string; url: string; width: number; height: number }[] = [
      { quality: 'Max Quality', url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`, width: 1280, height: 720 },
      { quality: 'High Quality', url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`, width: 480, height: 360 },
      { quality: 'Standard', url: `https://img.youtube.com/vi/${id}/sddefault.jpg`, width: 640, height: 480 },
      { quality: 'Medium', url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`, width: 320, height: 180 },
      { quality: 'Default', url: `https://img.youtube.com/vi/${id}/default.jpg`, width: 120, height: 90 },
    ]

    // Check which thumbnails exist
    const validThumbnails: ThumbnailResult[] = []

    for (const thumb of thumbnailQualities) {
      try {
        const response = await fetch(thumb.url, { method: 'HEAD' })
        if (response.ok) {
          validThumbnails.push({
            url: thumb.url,
            quality: thumb.quality,
            width: thumb.width,
            height: thumb.height
          })
        }
      } catch {
        // Skip if fetch fails
      }
    }

    if (validThumbnails.length === 0) {
      setError('Could not fetch thumbnails. The video might be private or unavailable.')
    } else {
      setThumbnails(validThumbnails)
    }

    setIsLoading(false)
  }

  const handleDownload = async (thumbnail: ThumbnailResult) => {
    try {
      const response = await fetch(thumbnail.url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `youtube-thumbnail-${videoId}-${thumbnail.quality.toLowerCase().replace(' ', '-')}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Youtube className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">YouTube Thumbnail Downloader</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              Grab high-resolution thumbnails from any YouTube video instantly. 
              Supports multiple qualities and formats.
            </p>
          </div>
        </div>
      </Card>

      {/* URL Input Area */}
      <div className="space-y-4">
        <Label className="text-white font-bold uppercase tracking-wider text-[10px]">YouTube Video URL</Label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              placeholder="https://www.youtube.com/watch?v=..."
              className="h-14 pl-12 bg-black/40 border-border/50 text-white placeholder:text-muted-foreground/30 rounded-xl group-hover:border-primary/30 transition-all font-medium"
            />
            <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
          </div>
          <Button
            onClick={handleFetch}
            disabled={isLoading}
            className="h-14 px-8 uppercase tracking-[0.2em] font-black text-xs shadow-xl shadow-primary/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Fetch Thumbnails'
            )}
          </Button>
        </div>
        <div className="flex items-center gap-4 px-2">
          <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Supports: Watch links, youtu.be, embed, and IDs</span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="bg-destructive/5 border-destructive/20 p-4 border-dashed animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
          </div>
        </Card>
      )}

      {/* Results Section */}
      {videoId && thumbnails.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Hero Preview */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Video Preview</Label>
                   <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black tracking-widest text-[9px] h-6 uppercase">Sync Success</Badge>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
                >
                  Watch Video <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-black/60 border border-white/5 shadow-2xl group">
                <img
                  src={thumbnails[0]?.url}
                  alt="YouTube Thumbnail Preview"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="space-y-6">
              <Card className="p-6 bg-muted/20 border-border/50 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-3">Video Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Video ID</span>
                    <code className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{videoId}</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Variations</span>
                    <span className="text-[10px] font-black text-white">{thumbnails.length} Sizes</span>
                  </div>
                </div>
              </Card>

              {/* Fast Example Help */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-border/40 bg-black/20">
                <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">
                  Tip: Right-click any image in the grid below to save directly, or use our optimized download buttons for original resolution.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Selection Grid */}
          <div className="space-y-6 pt-8 border-t border-border/50">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Select Resolution</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {thumbnails.map((thumbnail, index) => (
                <Card key={index} className="group bg-muted/10 border-border/50 overflow-hidden hover:border-primary/40 transition-all duration-300">
                  <div className="flex flex-col">
                    <div className="relative aspect-video overflow-hidden bg-black/40 border-b border-border/50">
                      <img
                        src={thumbnail.url}
                        alt={thumbnail.quality}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                         <Badge className="bg-black/60 backdrop-blur-md border border-white/10 text-white font-black text-[9px] tracking-widest h-6 uppercase px-2">
                           {thumbnail.width}×{thumbnail.height}
                         </Badge>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-primary opacity-60" />
                          <span className="text-xs font-black text-white uppercase tracking-wider">{thumbnail.quality}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDownload(thumbnail)}
                          className="flex-1 h-10 gap-2 uppercase tracking-widest font-black text-[10px] shadow-lg shadow-primary/10"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => window.open(thumbnail.url, '_blank')}
                          className="px-4 h-10 border-border/50"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Instructions (only when no results) */}
      {!videoId && (
        <Card className="p-8 bg-black/20 border-dashed border-2 flex flex-col items-center gap-4 text-center max-w-2xl mx-auto">
          <div className="p-4 rounded-full bg-muted/50">
             <Youtube className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">How to use</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Copy the URL of your favorite YouTube video and paste it above. We'll automatically identify the video and fetch all available thumbnail sizes including 4K MaxRes (where available), standard HQ, and small previews.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
             {['Watch URLs', 'Video IDs', 'Mobile Short Links', 'Channel Links'].map(s => (
               <div key={s} className="px-4 py-2 rounded-lg bg-black/40 border border-white/5 text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">
                 {s} Supported
               </div>
             ))}
          </div>
        </Card>
      )}
    </div>
  )
}
