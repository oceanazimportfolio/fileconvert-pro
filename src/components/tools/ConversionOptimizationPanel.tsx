'use client'

import Link from 'next/link'
import { AlertCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/fileUtils'
import {
  type ImageOptimizationResult,
  type OptimizationSeverity,
  getFormatLabel,
} from '@/lib/imagePipeline'

interface ConversionOptimizationPanelProps {
  optimizeOutput: boolean
  onOptimizeOutputChange?: (value: boolean) => void
  result?: ImageOptimizationResult
  className?: string
  compact?: boolean
}

const STATUS_LABELS: Record<OptimizationSeverity, string> = {
  smaller: 'Smaller output',
  similar: 'Similar size',
  'significantly-larger': 'Significantly larger',
  'much-larger': 'Much larger',
}

export function ConversionOptimizationPanel({
  optimizeOutput,
  onOptimizeOutputChange,
  result,
  className,
  compact = false,
}: ConversionOptimizationPanelProps) {
  const statusTone = result?.severity === 'smaller'
    ? 'success'
    : result?.severity === 'significantly-larger' || result?.severity === 'much-larger'
      ? 'warning'
      : 'neutral'

  return (
    <Card
      className={cn(
        'border-border/60 bg-card/60',
        statusTone === 'success' && 'border-emerald-500/30 bg-emerald-500/5',
        statusTone === 'warning' && 'border-red-500/30 bg-red-500/5',
        className
      )}
    >
      <div className={cn('space-y-4 p-4 sm:p-5', compact && 'space-y-3 p-3.5')}>
        {onOptimizeOutputChange && (
          <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-[11px] font-black uppercase tracking-widest text-white">
                Optimize output size
              </Label>
              <p className="max-w-lg text-sm text-muted-foreground">
                Browser-safe optimization is on by default to keep downloads smaller when possible.
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-black/20 px-3 py-2 sm:min-w-[130px] sm:justify-end">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                {optimizeOutput ? 'On' : 'Off'}
              </span>
              <Switch
                checked={optimizeOutput}
                onCheckedChange={onOptimizeOutputChange}
              />
            </div>
          </div>
        )}

        {result ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider',
                  statusTone === 'success' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
                  statusTone === 'warning' && 'border-red-500/30 bg-red-500/10 text-red-300'
                )}
              >
                {STATUS_LABELS[result.severity]}
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-xs uppercase tracking-wider">
                {result.qualityLabel}
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-xs uppercase tracking-wider">
                {result.width} x {result.height}
              </Badge>
            </div>

            <div className="space-y-2 rounded-xl border border-white/5 bg-black/20 p-3">
              <div className="flex items-start gap-2 text-sm font-semibold text-white sm:text-[15px]">
                {statusTone === 'success' ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className={cn(
                    'mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400',
                    statusTone === 'warning' && 'text-red-400'
                  )} />
                )}
                <span className="leading-relaxed">
                  {getFormatLabel(result.sourceFormat)} ({formatFileSize(result.inputSize)}) {'->'} {getFormatLabel(result.outputFormat)} ({formatFileSize(result.outputSize)}, {result.qualityLabel})
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {result.explanation}
              </p>
            </div>

            {result.suggestions.length > 0 && (
              <div className="space-y-3 rounded-xl border border-white/5 bg-black/20 p-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>{result.suggestionTitle ?? 'Suggested next step'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.suggestions.map((suggestion) => (
                    <Link key={`${suggestion.href}-${suggestion.label}`} href={suggestion.href}>
                      <Button variant="outline" size="sm" className="h-9 border-border/60 bg-card/80 px-3 text-xs font-bold">
                        {suggestion.label}
                        <ArrowRight className="ml-1.5 h-3 w-3" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Output summaries and size warnings will appear here after processing.
          </p>
        )}
      </div>
    </Card>
  )
}
