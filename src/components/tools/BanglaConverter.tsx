'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, ArrowRightLeft, CheckCircle2, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { trackEvent } from '@/lib/analytics'
import { bijoyToUnicode, unicodeToBijoy } from '@/lib/bangla-converter'

type ConversionDirection = 'bijoyToUnicode' | 'unicodeToBijoy'

interface BanglaConverterProps {
    defaultDirection: ConversionDirection
    title: string
    description: string
}

export function BanglaConverter({ defaultDirection, title, description }: BanglaConverterProps) {
    const [direction, setDirection] = useState<ConversionDirection>(defaultDirection)
    const [sourceText, setSourceText] = useState('')
    const [targetText, setTargetText] = useState('')
    const [isConverted, setIsConverted] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        trackEvent('tool_viewed', { tool_name: 'bangla_converter', direction })
    }, [direction])

    const handleConvert = () => {
        if (!sourceText.trim()) {
            toast({ title: 'Empty input', description: 'Paste some text first.', variant: 'destructive' })
            return
        }

        try {
            const result = direction === 'bijoyToUnicode'
                ? bijoyToUnicode(sourceText)
                : unicodeToBijoy(sourceText)

            setTargetText(result)
            setIsConverted(true)
            trackEvent('convert_clicked', { direction, length: sourceText.length })
        } catch {
            toast({ title: 'Conversion Error', description: 'An error occurred.', variant: 'destructive' })
        }
    }

    const handleDirectionChange = (nextDirection: ConversionDirection) => {
        setDirection(nextDirection)
        setTargetText('')
        setIsConverted(false)
    }

    const handleSwap = () => {
        const newDirection: ConversionDirection = direction === 'bijoyToUnicode' ? 'unicodeToBijoy' : 'bijoyToUnicode'
        setDirection(newDirection)
        setSourceText(targetText)
        setTargetText('')
        setIsConverted(false)
    }

    const handleClear = () => {
        setSourceText('')
        setTargetText('')
        setIsConverted(false)
    }

    const handleCopy = async () => {
        if (!targetText.trim()) {
            toast({ title: 'Nothing to copy', description: 'Convert some text first.', variant: 'destructive' })
            return
        }

        try {
            await navigator.clipboard.writeText(targetText)
            trackEvent('copy_clicked', { direction, length: targetText.length })
            toast({ title: 'Copied!', description: 'Text copied to clipboard.' })
        } catch {
            toast({ title: 'Copy failed', variant: 'destructive' })
        }
    }

    const isBijoyToUni = direction === 'bijoyToUnicode'
    const sourceLabel = isBijoyToUni ? 'Bijoy text' : 'Unicode / Avro text'
    const targetLabel = isBijoyToUni ? 'Unicode result' : 'Bijoy result'
    const buttonLabel = isBijoyToUni ? 'Convert to Unicode' : 'Convert to Bijoy'

    return (
        <div className="space-y-6">
            <Card className="border-border/50 bg-muted/15 p-5 sm:p-6">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <h2 className="text-xl font-black tracking-tight text-white">{title}</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/60 p-1">
                            <button
                                onClick={() => handleDirectionChange('bijoyToUnicode')}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                    isBijoyToUni ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Bijoy <ArrowRight className="h-3.5 w-3.5" /> Unicode
                            </button>
                            <button
                                onClick={() => handleDirectionChange('unicodeToBijoy')}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                    !isBijoyToUni ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Unicode <ArrowRight className="h-3.5 w-3.5" /> Bijoy
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={handleSwap} title="Swap text and flip direction" className="text-slate-400 hover:bg-slate-700 hover:text-white">
                                <ArrowRightLeft className="mr-1.5 h-4 w-4" /> Swap
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleClear} title="Clear all" className="text-slate-400 hover:bg-red-500/10 hover:text-red-400">
                                <Trash2 className="mr-1.5 h-4 w-4" /> Clear
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:items-stretch">
                <Card className="border-border/50 bg-card/60 p-4 sm:p-5">
                    <div className="space-y-3">
                        <label className="px-1 text-xs font-bold uppercase tracking-widest text-slate-400">{sourceLabel}</label>
                        <Textarea
                            placeholder="Paste your Bangla text here..."
                            value={sourceText}
                            onChange={(e) => {
                                setSourceText(e.target.value)
                                setIsConverted(false)
                            }}
                            spellCheck={false}
                            className="min-h-[280px] resize-none rounded-xl border-2 border-slate-700 bg-slate-900 p-4 text-base transition-colors placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-0"
                        />
                        <p className="px-1 text-xs leading-relaxed text-slate-500">
                            Text that looks like random English letters, for example &quot;Avgvi&quot;, is normal Bijoy format.
                        </p>
                    </div>
                </Card>

                <div className="flex items-center justify-center py-1 xl:py-6">
                    <Button
                        onClick={handleConvert}
                        size="lg"
                        className={`h-14 w-full px-8 text-sm font-black uppercase tracking-wider shadow-xl transition-all active:scale-95 xl:w-auto ${
                            isBijoyToUni
                                ? 'bg-blue-600 text-white shadow-blue-900/50 hover:bg-blue-500'
                                : 'bg-purple-600 text-white shadow-purple-900/50 hover:bg-purple-500'
                        }`}
                    >
                        {buttonLabel}
                    </Button>
                </div>

                <Card className="border-border/50 bg-card/60 p-4 sm:p-5">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{targetLabel}</label>
                            {isConverted && (
                                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                                </span>
                            )}
                        </div>
                        <Textarea
                            readOnly
                            placeholder="Converted text will appear here..."
                            value={targetText}
                            onClick={(e) => isConverted && (e.target as HTMLTextAreaElement).select()}
                            className={`min-h-[280px] resize-none rounded-xl border-2 p-4 text-base transition-all placeholder:text-slate-600 ${
                                isConverted
                                    ? 'cursor-text border-emerald-500/40 bg-slate-900 text-slate-100'
                                    : 'cursor-not-allowed border-slate-700 bg-slate-900/50 text-slate-500'
                            }`}
                        />
                        <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-500">Click the result to select all, or use the copy action.</p>
                            <Button
                                onClick={handleCopy}
                                disabled={!targetText}
                                size="sm"
                                className={`h-9 px-4 text-xs font-bold ${
                                    isConverted
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                        : 'cursor-not-allowed bg-slate-800 text-slate-500'
                                }`}
                            >
                                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="border-border/50 bg-black/20 p-4">
                <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <span>100% browser-based. Your text never leaves your device.</span>
                    <span>Supports complex conjuncts and legacy Bijoy workflows.</span>
                </div>
            </Card>
        </div>
    )
}
