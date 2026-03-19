'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Key, Copy, CheckCircle, RefreshCw, Shield, 
  ShieldCheck, ShieldAlert
} from 'lucide-react'
import { trackConversion } from '@/lib/analytics'

export function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const generatePassword = useCallback(() => {
    let chars = ''
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (numbers) chars += '0123456789'
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!chars) {
      setPassword('Please select at least one option')
      return
    }

    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }

    setPassword(result)
    setHistory(prev => [result, ...prev.slice(0, 4)])
  }, [length, uppercase, lowercase, numbers, symbols])

  const copyPassword = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    trackConversion('password-generator', 'copy', 'text')
    setTimeout(() => setCopied(false), 2000)
  }

  const getStrength = (): { level: string; color: string; icon: typeof Shield } => {
    let score = 0
    if (length >= 8) score++
    if (length >= 12) score++
    if (length >= 16) score++
    if (uppercase) score++
    if (lowercase) score++
    if (numbers) score++
    if (symbols) score++

    if (score <= 3) return { level: 'Weak', color: 'text-red-400', icon: ShieldAlert }
    if (score <= 5) return { level: 'Medium', color: 'text-yellow-400', icon: Shield }
    return { level: 'Strong', color: 'text-green-400', icon: ShieldCheck }
  }

  const strength = getStrength()

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Key className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Secure Password Generator</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              Generate cryptographically strong passwords locally. Your data never 
              leaves your browser. Secure, private, and instant.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Generation & Output */}
        <div className="space-y-6">
          {/* Main Display */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Generated Password</Label>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/5">
                <strength.icon className={`w-3.5 h-3.5 ${strength.color}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${strength.color}`}>{strength.level}</span>
              </div>
            </div>
            
            <div className="flex gap-2 relative group">
              <Input
                type="text"
                value={password}
                readOnly
                placeholder="Secure output..."
                className="h-16 text-2xl font-mono bg-black/40 border-border/50 text-white tracking-widest"
              />
              <Button
                onClick={copyPassword}
                disabled={!password}
                variant="secondary"
                className="h-16 px-6 rounded-xl border-border/50 group-hover:border-primary/30 transition-all"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>

            <Button
              onClick={generatePassword}
              className="w-full h-14 gap-3 uppercase tracking-[0.2em] font-black text-base shadow-xl shadow-primary/20"
            >
              <RefreshCw className="w-5 h-5" />
              Generate Password
            </Button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-3">
            <Label className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[9px]">Quick Presets</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'PIN (4 Digits)', length: 4, upper: false, lower: false, nums: true, sym: false },
                { label: 'Simple (8)', length: 8, upper: true, lower: true, nums: true, sym: false },
                { label: 'Strong (16)', length: 16, upper: true, lower: true, nums: true, sym: true },
                { label: 'Max (32)', length: 32, upper: true, lower: true, nums: true, sym: true },
              ].map((preset) => (
                <Button
                  key={preset.label}
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setLength(preset.length)
                    setUppercase(preset.upper)
                    setLowercase(preset.lower)
                    setNumbers(preset.nums)
                    setSymbols(preset.sym)
                    setTimeout(generatePassword, 0)
                  }}
                  className="text-[10px] font-bold uppercase h-9 whitespace-nowrap"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[9px]">History</Label>
              <div className="space-y-2">
                {history.map((pw, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/20 transition-all group"
                  >
                    <code className="text-xs text-white/70 font-mono truncate max-w-[70%]">{pw}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        navigator.clipboard.writeText(pw);
                        trackConversion('password-generator', 'copy', 'text');
                      }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Options */}
        <Card className="p-8 bg-muted/20 border-border/50">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Security Parameters</h3>
          
          <div className="space-y-10">
            {/* Length */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white font-bold text-xs uppercase tracking-tight">Length</Label>
                <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-black text-xs border border-primary/20">
                  {length} Chars
                </div>
              </div>
              <Slider
                value={[length]}
                onValueChange={([value]) => setLength(value)}
                min={4}
                max={64}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest pt-1">
                <span>4 Min</span>
                <span>64 Max</span>
              </div>
            </div>

            {/* Character Types */}
            <div className="grid gap-2">
              {[
                { label: 'Uppercase Letters', sub: 'A-Z', state: uppercase, set: setUppercase },
                { label: 'Lowercase Letters', sub: 'a-z', state: lowercase, set: setLowercase },
                { label: 'Numbers', sub: '0-9', state: numbers, set: setNumbers },
                { label: 'Special Symbols', sub: '!@#$%', state: symbols, set: setSymbols },
              ].map((opt) => (
                <div 
                  key={opt.label}
                  onClick={() => opt.set(!opt.state)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${
                    opt.state ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-black/20 border-border/40 hover:border-border'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white uppercase tracking-tight">{opt.label}</p>
                    <p className="text-[10px] font-medium text-muted-foreground opacity-60">{opt.sub}</p>
                  </div>
                  <Switch
                    checked={opt.state}
                    onCheckedChange={opt.set}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              ))}
            </div>

            <Card className="p-4 bg-black/40 border-dashed border-2 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted/50">
                <Shield className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <span className="text-white font-bold block mb-1 uppercase tracking-wider">Entropy Note</span>
                Strong passwords combine all four character types and aim for 16+ characters to resist brute-force attacks.
              </p>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  )
}
