'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/Footer'
import {
    ArrowLeft, Mail, MessageSquare, Send,
    Sparkles, CheckCircle, Info
} from 'lucide-react'

export default function ContactPage() {
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
                        Support & Feedback
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Touch</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                        Have a question about our browser-based tools? Found a bug?
                        Or just want to say hello? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-8">
                    {/* Contact Methods */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="bg-slate-800/40 border-slate-700/50 p-6 hover:bg-slate-800/60 transition-colors group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                    <Mail className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Email Us</h3>
                                    <p className="text-xs text-slate-500">Fast response within 24h</p>
                                </div>
                            </div>
                            <p className="text-blue-400 font-medium text-sm break-all">hello@convertfiles.qzz.io</p>
                        </Card>

                        <Card className="bg-slate-800/40 border-slate-700/50 p-6 hover:bg-slate-800/60 transition-colors group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                                    <MessageSquare className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Social Media</h3>
                                    <p className="text-xs text-slate-500">Stay updated</p>
                                </div>
                            </div>
                            <p className="text-purple-400 font-medium text-sm">@convertfiles</p>
                        </Card>

                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                            <div className="flex items-center gap-2 text-slate-400 mb-4 font-bold text-xs uppercase tracking-widest">
                                <Info className="w-4 h-4" />
                                Quick Tip
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed italic">
                                "For bug reports, mentioning your browser version and the specific tool helps us fix issues lightning fast."
                            </p>
                        </div>
                    </div>

                    {/* Contact Info Card */}
                    <div className="md:col-span-3">
                        <Card className="bg-slate-800/40 border-slate-700/50 p-4 sm:p-8 h-full">
                            <div className="flex flex-col h-full justify-center text-center space-y-6">
                                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto border-2 border-blue-500/20">
                                    <Send className="w-10 h-10 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Connect with us</h3>
                                    <p className="text-slate-400 leading-relaxed mb-8">
                                        We are currently expanding our support team. For the fastest response,
                                        please reach out to us directly via email. We read every single message.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 flex items-center gap-3 text-left">
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        <p className="text-sm text-slate-300">Feature requests & tool suggestions</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 flex items-center gap-3 text-left">
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        <p className="text-sm text-slate-300">Bug reports & technical issues</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 flex items-center gap-3 text-left">
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        <p className="text-sm text-slate-300">Partnerships & integration ideas</p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <a href="mailto:hello@convertfiles.qzz.io">
                                        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-500 font-bold px-12 shadow-xl shadow-blue-500/20">
                                            Send Email Now
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* FAQ Preview */}
                <section className="mt-24 text-center">
                    <h2 className="text-2xl font-bold text-white mb-12">Frequently Asked Questions</h2>
                    <div className="grid sm:grid-cols-2 gap-6 text-left">
                        <Card className="bg-slate-800/20 border-slate-700/30 p-6">
                            <h4 className="text-white font-bold mb-2 italic">Is it really free?</h4>
                            <p className="text-slate-400 text-sm">Yes, 100% free with no hidden charges or premium versions.</p>
                        </Card>
                        <Card className="bg-slate-800/20 border-slate-700/30 p-6">
                            <h4 className="text-white font-bold mb-2 italic">Where are my files uploaded?</h4>
                            <p className="text-slate-400 text-sm">Nowhere. All processing is done locally in your browser.</p>
                        </Card>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
