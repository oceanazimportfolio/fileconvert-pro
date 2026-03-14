'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  QrCode, Download, CheckCircle,
  Link, Mail, Phone, MessageSquare, Wifi
} from 'lucide-react'

export function QrCodeGenerator() {
  const [contentType, setContentType] = useState<'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi'>('url')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('https://')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [sms, setSms] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiType, setWifiType] = useState('WPA')
  const [size, setSize] = useState(256)
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [copied, setCopied] = useState(false)

  const getQRContent = (): string => {
    switch (contentType) {
      case 'text':
        return text
      case 'url':
        return url
      case 'email':
        return email ? `mailto:${email}` : ''
      case 'phone':
        return phone ? `tel:${phone}` : ''
      case 'sms':
        return sms ? `sms:${sms}` : ''
      case 'wifi':
        if (!wifiSsid) return ''
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};;`
      default:
        return ''
    }
  }

  const qrContent = getQRContent()
  
  const qrDataUrl = qrContent 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrContent)}&color=${foregroundColor.replace('#', '')}&bgcolor=${backgroundColor.replace('#', '')}&ecc=${errorCorrectionLevel}`
    : null

  const handleDownload = async () => {
    if (!qrDataUrl) return

    const response = await fetch(qrDataUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `qrcode-${contentType}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    if (!qrDataUrl) return

    try {
      const response = await fetch(qrDataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-cyan-500/10 border-cyan-500/30 p-4">
        <div className="flex items-start gap-3">
          <QrCode className="w-5 h-5 text-cyan-400 mt-0.5" />
          <div>
            <p className="text-cyan-400 font-medium">Generate QR Codes</p>
            <p className="text-sm text-slate-400 mt-1">
              Create custom QR codes for URLs, text, email, phone, SMS, and WiFi. 
              Download in high quality PNG format.
            </p>
          </div>
        </div>
      </Card>

      {/* Content Type Selection */}
      <div>
        <Label className="text-white mb-3 block">Content Type</Label>
        <Tabs value={contentType} onValueChange={(v) => setContentType(v as typeof contentType)}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-transparent h-auto p-0">
            {[
              { value: 'url', icon: Link, label: 'URL' },
              { value: 'text', icon: QrCode, label: 'Text' },
              { value: 'email', icon: Mail, label: 'Email' },
              { value: 'phone', icon: Phone, label: 'Phone' },
              { value: 'sms', icon: MessageSquare, label: 'SMS' },
              { value: 'wifi', icon: Wifi, label: 'WiFi' },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger 
                key={value} 
                value={value}
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content Input */}
      <Card className="bg-slate-800/30 border-slate-700/30 p-4">
        {contentType === 'url' && (
          <div>
            <Label className="text-white mb-2 block">Website URL</Label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
        )}

        {contentType === 'text' && (
          <div>
            <Label className="text-white mb-2 block">Text Content</Label>
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter any text..."
              className="bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
        )}

        {contentType === 'email' && (
          <div>
            <Label className="text-white mb-2 block">Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
        )}

        {contentType === 'phone' && (
          <div>
            <Label className="text-white mb-2 block">Phone Number</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              className="bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
        )}

        {contentType === 'sms' && (
          <div>
            <Label className="text-white mb-2 block">Phone Number for SMS</Label>
            <Input
              type="tel"
              value={sms}
              onChange={(e) => setSms(e.target.value)}
              placeholder="+1234567890"
              className="bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
        )}

        {contentType === 'wifi' && (
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Network Name (SSID)</Label>
              <Input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="Your WiFi name"
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">Password</Label>
              <Input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="WiFi password"
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">Security Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {['WPA', 'WEP', 'nopass'].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => setWifiType(type)}
                    className={wifiType === type 
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                      : 'bg-slate-800/50 border-slate-600 text-slate-300'
                    }
                  >
                    {type === 'nopass' ? 'None' : type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Options & Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Options */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white">Size</Label>
              <Badge variant="secondary" className="bg-slate-700 text-white">
                {size}px
              </Badge>
            </div>
            <Slider
              value={[size]}
              onValueChange={([value]) => setSize(value)}
              min={128}
              max={1024}
              step={64}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white mb-2 block">Foreground</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-12 h-10 p-1 bg-slate-800/50 border-slate-600"
                />
                <Input
                  type="text"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white mb-2 block">Background</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 p-1 bg-slate-800/50 border-slate-600"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-white mb-2 block">Error Correction</Label>
            <div className="grid grid-cols-4 gap-2">
              {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                <Button
                  key={level}
                  variant="outline"
                  size="sm"
                  onClick={() => setErrorCorrectionLevel(level)}
                  className={errorCorrectionLevel === level 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                    : 'bg-slate-800/50 border-slate-600 text-slate-300'
                  }
                >
                  {level}
                </Button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Higher = more resilient to damage
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center">
          <Card className="bg-slate-800/50 border-slate-700/50 p-6 w-full max-w-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Preview</h3>
              {qrDataUrl && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
            </div>
            
            <div 
              className="aspect-square rounded-lg flex items-center justify-center overflow-hidden"
              style={{ backgroundColor }}
            >
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <QrCode className="w-16 h-16 text-slate-600" />
              )}
            </div>

            {/* Download Buttons */}
            {qrDataUrl && (
              <div className="mt-4 space-y-2">
                <Button 
                  onClick={handleDownload}
                  className="w-full gap-2 bg-cyan-500 hover:bg-cyan-600"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </Button>
                <Button 
                  onClick={handleCopy}
                  variant="outline"
                  className="w-full gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    'Copy to Clipboard'
                  )}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
