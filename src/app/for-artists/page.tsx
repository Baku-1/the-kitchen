"use client";

import { Mic2, ShieldCheck, Video, Globe, Send, UserCheck } from "lucide-react";

export default function ForArtistsPage() {
    return (
        <div className="flex-1 w-full bg-char min-h-screen pb-24">
            {/* Header */}
            <div className="relative py-32 px-4 border-b border-smoke overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-char via-char/80 to-transparent" />
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <h1 className="text-8xl md:text-9xl font-bebas text-white-app tracking-tight mb-6">
                        STEP INTO <span className="text-ember">THE LIGHT</span>
                    </h1>
                    <p className="font-barlow-condensed text-2xl text-smoke tracking-[0.2em] uppercase italic max-w-2xl mx-auto">
                        We don't just host battles. We build legends. Ready to join the roster?
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-20">

                {/* Information & Agreement */}
                <div className="flex flex-col gap-12">
                    <section>
                        <h2 className="text-4xl font-bebas text-white-app tracking-wide mb-6 flex items-center gap-3">
                            <Mic2 className="w-8 h-8 text-ember" /> WHY THE KITCHEN?
                        </h2>
                        <div className="space-y-6 text-smoke text-lg font-barlow leading-relaxed">
                            <p>
                                The Kitchen is the premier global stage for P2P rap battles. We provide the infrastructure, the audience, and the clout—you provide the bars.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <ShieldCheck className="w-6 h-6 text-ember shrink-0 mt-1" />
                                    <span><strong className="text-white-app font-bebas tracking-wide">Elite Production:</strong> Low-latency, high-fidelity audio/video streaming powered by LiveKit.</span>
                                </li>
                                <li className="flex gap-4">
                                    <Video className="w-6 h-6 text-ember shrink-0 mt-1" />
                                    <span><strong className="text-white-app font-bebas tracking-wide">Global Reach:</strong> Your battles are archived, promoted, and voted on by fans across the globe.</span>
                                </li>
                                <li className="flex gap-4">
                                    <Globe className="w-6 h-6 text-ember shrink-0 mt-1" />
                                    <span><strong className="text-white-app font-bebas tracking-wide">Clout Economy:</strong> Rise through our ranked system and unlock featured matchups and monetization.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="p-8 bg-ash border border-smoke">
                        <h3 className="text-2xl font-bebas text-white-app tracking-wide mb-4 uppercase italic">Artist Content Agreement</h3>
                        <div className="text-sm text-smoke/80 font-barlow space-y-4 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
                            <p>By submitting this application and performing on any "The Kitchen" live stream, you ("Artist") agree to the following:</p>
                            <p><strong>1. Usage Rights:</strong> Artist grants The Kitchen a perpetual, irrevocable, worldwide license to use their image, voice, performance, and lyrical content for platform promotion, archives, and social media distribution.</p>
                            <p><strong>2. Conduct Compliance:</strong> Artist agrees to abide by all Community Rules, including the strict ban on gang references and sets. Breach of conduct results in immediate disqualification and clout forfeiture.</p>
                            <p><strong>3. Exclusivity:</strong> While we don't own your soul, Featured Artists agree not to perform the same specific verses on competing live-stream battle platforms within 30 days of their Kitchen appearance.</p>
                            <p><strong>4. Verification:</strong> All Artists must undergo a verification process. We reserve the right to reject any application for any reason.</p>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="w-5 h-5 border border-ember rounded flex items-center justify-center bg-ember/10">
                                <UserCheck className="w-3 h-3 text-ember" />
                            </div>
                            <span className="text-xs text-smoke font-barlow uppercase tracking-widest">Applying constitutes agreement to these terms.</span>
                        </div>
                    </section>
                </div>

                {/* Application Form */}
                <div className="bg-ash border border-smoke p-10 relative">
                    <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-2 bg-ember text-white-app font-bebas text-xl tracking-widest clip-angled shadow-xl">
                        APPLICATION PORTAL
                    </div>

                    <form className="flex flex-col gap-8 mt-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-xs font-barlow-condensed text-smoke uppercase tracking-widest">Artist Stage Name</label>
                            <input
                                type="text"
                                placeholder="e.g. MC GHOST"
                                className="w-full bg-char border border-smoke p-4 focus:border-ember outline-none text-white-app transition-colors font-bebas text-xl tracking-wider"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-barlow-condensed text-smoke uppercase tracking-widest">Primary Genre</label>
                                <select className="w-full bg-char border border-smoke p-4 focus:border-ember outline-none text-white-app transition-colors font-barlow uppercase text-sm tracking-widest">
                                    <option>Freestyle</option>
                                    <option>Written</option>
                                    <option>Melodic</option>
                                    <option>Drill</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-barlow-condensed text-smoke uppercase tracking-widest">Location</label>
                                <input
                                    type="text"
                                    placeholder="City, State/Country"
                                    className="w-full bg-char border border-smoke p-4 focus:border-ember outline-none text-white-app transition-colors font-barlow text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-barlow-condensed text-smoke uppercase tracking-widest">Sample Audio/Video Link (YouTube, SoundCloud, etc.)</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                className="w-full bg-char border border-smoke p-4 focus:border-ember outline-none text-white-app transition-colors font-barlow text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-barlow-condensed text-smoke uppercase tracking-widest">Social Media Handle (@instagram / @x)</label>
                            <input
                                type="text"
                                placeholder="@username"
                                className="w-full bg-char border border-smoke p-4 focus:border-ember outline-none text-white-app transition-colors font-barlow text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-barlow-condensed text-smoke uppercase tracking-widest">Brief Bio / Accolades</label>
                            <textarea
                                rows={4}
                                placeholder="Tell the Kitchen why you belong on the stove."
                                className="w-full bg-char border border-smoke p-4 focus:border-ember outline-none text-white-app transition-colors font-barlow text-sm resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            className="w-full py-5 bg-ember hover:bg-flame text-white-app font-bebas text-2xl tracking-widest flex items-center justify-center gap-3 transition-all clip-angled shadow-[0_4px_20px_rgba(255,69,0,0.3)] hover:shadow-[0_4px_30px_rgba(255,69,0,0.5)] active:scale-95"
                        >
                            SUBMIT APPLICATION <Send className="w-6 h-6" />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
