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
import { trackConversion } from '@/lib/analytics'

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
    
    trackConversion('qr-code-generator', 'download', 'png')
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
      trackConversion('qr-code-generator', 'copy', 'png')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            <QrCode className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">QR Code Generator</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              Create secure, high-quality QR codes for any content.
              All generation happens in your browser — your data stays private.
            </p>
          </div>
        </div>
      </Card>

      {/* Content Type Selection */}
      <div className="space-y-4">
        <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Content Type</Label>
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <Tabs value={contentType} onValueChange={(v) => setContentType(v as typeof contentType)}>
            <TabsList className="bg-muted/50 p-1 h-14 rounded-xl inline-flex w-auto border border-border">
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
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-11 px-6 font-bold rounded-lg transition-all"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Input */}
      {/* Content Input Area */}
      <Card className="p-6">
        {contentType === 'url' && (
          <div className="space-y-3">
            <Label className="text-white font-bold text-xs uppercase tracking-wider">Website URL</Label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        )}

        {contentType === 'text' && (
          <div className="space-y-3">
            <Label className="text-white font-bold text-xs uppercase tracking-wider">Text Content</Label>
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter any text..."
            />
          </div>
        )}

        {contentType === 'email' && (
          <div className="space-y-3">
            <Label className="text-white font-bold text-xs uppercase tracking-wider">Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>
        )}

        {contentType === 'phone' && (
          <div className="space-y-3">
            <Label className="text-white font-bold text-xs uppercase tracking-wider">Phone Number</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
            />
          </div>
        )}

        {contentType === 'sms' && (
          <div className="space-y-3">
            <Label className="text-white font-bold text-xs uppercase tracking-wider">Phone Number for SMS</Label>
            <Input
              type="tel"
              value={sms}
              onChange={(e) => setSms(e.target.value)}
              placeholder="+1234567890"
            />
          </div>
        )}

        {contentType === 'wifi' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-white font-bold text-xs uppercase tracking-wider">Network (SSID)</Label>
              <Input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="WiFi name"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-white font-bold text-xs uppercase tracking-wider">Password</Label>
              <Input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="Network password"
              />
            </div>
            <div className="md:col-span-2 space-y-3">
              <Label className="text-white font-bold text-xs uppercase tracking-wider">Security</Label>
              <div className="flex flex-wrap gap-2">
                {['WPA', 'WEP', 'nopass'].map((type) => (
                  <Button
                    key={type}
                    variant={wifiType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setWifiType(type)}
                    className="flex-1 h-10"
                  >
                    {type === 'nopass' ? 'Open' : type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Options Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Customization */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Resolution</Label>
              <Badge variant="outline" className="bg-muted px-2 py-0.5">{size}px</Badge>
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

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-white font-bold text-[10px] uppercase tracking-wider">Foreground</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-14 h-11 p-1 rounded-xl cursor-pointer"
                />
                <Input
                  type="text"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-white font-bold text-[10px] uppercase tracking-wider">Background</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-14 h-11 p-1 rounded-xl cursor-pointer"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-white font-bold text-[10px] uppercase tracking-wider">Error Correction</Label>
            <div className="flex gap-2">
              {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                <Button
                  key={level}
                  variant={errorCorrectionLevel === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setErrorCorrectionLevel(level)}
                  className="flex-1 h-10"
                >
                  {level}
                </Button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-loose">
              Higher level = more resilient to damage
            </p>
          </div>
        </div>

        {/* Live Preview */}
        <Card className="flex flex-col items-center justify-center p-8 bg-black/20 border-dashed border-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 opacity-50" />
            <div
              className={`
                relative aspect-square w-full max-w-[280px] rounded-3xl p-6 shadow-2xl transition-all duration-300
                ${qrDataUrl ? 'ring-1 ring-white/10' : 'bg-muted/50'}
              `}
              style={{ backgroundColor: qrDataUrl ? backgroundColor : undefined }}
            >
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </div>

          {qrDataUrl && (
            <div className="w-full mt-8 space-y-3">
              <Button onClick={handleDownload} size="lg" className="w-full gap-2 h-14 uppercase tracking-widest font-black">
                <Download className="w-4 h-4" />
                Download PNG
              </Button>
              <Button
                onClick={handleCopy}
                variant="secondary"
                className="w-full h-12 font-bold"
              >
                {copied ? (
                  <><CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />Copied!</>
                ) : (
                  'Copy to Clipboard'
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
