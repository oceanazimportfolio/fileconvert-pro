'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Copy, Trash2, ArrowRight, CheckCircle2, ArrowRightLeft } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { bijoyToUnicode, unicodeToBijoy } from '@/lib/bangla-converter'

type ConversionDirection = 'bijoyToUnicode' | 'unicodeToBijoy';

interface BanglaConverterProps {
    defaultDirection: ConversionDirection;
    title: string;
    description: string;
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

    useEffect(() => {
        if (sourceText) setIsConverted(false)
    }, [sourceText])

    const handleConvert = () => {
        if (!sourceText.trim()) {
            toast({ title: "Empty input", description: "Paste some text first.", variant: "destructive" })
            return
        }
        try {
            const result = direction === 'bijoyToUnicode' ? bijoyToUnicode(sourceText) : unicodeToBijoy(sourceText)
            setTargetText(result)
            setIsConverted(true)
            trackEvent('convert_clicked', { direction, length: sourceText.length })
        } catch {
            toast({ title: "Conversion Error", description: "An error occurred.", variant: "destructive" })
        }
    }

    const handleSwap = () => {
        const newDir: ConversionDirection = direction === 'bijoyToUnicode' ? 'unicodeToBijoy' : 'bijoyToUnicode'
        setDirection(newDir)
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
            toast({ title: "Nothing to copy", description: "Convert some text first.", variant: "destructive" })
            return
        }
        try {
            await navigator.clipboard.writeText(targetText)
            trackEvent('copy_clicked', { direction, length: targetText.length })
            toast({ title: "Copied!", description: "Text copied to clipboard." })
        } catch {
            toast({ title: "Copy failed", variant: "destructive" })
        }
    }

    const isBijoyToUni = direction === 'bijoyToUnicode'
    const sourceLabel = isBijoyToUni ? 'Bijoy text' : 'Unicode / Avro text'
    const targetLabel = isBijoyToUni ? 'Unicode result' : 'Bijoy result'
    const btnLabel = isBijoyToUni ? 'Convert to Unicode' : 'Convert to Bijoy'

    return (
        <div className="w-full space-y-4">
            {/* Direction Selector */}
            <div className="flex items-center justify-between flex-wrap gap-3 px-1">
                <div className="flex items-center gap-2 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
                    <button
                        onClick={() => { setDirection('bijoyToUnicode'); setTargetText(''); setIsConverted(false) }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isBijoyToUni ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Bijoy <ArrowRight className="w-3.5 h-3.5" /> Unicode
                    </button>
                    <button
                        onClick={() => { setDirection('unicodeToBijoy'); setTargetText(''); setIsConverted(false) }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!isBijoyToUni ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Unicode <ArrowRight className="w-3.5 h-3.5" /> Bijoy
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleSwap} title="Swap and flip direction" className="text-slate-400 hover:text-white hover:bg-slate-700">
                        <ArrowRightLeft className="w-4 h-4 mr-1.5" /> Swap
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleClear} title="Clear all" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4 mr-1.5" /> Clear
                    </Button>
                </div>
            </div>

            {/* Main converter layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">

                {/* ── Input ── */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">{sourceLabel}</label>
                    <Textarea
                        placeholder="Paste your Bangla text here…"
                        value={sourceText}
                        onChange={e => setSourceText(e.target.value)}
                        spellCheck={false}
                        className="flex-1 min-h-[260px] resize-none text-base p-4 bg-slate-900 border-2 border-slate-700 focus:border-blue-500/60 focus:ring-0 rounded-xl placeholder:text-slate-600 transition-colors"
                    />
                    <p className="text-[11px] text-slate-500 px-1">
                        💡 Text that looks like random English letters (e.g. "Avgvi") is normal Bijoy format.
                    </p>
                </div>

                {/* ── Center controls ── */}
                <div className="flex lg:flex-col items-center justify-center gap-3 py-2">
                    <Button
                        onClick={handleConvert}
                        size="lg"
                        className={`h-14 px-8 text-sm font-black uppercase tracking-wider rounded-xl shadow-xl active:scale-95 transition-all ${isBijoyToUni
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50'
                                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/50'
                            }`}
                    >
                        <span className="hidden lg:block">{btnLabel}</span>
                        <span className="block lg:hidden">Convert</span>
                    </Button>
                </div>

                {/* ── Output ── */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{targetLabel}</label>
                        {isConverted && (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                            </span>
                        )}
                    </div>
                    <div className="relative flex-1">
                        <Textarea
                            readOnly
                            placeholder="Converted text will appear here…"
                            value={targetText}
                            onClick={e => isConverted && (e.target as HTMLTextAreaElement).select()}
                            className={`min-h-[260px] h-full resize-none text-base p-4 border-2 rounded-xl placeholder:text-slate-600 transition-all ${isConverted
                                    ? 'bg-slate-900 border-emerald-500/40 text-slate-100 cursor-text'
                                    : 'bg-slate-900/50 border-slate-700 text-slate-500 cursor-not-allowed'
                                }`}
                        />
                    </div>
                    <div className="flex items-center justify-between px-1">
                        <p className="text-[11px] text-slate-500">Click text to select all, or use Copy below.</p>
                        <Button
                            onClick={handleCopy}
                            disabled={!targetText}
                            size="sm"
                            className={`h-8 px-4 text-xs font-bold rounded-lg transition-all ${isConverted
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
                        </Button>
                    </div>
                </div>
            </div>

            {/* Trust footer */}
            <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-slate-500 border-t border-slate-800">
                <span>✔ 100% browser-based — your text never leaves your device</span>
                <span className="hidden sm:block">✔ Supports complex conjuncts (juktakkhor)</span>
            </div>
        </div>
    )
}
