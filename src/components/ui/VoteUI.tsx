"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface VoteUIProps {
    battleId: string;
    artistA: { id: string; name: string };
    artistB: { id: string; name: string };
    endTime: Date;
}

export default function VoteUI({ battleId, artistA, artistB, endTime }: VoteUIProps) {
    const [votedFor, setVotedFor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Mock results that are hidden until voted
    const mockResults = {
        [artistA.id]: 68,
        [artistB.id]: 32
    };

    const handleVote = (artistId: string) => {
        if (votedFor) return; // Prevent double vote
        setLoading(true);
        setTimeout(() => {
            setVotedFor(artistId);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-char border-4 border-smoke p-8 my-12 clip-angled shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-ember via-flame to-heat"></div>

            <div className="text-center mb-8">
                <h2 className="text-5xl font-bebas text-white-app tracking-wide mb-2">WHO TOOK THE KITCHEN?</h2>
                <p className="text-smoke font-barlow-condensed tracking-widest uppercase text-lg">
                    {votedFor ? "The crowd has spoken." : "Cast your vote to see the count."}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Artist A Button */}
                <button
                    disabled={!!votedFor || loading}
                    onClick={() => handleVote(artistA.id)}
                    className={cn(
                        "flex-1 relative overflow-hidden clip-angled p-6 transition-all border-2",
                        votedFor === artistA.id ? "border-ember bg-ember/10" : "border-smoke hover:border-ember bg-ash",
                        votedFor && votedFor !== artistA.id ? "opacity-50 grayscale" : "opacity-100"
                    )}
                >
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <span className="text-4xl font-bebas text-white-app">{artistA.name}</span>
                        {votedFor && (
                            <span className="text-5xl font-bebas text-ember mt-4 animate-fade-in">
                                {mockResults[artistA.id]}%
                            </span>
                        )}
                    </div>
                    {/* Result Fill Background */}
                    {votedFor && (
                        <div
                            className="absolute bottom-0 left-0 h-2 bg-ember transition-all duration-1000 ease-out"
                            style={{ width: `${mockResults[artistA.id]}%` }}
                        />
                    )}
                </button>

                <div className="flex items-center justify-center">
                    <span className="text-4xl text-smoke font-bebas opacity-50">VS</span>
                </div>

                {/* Artist B Button */}
                <button
                    disabled={!!votedFor || loading}
                    onClick={() => handleVote(artistB.id)}
                    className={cn(
                        "flex-1 relative overflow-hidden clip-angled p-6 transition-all border-2",
                        votedFor === artistB.id ? "border-ember bg-ember/10" : "border-smoke hover:border-ember bg-ash",
                        votedFor && votedFor !== artistB.id ? "opacity-50 grayscale" : "opacity-100"
                    )}
                >
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <span className="text-4xl font-bebas text-white-app">{artistB.name}</span>
                        {votedFor && (
                            <span className="text-5xl font-bebas text-ember mt-4 animate-fade-in">
                                {mockResults[artistB.id]}%
                            </span>
                        )}
                    </div>
                    {/* Result Fill Background */}
                    {votedFor && (
                        <div
                            className="absolute bottom-0 right-0 h-2 bg-ember transition-all duration-1000 ease-out"
                            style={{ width: `${mockResults[artistB.id]}%` }}
                        />
                    )}
                </button>
            </div>

            {votedFor && (
                <div className="mt-8 text-center text-ember font-barlow-condensed tracking-widest uppercase animate-fade-in">
                    Your vote is locked.
                </div>
            )}
        </div>
    );
}
