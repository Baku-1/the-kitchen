"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { castVote, finishVoting } from "@/app/actions/battles";
import { useRouter } from "next/navigation";
import { Trophy, Info } from "lucide-react";

interface VoteUIProps {
    battleId: string;
    artistA: { id: string; name: string };
    artistB: { id: string; name: string };
    results?: { a: number, b: number, total: number };
    votedForId?: string | null;
    isCompleted?: boolean;
    winnerId?: string | null;
}

export default function VoteUI({ battleId, artistA, artistB, results, votedForId: initialVotedFor, isCompleted, winnerId }: VoteUIProps) {
    const [votedFor, setVotedFor] = useState<string | null>(initialVotedFor || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleVote = async (artistId: string) => {
        if (votedFor || isCompleted) return;
        setLoading(true);
        setError("");
        try {
            await castVote(battleId, artistId);
            setVotedFor(artistId);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to vote");
            setLoading(false);
        }
    };

    const hasVoted = !!votedFor;
    const showResults = hasVoted || isCompleted;
    const winner = winnerId === artistA.id ? artistA : (winnerId === artistB.id ? artistB : null);

    return (
        <div className="w-full max-w-4xl mx-auto bg-char border-[1px] border-[#222] p-8 my-12 clip-angled shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember via-flame to-heat"></div>

            {isCompleted && winner && (
                <div className="absolute inset-0 bg-ember/5 flex items-center justify-center pointer-events-none">
                    <Trophy className="w-96 h-96 text-ember/5 absolute -rotate-12" />
                </div>
            )}

            <div className="text-center mb-10 relative z-10">
                {isCompleted ? (
                    <div className="animate-bounce-in">
                        <h2 className="text-7xl font-bebas text-white-app tracking-wide mb-2 uppercase italic flex items-center justify-center gap-4">
                            <Trophy className="w-12 h-12 text-ember" />
                            {winner ? `${winner.name} TOOK THE STOVE!` : "THE KITCHEN IS TIED!"}
                            <Trophy className="w-12 h-12 text-ember" />
                        </h2>
                        <p className="text-smoke font-barlow uppercase tracking-[0.4em] text-sm font-black">
                            BATTLE OFFICIALLY CLOSED
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-6xl font-bebas text-white-app tracking-wide mb-2 uppercase">
                            WHO TOOK THE KITCHEN?
                        </h2>
                        {!hasVoted && (
                            <p className="text-ember font-barlow uppercase tracking-[0.2em] text-sm font-bold animate-pulse">
                                LIVE VOTING IS OPEN
                            </p>
                        )}
                    </>
                )}
            </div>

            {error && (
                <div className="bg-flame/10 border border-flame text-flame p-4 mb-6 text-center font-bold font-barlow uppercase text-xs relative z-10">
                    {error}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 items-stretch relative z-10">
                {/* Artist A Button/Result */}
                <div className="flex-1 flex flex-col gap-4">
                    <button
                        disabled={hasVoted || loading || isCompleted}
                        onClick={() => handleVote(artistA.id)}
                        className={cn(
                            "relative overflow-hidden p-8 transition-all border-2 flex flex-col items-center justify-center gap-2 group/btn h-full",
                            votedFor === artistA.id || (isCompleted && winnerId === artistA.id) ? "border-ember bg-ember/10" : "border-[#222] bg-ash hover:border-ember hover:-translate-y-1",
                            showResults && votedFor !== artistA.id && winnerId !== artistA.id ? "opacity-50" : "opacity-100",
                            (hasVoted || isCompleted) && "cursor-default translate-y-0!"
                        )}
                    >
                        {(votedFor === artistA.id || (isCompleted && winnerId === artistA.id)) && (
                            <div className="absolute top-2 right-4 text-ember text-2xl animate-bounce">🔥</div>
                        )}
                        <span className="text-5xl font-bebas text-white-app tracking-wider transition-colors group-hover/btn:text-ember">{artistA.name}</span>
                        {!showResults && (
                            <span className="text-[10px] font-black uppercase text-smoke group-hover/btn:text-white-app transition-colors">CAST VOTE</span>
                        )}
                        {isCompleted && winnerId === artistA.id && (
                            <span className="text-[10px] font-black uppercase text-ember tracking-[0.3em] font-bebas bg-ember/10 px-3 py-1 mt-2">CHAMPION</span>
                        )}
                    </button>

                    {showResults && results && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-end mb-2 font-bebas">
                                <span className="text-white-app text-2xl">{artistA.name}</span>
                                <span className="text-ember text-3xl">{results.a}%</span>
                            </div>
                            <div className="h-4 bg-[#111] border border-[#222] relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF2200] to-ember transition-all duration-1500 cubic-bezier(0.22, 1, 0.36, 1)"
                                    style={{ width: `${results.a}%` }}
                                >
                                    <div className="absolute right-0 top-0 w-[2px] h-full bg-white opacity-60 shadow-[0_0_8px_white]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center">
                    <span className="text-4xl text-smoke font-bebas opacity-20 italic">VS</span>
                </div>

                {/* Artist B Button/Result */}
                <div className="flex-1 flex flex-col gap-4">
                    <button
                        disabled={hasVoted || loading || isCompleted}
                        onClick={() => handleVote(artistB.id)}
                        className={cn(
                            "relative overflow-hidden p-8 transition-all border-2 flex flex-col items-center justify-center gap-2 group/btn h-full",
                            votedFor === artistB.id || (isCompleted && winnerId === artistB.id) ? "border-ember bg-ember/10" : "border-[#222] bg-ash hover:border-ember hover:-translate-y-1",
                            showResults && votedFor !== artistB.id && winnerId !== artistB.id ? "opacity-50" : "opacity-100",
                            (hasVoted || isCompleted) && "cursor-default translate-y-0!"
                        )}
                    >
                        {(votedFor === artistB.id || (isCompleted && winnerId === artistB.id)) && (
                            <div className="absolute top-2 left-4 text-ember text-2xl animate-bounce">🔥</div>
                        )}
                        <span className="text-5xl font-bebas text-white-app tracking-wider transition-colors group-hover/btn:text-ember">{artistB.name}</span>
                        {!showResults && (
                            <span className="text-[10px] font-black uppercase text-smoke group-hover/btn:text-white-app transition-colors">CAST VOTE</span>
                        )}
                        {isCompleted && winnerId === artistB.id && (
                            <span className="text-[10px] font-black uppercase text-ember tracking-[0.3em] font-bebas bg-ember/10 px-3 py-1 mt-2">CHAMPION</span>
                        )}
                    </button>

                    {showResults && results && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-end mb-2 font-bebas">
                                <span className="text-white-app text-2xl">{artistB.name}</span>
                                <span className="text-ember text-3xl">{results.b}%</span>
                            </div>
                            <div className="h-4 bg-[#111] border border-[#222] relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF2200] to-ember transition-all duration-1500 cubic-bezier(0.22, 1, 0.36, 1)"
                                    style={{ width: `${results.b}%` }}
                                >
                                    <div className="absolute right-0 top-0 w-[2px] h-full bg-white opacity-60 shadow-[0_0_8px_white]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showResults && results && (
                <div className="mt-12 text-center relative z-10">
                    <p className="text-smoke font-barlow uppercase tracking-tighter text-xs font-black">
                        Total {results.total.toLocaleString()} votes cast
                    </p>
                    {!hasVoted && !isCompleted && (
                        <p className="text-ember font-barlow italic text-sm mt-2">Cast your vote to join the crowd 🔥</p>
                    )}
                </div>
            )}

            {!isCompleted && hasVoted && (
                <div className="mt-12 p-4 bg-char/50 border border-smoke/30 flex items-center justify-between group-hover:border-ember/30 transition-all">
                    <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-smoke" />
                        <span className="text-[10px] text-smoke uppercase font-black">Waiting for countdown to finalize results...</span>
                    </div>
                    {/* For testing purposes, we could add a button here for the artist/admin to end it */}
                    <button
                        onClick={async () => {
                            setLoading(true);
                            await finishVoting(battleId);
                            router.refresh();
                        }}
                        className="text-[10px] text-ember hover:underline font-black uppercase tracking-widest px-3 py-1 border border-ember/20"
                    >
                        DEBUG: FINALIZE NOW
                    </button>
                </div>
            )}
        </div>
    );
}
