import Link from "next/link";
import { Shield, FileText, Scale, AlertTriangle } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="flex-1 w-full bg-char min-h-screen">
            {/* Header */}
            <div className="relative py-24 px-4 border-b border-smoke overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-ember/5 to-transparent" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-7xl md:text-8xl font-bebas text-white-app tracking-tight mb-4 text-center">
                        TERMS OF <span className="text-ember">SERVICE</span>
                    </h1>
                    <p className="font-barlow-condensed text-xl text-smoke text-center tracking-widest uppercase italic">
                        The legal framework of the kitchen arena.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16 font-barlow text-smoke text-lg leading-relaxed flex flex-col gap-12">

                {/* Intro */}
                <section>
                    <p>
                        Welcome to <span className="text-white-app font-bold">The Kitchen</span>. By accessing or using our platform, you agree to be bound by these Terms of Service. If you cannot take the heat, or do not agree with any part of these terms, you are prohibited from using the service.
                    </p>
                    <p className="mt-4 text-sm text-smoke/60">Last Updated: March 11, 2026</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-ash border border-smoke flex flex-col gap-4">
                        <Shield className="w-8 h-8 text-ember" />
                        <h3 className="text-2xl font-bebas text-white-app tracking-wide">1. ELIGIBILITY</h3>
                        <p className="text-sm">You must be at least 18 years of age to participate in battles or create an account. By using the platform, you represent that you meet this requirement.</p>
                    </div>
                    <div className="p-6 bg-ash border border-smoke flex flex-col gap-4">
                        <FileText className="w-8 h-8 text-ember" />
                        <h3 className="text-2xl font-bebas text-white-app tracking-wide">2. CONTENT RIGHTS</h3>
                        <p className="text-sm">You retain ownership of your lyrics. However, by performing on The Kitchen, you grant us a perpetual, worldwide license to record, stream, and distribute the content.</p>
                    </div>
                </div>

                {/* Main Content */}
                <section className="flex flex-col gap-8">
                    <div className="flex gap-6">
                        <Scale className="w-10 h-10 text-ember shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bebas text-white-app tracking-wide mb-3">3. CODE OF CONDUCT</h2>
                            <p>Users must respect the spirit of competition. While disses are part of the game, the following are strictly prohibited:</p>
                            <ul className="list-disc ml-6 mt-4 flex flex-col gap-2 text-sm">
                                <li>Real-world threats of violence or bodily harm.</li>
                                <li>Doxxing or revealing private information of other users.</li>
                                <li>The use of the platform for any illegal activities.</li>
                                <li>Harassment outside the scope of the battle arena.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <AlertTriangle className="w-10 h-10 text-ember shrink-0 mt-1" />
                        <div>
                            <h2 className="text-3xl font-bebas text-white-app tracking-wide mb-3">4. LIMITATION OF LIABILITY</h2>
                            <p>The Kitchen is a platform for artistic expression. We are not responsible for the content of individual battles, the accuracy of user claims, or any emotional distress caused by losing a match or receiving a lyrical diss.</p>
                        </div>
                    </div>
                </section>

                <section className="p-8 border border-ember/30 bg-ember/5 text-center">
                    <h2 className="text-3xl font-bebas text-white-app tracking-wide mb-4">QUESTIONS?</h2>
                    <p className="mb-6">If you have questions regarding these terms, contact our legal team.</p>
                    <Link href="/contact" className="inline-block px-8 py-3 bg-ember text-white-app font-bebas text-xl tracking-widest clip-angled hover:bg-flame transition-colors">
                        CONTACT LEGAL
                    </Link>
                </section>
            </div>
        </div>
    );
}
