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
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-red-500/10 border-red-500/30 p-4">
        <div className="flex items-start gap-3">
          <Youtube className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Download YouTube Thumbnails</p>
            <p className="text-sm text-slate-400 mt-1">
              Enter a YouTube video URL to download its thumbnail in various qualities.
              Works with youtube.com and youtu.be links.
            </p>
          </div>
        </div>
      </Card>

      {/* URL Input */}
      <div className="space-y-3">
        <Label className="text-white">YouTube Video URL</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            placeholder="https://www.youtube.com/watch?v=..."
            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
          />
          <Button 
            onClick={handleFetch}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Fetch'
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          Supports: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
        </p>
      </div>

      {/* Error */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/30 p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Video Preview */}
      {videoId && thumbnails.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">Video Found</span>
            <a 
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Watch <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          {/* Main Preview */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 mb-4">
            <img 
              src={thumbnails[0]?.url}
              alt="YouTube Thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      )}

      {/* Thumbnails Grid */}
      {thumbnails.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">
            Available Thumbnails ({thumbnails.length})
          </h3>
          
          <div className="grid gap-4">
            {thumbnails.map((thumbnail, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Preview */}
                  <div className="md:w-64 flex-shrink-0 bg-slate-900">
                    <img 
                      src={thumbnail.url}
                      alt={thumbnail.quality}
                      className="w-full h-auto"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-red-400" />
                        <span className="text-white font-medium">{thumbnail.quality}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-slate-700 text-white">
                          {thumbnail.width} × {thumbnail.height}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleDownload(thumbnail)}
                        className="gap-2 bg-red-500 hover:bg-red-600"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(thumbnail.url, '_blank')}
                        className="gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Example URLs */}
      <Card className="bg-slate-800/30 border-slate-700/30 p-4">
        <p className="text-sm text-slate-400 mb-2">Example URLs to try:</p>
        <div className="space-y-1 text-xs text-slate-500">
          <p>• https://www.youtube.com/watch?v=dQw4w9WgXcQ</p>
          <p>• https://youtu.be/dQw4w9WgXcQ</p>
          <p>• dQw4w9WgXcQ (just the video ID)</p>
        </div>
      </Card>
    </div>
  )
}
