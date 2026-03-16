'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/Footer'
import {
    ArrowLeft, Mail, MessageSquare, Send,
    Sparkles, CheckCircle, Info, Loader2, AlertCircle
} from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
    const { toast } = useToast()
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        hpot: '' // Honeypot
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Anti-spam check
        if (formData.hpot) {
            setStatus('success')
            return
        }

        setStatus('submitting')

        try {
            const formDataToSubmit = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSubmit.append(key, value)
            })

            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formDataToSubmit
            })

            if (response.ok) {
                setStatus('success')
                setFormData({ name: '', email: '', subject: '', message: '', hpot: '' })
                toast({
                    title: "Message Sent!",
                    description: "We've received your message and will get back to you soon.",
                    variant: "default",
                })
            } else {
                throw new Error('Failed to send')
            }
        } catch (error) {
            setStatus('error')
            toast({
                title: "Error",
                description: "Failed to send your message. Please try again later.",
                variant: "destructive",
            })
        }
    }

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

            <main className="max-w-5xl mx-auto px-4 py-12">
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
                        Or just want to say hello? Use the form below to reach us.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Contact Methods Sidebar */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-slate-800/40 border-slate-700/50 p-6 group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <Mail className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Secure Contact</h3>
                                    <p className="text-xs text-slate-500">End-to-end encrypted relay</p>
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                We review all messages submitted through our secure form.
                                Our team typically responds within 24-48 business hours.
                            </p>
                        </Card>

                        <Card className="bg-slate-800/40 border-slate-700/50 p-6 group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
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

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <Card className="bg-slate-800/40 border-slate-700/50 p-1 sm:p-1 overflow-hidden">
                            {status === 'success' ? (
                                <div className="p-12 text-center space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto border-2 border-green-500/20 animate-in zoom-in duration-300">
                                        <CheckCircle className="w-10 h-10 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                        <p className="text-slate-400">
                                            Thank you for reaching out. We've received your message and our team will get back to you shortly.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setStatus('idle')}
                                        variant="outline"
                                        className="border-slate-700 text-slate-300 hover:text-white"
                                    >
                                        Send another message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Your Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="john@example.com"
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Subject</label>
                                        <input
                                            type="text"
                                            placeholder="How can we help?"
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder="Write your message here..."
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    {/* Honeypot Field - Hidden from users */}
                                    <div className="hidden">
                                        <input
                                            type="text"
                                            value={formData.hpot}
                                            onChange={(e) => setFormData({ ...formData, hpot: e.target.value })}
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                    >
                                        {status === 'submitting' ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>

                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 text-rose-400 text-sm justify-center animate-in fade-in duration-300">
                                            <AlertCircle className="w-4 h-4" />
                                            Failed to send. Please try again.
                                        </div>
                                    )}

                                    <p className="text-center text-xs text-slate-500">
                                        By submitting this form, you agree to our
                                        <Link href="/privacy-policy" className="text-blue-500/70 hover:text-blue-400 mx-1">Privacy Policy</Link>.
                                    </p>
                                </form>
                            )}
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
