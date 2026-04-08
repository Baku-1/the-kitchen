"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { sendChallenge } from "@/app/actions/battles";
import { Swords, Info, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function ChallengeForm() {
    const searchParams = useSearchParams();
    const to = searchParams.get("to") || "";

    const [opponent, setOpponent] = useState(to);
    const [genre, setGenre] = useState("freestyle");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (to) setOpponent(to);
    }, [to]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await sendChallenge({
                opponent_username: opponent,
                genre,
                title
            });
            setSuccess(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send challenge");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-24 w-full text-center animate-fade-in">
                <div className="w-24 h-24 bg-char border-4 border-ember rounded-full flex items-center justify-center mx-auto mb-8 text-ember shadow-[0_0_30px_rgba(255,69,0,0.2)]">
                    <Swords className="w-12 h-12" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bebas text-white-app mb-4 tracking-wide">CHALLENGE ISSUED.</h1>
                <p className="text-xl text-smoke font-barlow mb-12 max-w-md mx-auto uppercase tracking-tight">
                    The Kitchen has sent your callout to <span className="text-ember font-bold">@{opponent}</span>. As the Chef, they will now set the time and day for the clash.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link
                        href="/dashboard"
                        className="px-8 py-4 bg-ember hover:bg-flame text-white-app font-bebas text-2xl tracking-wider transition-all clip-angled"
                    >
                        GO TO DASHBOARD
                    </Link>
                    <Link
                        href={`/artists/${opponent}`}
                        className="px-8 py-4 bg-ash border border-smoke hover:border-ember text-smoke hover:text-white-app font-bebas text-2xl tracking-wider transition-all clip-angled"
                    >
                        BACK TO PROFILE
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 w-full font-barlow">
            <Link href={to ? `/artists/${to}` : "/artists"} className="inline-flex items-center gap-2 text-smoke hover:text-ember transition-colors mb-8 uppercase text-xs tracking-[0.2em]">
                <ArrowLeft className="w-4 h-4" /> BACK TO BATTLEFIELD
            </Link>

            <div className="text-center mb-12">
                <h1 className="text-7xl md:text-8xl font-bebas text-white-app tracking-wide mb-4 text-transparent bg-clip-text bg-gradient-to-r from-ember via-flame to-heat uppercase">
                    Issuing <span className="text-white-app italic">Smoke</span>
                </h1>
                <p className="text-xl text-smoke font-barlow-condensed tracking-widest uppercase italic font-bold">You are the Challenger. They are the Chef.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-ash border border-smoke p-10 clip-angled relative shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember to-flame"></div>

                {error && (
                    <div className="mb-8 p-4 bg-flame/10 border border-flame text-flame flex items-center gap-3 animate-shake">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-tight text-sm">{error}</span>
                    </div>
                )}

                <div className="space-y-8">
                    <div>
                        <label className="block text-smoke mb-2 uppercase text-xs tracking-[0.2em] font-bold">THE CHEF (OPPONENT)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ember font-bebas text-2xl">@</span>
                            <input
                                required
                                type="text"
                                value={opponent}
                                onChange={(e) => setOpponent(e.target.value)}
                                placeholder="username"
                                className="w-full bg-char border border-smoke text-white-app p-5 pl-10 focus:border-ember outline-none transition-all text-xl font-bebas tracking-wider"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-smoke mb-2 uppercase text-xs tracking-[0.2em] font-bold">BATTLE GENRE</label>
                            <select
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="w-full bg-char border border-smoke text-white-app p-5 focus:border-ember outline-none transition-all appearance-none cursor-pointer uppercase text-sm tracking-widest font-bold"
                            >
                                <option value="freestyle">Freestyle</option>
                                <option value="written">Written</option>
                                <option value="melodic">Melodic</option>
                                <option value="drill">Drill</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-smoke mb-2 uppercase text-xs tracking-[0.2em] font-bold">EVENT TITLE (OPTIONAL)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Grudge Match"
                                maxLength={40}
                                className="w-full bg-char border border-smoke text-white-app p-5 focus:border-ember outline-none transition-all text-sm font-bold tracking-widest"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-ember/5 border border-ember/20 flex gap-4 text-smoke">
                        <Info className="w-6 h-6 text-ember shrink-0 mt-1" />
                        <div className="text-sm leading-relaxed uppercase tracking-tight">
                            <p className="font-bold text-white-app mb-1 font-barlow">THE PROCESS:</p>
                            Once you issue this challenge, the <span className="text-white-app">Chef</span> must set the <span className="text-ember">Date and Time</span>. You&apos;ll then be notified to finalize the contract. No-shows result in automated clout forfeiture.
                        </div>
                    </div>

                    <div className="pt-8 border-t border-smoke/30 mt-10">
                        <button
                            type="submit"
                            disabled={loading || !opponent}
                            className="w-full py-6 bg-ember hover:bg-flame disabled:bg-ash disabled:text-smoke disabled:border-smoke text-white-app font-bebas text-4xl tracking-[0.1em] transition-all clip-angled shadow-[0_10px_30px_rgba(255,69,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,69,0,0.4)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4"
                        >
                            {loading ? (
                                <div className="w-8 h-8 border-4 border-white-app border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>ISSUE CHALLENGE <Swords className="w-8 h-8 font-bold" /></>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default function ChallengePage() {
    return (
        <Suspense fallback={
            <div className="flex-1 w-full flex items-center justify-center py-40 bg-char min-h-screen">
                <div className="w-16 h-16 border-4 border-ember border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ChallengeForm />
        </Suspense>
    );
}
