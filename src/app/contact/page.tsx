"use client";

import { Mail, MessageSquare, Twitter, Globe, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="flex-1 w-full bg-char min-h-screen">
            {/* Header */}
            <div className="relative py-24 px-4 border-b border-smoke overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-heat/5 to-transparent" />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h1 className="text-7xl md:text-9xl font-bebas text-white-app tracking-tight mb-4 uppercase">
                        SET THE <span className="text-heat">TABLE</span>
                    </h1>
                    <p className="font-barlow-condensed text-xl text-smoke tracking-[0.2em] uppercase italic">
                        Questions? Partnerships? Technical Issues? Speak up.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Contact Info */}
                <div className="flex flex-col gap-12">
                    <section>
                        <h2 className="text-4xl font-bebas text-white-app tracking-wide mb-8 underline decoration-heat decoration-4 underline-offset-8">DIRECT COMMS</h2>
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-ash border border-smoke flex items-center justify-center text-smoke group-hover:text-heat transition-colors clip-angled">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bebas text-white-app tracking-wider">EMAIL US</h3>
                                    <p className="text-smoke font-barlow">hello@thekitchen.live</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-ash border border-smoke flex items-center justify-center text-smoke group-hover:text-heat transition-colors clip-angled">
                                    <Twitter className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bebas text-white-app tracking-wider">FOLLOW THE SMOKE</h3>
                                    <p className="text-smoke font-barlow">@TheKitchenLive</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-ash border border-smoke flex items-center justify-center text-smoke group-hover:text-heat transition-colors clip-angled">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bebas text-white-app tracking-wider">DISCORD ARENA</h3>
                                    <p className="text-smoke font-barlow">Join 15k+ Battle Fans</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-ash border border-smoke p-8">
                        <h3 className="text-2xl font-bebas text-white-app tracking-wide mb-4">HEADQUARTERS</h3>
                        <p className="text-smoke font-barlow leading-relaxed">
                            The Kitchen is a decentralized platform with its core engineering team operating out of Detroit and NYC. We don't have a physical "Kitchen"—the arena exists wherever you have bars.
                        </p>
                    </section>
                </div>

                {/* Contact Form */}
                <div className="bg-ash border border-smoke p-10 relative">
                    <div className="absolute top-0 right-10 -translate-y-1/2 px-6 py-2 bg-heat text-char font-bebas text-2xl tracking-widest clip-angled shadow-2xl">
                        SEND A MESSAGE
                    </div>

                    <form className="flex flex-col gap-8 mt-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black font-barlow uppercase text-smoke tracking-widest">Full Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full bg-char border border-smoke p-4 focus:border-heat outline-none text-white-app transition-colors font-barlow text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black font-barlow uppercase text-smoke tracking-widest">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-char border border-smoke p-4 focus:border-heat outline-none text-white-app transition-colors font-barlow text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black font-barlow uppercase text-smoke tracking-widest">Subject</label>
                            <select className="w-full bg-char border border-smoke p-4 focus:border-heat outline-none text-white-app transition-colors font-barlow uppercase text-xs tracking-widest">
                                <option>General Inquiry</option>
                                <option>Artist Application Follow-up</option>
                                <option>Partnership Proposal</option>
                                <option>Tech Support / Bug Report</option>
                                <option>Press Inquiry</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black font-barlow uppercase text-smoke tracking-widest">Your Message</label>
                            <textarea
                                rows={5}
                                placeholder="What's cooking?"
                                className="w-full bg-char border border-smoke p-4 focus:border-heat outline-none text-white-app transition-colors font-barlow text-sm resize-none"
                            ></textarea>
                        </div>

                        <button
                            className="w-full py-5 bg-heat hover:bg-heat/80 text-char font-bebas text-2xl tracking-widest flex items-center justify-center gap-3 transition-all clip-angled shadow-[0_5px_25px_rgba(255,80,0,0.4)] active:scale-95"
                        >
                            IGNITE COMMS <Send className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
