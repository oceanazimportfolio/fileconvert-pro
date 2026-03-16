import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/Footer'
import {
    ArrowLeft, Shield, Zap, Globe, Heart,
    Sparkles, CheckCircle, Code2
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About ConvertFiles | Privacy-First Online Tools',
  description: 'Learn about ConvertFiles. We build free, browser-based tools that prioritize your privacy by processing files locally on your device.',
  openGraph: {
    title: 'About ConvertFiles | Privacy-First Online Tools',
    description: 'Learn about ConvertFiles. We build free tools that process your files locally in your browser.',
    url: 'https://convertfiles.qzz.io/about/',
    siteName: 'ConvertFiles',
    type: 'website',
  },
  alternates: {
    canonical: 'https://convertfiles.qzz.io/about/',
  }
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-2 border-blue-500">
            {/* Header */}
            <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                                <img src="/logo.png" alt="ConvertFiles" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    ConvertFiles
                                </div>
                            </div>
                        </Link>

                        <Link href="/">
                            <Button variant="ghost" className="text-slate-400 hover:text-white">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Tools
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Hero */}
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Our Mission
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Privacy-First <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Online Tools</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                        At ConvertFiles, we believe that powerful software shouldn't come at the cost of your privacy or your budget.
                    </p>
                </div>

                {/* Story Section */}
                <section className="space-y-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white tracking-tight">The Core Philosophy</h2>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                Most online conversion tools work by uploading your private files to a remote server,
                                processing them in a "black box," and letting you download them back.
                                This poses significant privacy risks and wastes bandwidth.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <p className="text-slate-400 text-sm">We process files locally to keep your data under your control.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <p className="text-slate-400 text-sm">We prioritize speed by utilizing your local hardware.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <p className="text-slate-400 text-sm">Everything we build is 100% free, forever.</p>
                                </div>
                            </div>
                        </div>
                        <Card className="bg-slate-800/40 border-slate-700/50 p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Code2 className="w-32 h-32 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Under the Hood</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Our tools leverage modern web technologies like WebAssembly, JavaScript Streams, and the
                                latest browser APIs to handle heavy computation—like image processing—directly
                                on your machine.
                            </p>
                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 font-mono text-xs text-blue-400/80">
                // Processing happens in your browser environment<br />
                                processLocal(file).then(downloadResult);
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
                        {[
                            { icon: Shield, title: "Privacy-Focused", desc: "Local processing means enhanced confidentiality and control over your files." },
                            { icon: Zap, title: "Fast Performance", desc: "No waiting for uploads or long processing queues." },
                            { icon: Globe, title: "Browser-Based", desc: "No additional software installation required." }
                        ].map((item, i) => (
                            <Card key={i} className="bg-slate-800/20 border-slate-700/30 p-6 text-center hover:bg-slate-800/40 transition-colors">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                    <item.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center py-12 border-t border-slate-700/50">
                        <h2 className="text-2xl font-bold text-white mb-6">Built for the Modern Web</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                            ConvertFiles is an evolving project. We are constantly adding new tools and optimizing
                            existing ones to ensure you have the best utility toolkit available in your browser.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 px-8 font-bold">
                                    Explore Tools
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:text-white px-8 font-bold">
                                    Get in Touch
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
