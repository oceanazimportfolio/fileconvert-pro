'use client'

import Link from 'next/link'
import { Zap, Shield } from 'lucide-react'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-slate-700/50 mt-16 bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
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

                {/* Attribution Section */}
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-slate-500 text-sm font-medium">© {currentYear} ConvertFiles</span>

                        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium">
                            <Link href="/privacy-policy" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors">Terms</Link>
                            <Link href="/contact" className="text-slate-400 hover:text-blue-400 transition-colors">Contact</Link>
                            <Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors">About</Link>
                        </nav>
                    </div>

                    <div className="pt-4 border-t border-slate-800/50 w-full max-w-xs mx-auto">
                        <p className="text-slate-500 text-xs tracking-widest uppercase mb-1">Created By</p>
                        <a
                            href="https://azimulhaque.qzz.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-bold hover:text-blue-400 transition-colors text-base group inline-flex items-center gap-1"
                        >
                            Azimul Haque
                            <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
