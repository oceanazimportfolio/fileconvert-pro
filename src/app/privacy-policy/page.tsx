import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Footer } from '@/components/Footer'
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Cookie } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | ConvertFiles',
  description: 'Read the ConvertFiles privacy policy. Learn how our browser-based tools process your data locally to ensure maximum privacy and security.',
  openGraph: {
    title: 'Privacy Policy | ConvertFiles',
    description: 'Learn how our browser-based tools process your data locally to ensure maximum privacy.',
    url: 'https://convertfiles.qzz.io/privacy-policy/',
    siteName: 'ConvertFiles',
    type: 'website',
  },
  alternates: {
    canonical: 'https://convertfiles.qzz.io/privacy-policy/',
  }
}

export default function PrivacyPolicyPage() {
    const lastUpdated = "March 15, 2026"

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
                            <div className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                ConvertFiles
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
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 text-sm">Last Updated: {lastUpdated}</p>
                </div>

                <div className="space-y-10 text-slate-300 leading-relaxed">
                    {/* Key Principle Card */}
                    <Card className="bg-blue-500/5 border-blue-500/20 p-6 md:p-8">
                        <div className="flex items-start gap-4">
                            <ShieldCheck className="w-10 h-10 text-blue-400 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">Our Commitment to Privacy</h2>
                                <p className="text-slate-300">
                                    We built this platform to prioritize user privacy.
                                    <strong> Processing happens locally in your browser.</strong>
                                    We aim to minimize data collection while providing powerful tools.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-blue-400" />
                            1. Local vs. Server-Side Processing
                        </h2>
                        <p className="mb-4">
                            Unlike traditional online converters, ConvertFiles utilizes advanced browser technologies (JavaScript, WebAssembly)
                            to process your data directly on your device. When you "Upload" a file, it is loaded into your browser's memory.
                            The processing computations run locally on your hardware.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <EyeOff className="w-6 h-6 text-blue-400" />
                            2. Data We Collect
                        </h2>
                        <p className="mb-4">
                            We do not collect personal information like names, email addresses (unless you contact us), or phone numbers.
                            However, to maintain and improve our service, we may collect:
                        </p>
                        <ul className="list-disc pl-6 space-y-3">
                            <li><strong>Usage Analytics:</strong> Anonymous data about which tools are used most frequently to help us prioritize improvements.</li>
                            <li><strong>Technical Logs:</strong> Information about browser types and device categories to ensure cross-platform compatibility.</li>
                            <li><strong>Error Reports:</strong> Disassociated error logs if a tool fails to function, helping us fix technical bugs.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <Cookie className="w-6 h-6 text-blue-400" />
                            3. Cookies and Advertising
                        </h2>
                        <p className="mb-4">
                            We use cookies and similar technologies to enhance your experience and serve relevant advertisements.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                                <h3 className="text-white font-bold mb-2">Google AdSense</h3>
                                <p className="text-sm text-slate-400">
                                    Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits
                                    to this website or other websites. Google's use of advertising cookies enables it and its partners
                                    to serve ads to users based on their visit to your sites and/or other sites on the Internet.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                                <h3 className="text-white font-bold mb-2">Your Choices</h3>
                                <p className="text-sm text-slate-400">
                                    Users may opt out of personalized advertising by visiting
                                    <a href="https://www.google.com/settings/ads" target="_blank" className="text-blue-400 hover:underline mx-1">Ads Settings</a>.
                                    Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising
                                    by visiting <a href="http://www.aboutads.info/choices/" target="_blank" className="text-blue-400 hover:underline mx-1">aboutads.info</a>.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
                        <p>
                            We may use third-party tools like Google Analytics to understand traffic patterns.
                            These services have their own privacy policies. We encourage you to review them to understand how they handle data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Contact Information</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us via our
                            <Link href="/contact" className="text-blue-400 font-bold hover:underline ml-1">contact form</Link>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
