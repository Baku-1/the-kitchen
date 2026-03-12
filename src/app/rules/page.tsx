import { Zap, Skull, Flame, Mic2, ShieldAlert, Award } from "lucide-react";

export default function RulesPage() {
    return (
        <div className="flex-1 w-full bg-char min-h-screen">
            {/* Header */}
            <div className="relative py-24 px-4 border-b border-smoke overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-t from-ember/10 to-transparent" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-7xl md:text-9xl font-bebas text-white-app tracking-tighter mb-4">
                        KITCHEN <span className="text-ember">RULES</span>
                    </h1>
                    <p className="font-barlow-condensed text-xl text-smoke tracking-[0.3em] uppercase italic">
                        The ultimate guide to elite battle etiquette.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col gap-16 font-barlow text-smoke">

                {/* Core Philosophy */}
                <section className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bebas text-white-app tracking-wide mb-6">THE ART OF THE DISS</h2>
                    <p className="text-lg italic leading-relaxed">
                        "The Kitchen is where we separate the rappers from the legends. We value wit, wordplay, and delivery over noise and aggression. In this arena, your skill is your only weapon."
                    </p>
                </section>

                {/* Major Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Gang References */}
                    <div className="p-8 bg-ash border border-smoke flex flex-col gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-ember/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-ember/10 transition-colors" />
                        <ShieldAlert className="w-12 h-12 text-ember" />
                        <div>
                            <h3 className="text-3xl font-bebas text-white-app tracking-wide mb-2 uppercase italic">1. No Gang References</h3>
                            <p className="text-sm leading-relaxed text-smoke/90">
                                This is a platform for hip-hop artistry, not set-tripping. The following will result in an immediate and permanent ban:
                            </p>
                            <ul className="list-disc ml-4 mt-4 text-xs flex flex-col gap-2">
                                <li>The use of gang signs or sets in video streams.</li>
                                <li>Territorial claims or set-shoutouts.</li>
                                <li>Mocking gang-related tragedies or deaths.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Cursing */}
                    <div className="p-8 bg-ash border border-smoke flex flex-col gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-flame/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-flame/10 transition-colors" />
                        <Mic2 className="w-12 h-12 text-flame" />
                        <div>
                            <h3 className="text-3xl font-bebas text-white-app tracking-wide mb-2 uppercase italic">2. Limit Profanity</h3>
                            <p className="text-sm leading-relaxed text-smoke/90">
                                If you have to curse to be funny or hard, you're in the wrong kitchen.
                            </p>
                            <p className="text-xs mt-4 italic text-ember">
                                "Lyrical skill &gt; Excessive cursing."
                            </p>
                            <p className="text-xs mt-2 text-smoke/70">
                                We encourage artists to find creative synonyms and complex wordplay to replace basic profanity. Excessive cursing may affect your Clout Score and eligibility for Featured Battles.
                            </p>
                        </div>
                    </div>

                    {/* Threats */}
                    <div className="p-8 bg-ash border border-smoke flex flex-col gap-6 relative overflow-hidden group">
                        <Skull className="w-12 h-12 text-smoke" />
                        <div>
                            <h3 className="text-3xl font-bebas text-white-app tracking-wide mb-2 uppercase italic">3. Keep it on the Mic</h3>
                            <p className="text-sm leading-relaxed text-smoke/90">
                                Real-world threats against an artist or their family are strictly prohibited. The "Kitchen" is a verbal arena—leave the violence outside.
                            </p>
                        </div>
                    </div>

                    {/* Originality */}
                    <div className="p-8 bg-ash border border-smoke flex flex-col gap-6 relative overflow-hidden group">
                        <Award className="w-12 h-12 text-smoke" />
                        <div>
                            <h3 className="text-3xl font-bebas text-white-app tracking-wide mb-2 uppercase italic">4. 100% Originality</h3>
                            <p className="text-sm leading-relaxed text-smoke/90">
                                Biting bars is the ultimate sin. If we find out you used an opponent's old verse or stole from a battle legend, your account will be deleted instantly.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Final Note */}
                <section className="text-center p-12 border border-ember/20 bg-ember/5">
                    <Zap className="w-10 h-10 text-ember mx-auto mb-4" />
                    <h2 className="text-3xl font-bebas text-white-app tracking-wide mb-4 underline decoration-ember decoration-4 underline-offset-8">ENFORCEMENT</h2>
                    <p className="text-lg">
                        Moderators monitor all live streams and historical battles. <br />
                        <span className="text-white-app font-bold">First offense:</span> Warning & Clout Deduction. <br />
                        <span className="text-ember font-bold">Second offense:</span> Permanent Arena Ban.
                    </p>
                </section>

            </div>
        </div>
    );
}
