'use client'

import Link from 'next/link'
import { Zap, Shield, Globe } from 'lucide-react'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-slate-700/50 mt-16 bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand and Mission */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-white">FileConvert<span className="text-blue-400">.pro</span></span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            The ultimate free online toolkit for image conversion, developer utilities, and content creation.
                            100% browser-based for maximum privacy and speed.
                        </p>
                        <div className="flex flex-col gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                                No server-side processing
                            </span>
                            <span className="flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-green-400" />
                                Files never leave your device
                            </span>
                        </div>
                    </div>

                    {/* Navigation - Tools */}
                    <nav aria-label="Tool Categories">
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Tools</h3>
                        <ul className="space-y-3 text-sm text-slate-400 font-medium">
                            <li><Link href="/tools/image-converter" className="hover:text-blue-400 transition-colors">Image Converter</Link></li>
                            <li><Link href="/tools/json-formatter" className="hover:text-blue-400 transition-colors">JSON Formatter</Link></li>
                            <li><Link href="/tools/password-generator" className="hover:text-blue-400 transition-colors">Security Tools</Link></li>
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">All Utilities</Link></li>
                        </ul>
                    </nav>

                    {/* Company/Legal */}
                    <nav aria-label="Company Information">
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
                        <ul className="space-y-3 text-sm text-slate-400 font-medium">
                            <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </nav>

                    {/* Contact and Trust */}
                    <nav aria-label="Support">
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Support</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Have questions or feedback? We'd love to hear from you.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all uppercase tracking-widest"
                        >
                            Get in Touch
                        </Link>
                    </nav>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>© {currentYear}</span>
                        <span className="font-semibold text-slate-400">FileConvert.pro</span>
                        <span className="hidden md:inline text-slate-700">•</span>
                        <span className="hidden md:inline">Made with ♥ for the web</span>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link href="/privacy-policy" className="text-slate-500 hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-slate-500 hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
