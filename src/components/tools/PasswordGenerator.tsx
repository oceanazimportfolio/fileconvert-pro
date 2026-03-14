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
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-emerald-500/10 border-emerald-500/30 p-4">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-emerald-400 mt-0.5" />
          <div>
            <p className="text-emerald-400 font-medium">Secure Password Generator</p>
            <p className="text-sm text-slate-400 mt-1">
              Generate strong, random passwords using cryptographic methods. 
              Passwords are generated locally and never stored or transmitted.
            </p>
          </div>
        </div>
      </Card>

      {/* Generated Password */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-white">Generated Password</Label>
          <div className="flex items-center gap-2">
            <strength.icon className={`w-4 h-4 ${strength.color}`} />
            <span className={`text-sm font-medium ${strength.color}`}>{strength.level}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Input
            type="text"
            value={password}
            readOnly
            placeholder="Click Generate to create a password"
            className="h-14 text-xl font-mono bg-slate-800/50 border-slate-600 text-white"
          />
          <Button
            onClick={copyPassword}
            disabled={!password}
            variant="outline"
            className="h-14 px-6"
          >
            {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>

        <Button
          onClick={generatePassword}
          className="w-full h-12 gap-2 bg-emerald-500 hover:bg-emerald-600"
        >
          <RefreshCw className="w-5 h-5" />
          Generate Password
        </Button>
      </div>

      {/* Options */}
      <Card className="bg-slate-800/30 border-slate-700/30 p-4">
        <h3 className="text-white font-medium mb-4">Password Options</h3>
        
        {/* Length */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Password Length</Label>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {length} characters
            </Badge>
          </div>
          <Slider
            value={[length]}
            onValueChange={([value]) => setLength(value)}
            min={4}
            max={64}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Types */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Uppercase (A-Z)</Label>
            <Switch
              checked={uppercase}
              onCheckedChange={setUppercase}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Lowercase (a-z)</Label>
            <Switch
              checked={lowercase}
              onCheckedChange={setLowercase}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Numbers (0-9)</Label>
            <Switch
              checked={numbers}
              onCheckedChange={setNumbers}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Symbols (!@#$%)</Label>
            <Switch
              checked={symbols}
              onCheckedChange={setSymbols}
            />
          </div>
        </div>
      </Card>

      {/* Quick Presets */}
      <div className="space-y-2">
        <Label className="text-slate-400 text-sm">Quick Presets</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'PIN (4 digits)', length: 4, upper: false, lower: false, nums: true, sym: false },
            { label: 'Simple (8)', length: 8, upper: true, lower: true, nums: true, sym: false },
            { label: 'Strong (16)', length: 16, upper: true, lower: true, nums: true, sym: true },
            { label: 'Maximum (32)', length: 32, upper: true, lower: true, nums: true, sym: true },
          ].map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => {
                setLength(preset.length)
                setUppercase(preset.upper)
                setLowercase(preset.lower)
                setNumbers(preset.nums)
                setSymbols(preset.sym)
                setTimeout(generatePassword, 0)
              }}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-2">
          <Label className="text-slate-400 text-sm">Recent Passwords</Label>
          <div className="space-y-2">
            {history.map((pw, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-2 rounded bg-slate-800/50"
              >
                <code className="text-sm text-slate-300 truncate max-w-[70%]">{pw}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(pw)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
