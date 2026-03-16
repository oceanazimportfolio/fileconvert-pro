'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Footer } from '@/components/Footer'
import { ArrowLeft, Scale, FileText, AlertTriangle, UserCheck } from 'lucide-react'

export default function TermsOfServicePage() {
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
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-slate-500 text-sm">Last Updated: {lastUpdated}</p>
                </div>

                <div className="space-y-10 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <UserCheck className="w-6 h-6 text-blue-400" />
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing and using ConvertFiles, you agree to comply with and be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our services. These terms apply to all visitors,
                            users, and others who access or use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-blue-400" />
                            2. Description of Service
                        </h2>
                        <p className="mb-4">
                            ConvertFiles provides a suite of online tools for image conversion, file optimization,
                            text manipulation, and developer utilities. All processing is executed locally in the user's browser.
                            We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Scale className="w-6 h-6 text-blue-400" />
                            3. User Responsibilities
                        </h2>
                        <ul className="list-disc pl-6 space-y-3">
                            <li><strong>Legal Use:</strong> You agree to use the services only for lawful purposes and in a way that does not infringe the rights of others.</li>
                            <li><strong>Ownership:</strong> You retain all rights to the files you process. We do not claim any ownership over your data.</li>
                            <li><strong>No Abuse:</strong> You must not attempt to interfere with the proper working of the site or bypass any security measures.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                            4. Disclaimer of Warranties
                        </h2>
                        <Card className="bg-amber-500/5 border-amber-500/20 p-6">
                            <p className="text-slate-300 italic">
                                The service is provided on an "AS IS" and "AS AVAILABLE" basis. ConvertFiles makes no warranties,
                                expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
                                implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
                                of intellectual property or other violation of rights.
                            </p>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            In no event shall ConvertFiles or its developers be liable for any damages (including, without limitation,
                            damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                            to use the materials on ConvertFiles, even if we have been notified orally or in writing of the possibility
                            of such damage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
                        <p>
                            The design, source code, and original content of ConvertFiles (excluding user-provided files) are the
                            exclusive property of the site owners and are protected by copyright, trademark, and other laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Changes to Terms</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-slate-700/50">
                        <p className="text-sm text-slate-500">
                            If you have any questions regarding these terms, please contact us at
                            <span className="text-blue-400 font-bold ml-1">hello@convertfiles.qzz.io</span>
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
