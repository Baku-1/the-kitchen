"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { castVote } from "@/app/actions/battles";
import { useRouter } from "next/navigation";

interface VoteUIProps {
    battleId: string;
    artistA: { id: string; name: string };
    artistB: { id: string; name: string };
    results?: { a: number, b: number, total: number };
    votedForId?: string | null;
    isCompleted?: boolean;
}

export default function VoteUI({ battleId, artistA, artistB, results, votedForId: initialVotedFor, isCompleted }: VoteUIProps) {
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
        } catch (err: any) {
            setError(err.message || "Failed to vote");
            setLoading(false);
        }
    };

    const hasVoted = !!votedFor;
    const showResults = hasVoted || isCompleted;

    return (
        <div className="w-full max-w-4xl mx-auto bg-char border-[1px] border-[#222] p-8 my-12 clip-angled shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember via-flame to-heat"></div>

            <div className="text-center mb-10">
                <h2 className="text-6xl font-bebas text-white-app tracking-wide mb-2 uppercase">
                    {isCompleted ? "VOTING CLOSED — WINNER DECLARED" : "WHO TOOK THE KITCHEN?"}
                </h2>
                {!isCompleted && !hasVoted && (
                    <p className="text-ember font-barlow uppercase tracking-[0.2em] text-sm font-bold animate-pulse">
                        LIVE VOTING IS OPEN
                    </p>
                )}
            </div>

            {error && (
                <div className="bg-flame/10 border border-flame text-flame p-4 mb-6 text-center font-bold font-barlow uppercase text-xs">
                    {error}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 items-stretch">
                {/* Artist A Button */}
                <div className="flex-1 flex flex-col gap-4">
                    <button
                        disabled={hasVoted || loading || isCompleted}
                        onClick={() => handleVote(artistA.id)}
                        className={cn(
                            "relative overflow-hidden p-8 transition-all border-2 flex flex-col items-center justify-center gap-2 group/btn",
                            votedFor === artistA.id ? "border-ember bg-ember/10" : "border-[#222] bg-ash hover:border-ember hover:-translate-y-1",
                            showResults && votedFor !== artistA.id ? "opacity-50" : "opacity-100",
                            (hasVoted || isCompleted) && "cursor-default translate-y-0!"
                        )}
                    >
                        {votedFor === artistA.id && (
                            <div className="absolute top-2 right-4 text-ember text-2xl animate-bounce">🔥</div>
                        )}
                        <span className="text-5xl font-bebas text-white-app tracking-wider transition-colors group-hover/btn:text-ember">{artistA.name}</span>
                        {!showResults && (
                            <span className="text-[10px] font-black uppercase text-smoke group-hover/btn:text-white-app transition-colors">CAST VOTE</span>
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
                    <span className="text-4xl text-smoke font-bebas opacity-20">VS</span>
                </div>

                {/* Artist B Button */}
                <div className="flex-1 flex flex-col gap-4">
                    <button
                        disabled={hasVoted || loading || isCompleted}
                        onClick={() => handleVote(artistB.id)}
                        className={cn(
                            "relative overflow-hidden p-8 transition-all border-2 flex flex-col items-center justify-center gap-2 group/btn",
                            votedFor === artistB.id ? "border-ember bg-ember/10" : "border-[#222] bg-ash hover:border-ember hover:-translate-y-1",
                            showResults && votedFor !== artistB.id ? "opacity-50" : "opacity-100",
                            (hasVoted || isCompleted) && "cursor-default translate-y-0!"
                        )}
                    >
                        {votedFor === artistB.id && (
                            <div className="absolute top-2 left-4 text-ember text-2xl animate-bounce">🔥</div>
                        )}
                        <span className="text-5xl font-bebas text-white-app tracking-wider transition-colors group-hover/btn:text-ember">{artistB.name}</span>
                        {!showResults && (
                            <span className="text-[10px] font-black uppercase text-smoke group-hover/btn:text-white-app transition-colors">CAST VOTE</span>
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
                <div className="mt-12 text-center">
                    <p className="text-smoke font-barlow uppercase tracking-tighter text-xs font-black">
                        Total {results.total.toLocaleString()} votes cast
                    </p>
                    {!hasVoted && !isCompleted && (
                        <p className="text-ember font-barlow italic text-sm mt-2">Cast your vote to join the crowd 🔥</p>
                    )}
                </div>
            )}
        </div>
    );
}
