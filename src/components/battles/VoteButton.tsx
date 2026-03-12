"use client";

import { useState } from "react";
import { castVote } from "@/app/actions/battles";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
    battleId: string;
    artistId: string;
    artistName: string;
}

export default function VoteButton({ battleId, artistId, artistName }: VoteButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleVote = async () => {
        setLoading(true);
        try {
            await castVote(battleId, artistId);
            router.refresh();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleVote}
            disabled={loading}
            className={cn(
                "px-8 py-4 bg-ember hover:bg-flame text-white-app font-bebas text-3xl tracking-widest clip-angled shadow-[0_0_30px_rgba(255,69,0,0.5)] transition-all hover:scale-110 active:scale-95 flex items-center gap-3",
                loading && "opacity-50 cursor-not-allowed scale-95"
            )}
        >
            {loading ? (
                <div className="w-6 h-6 border-2 border-white-app border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <Flame className="w-6 h-6 animate-pulse" />
            )}
            VOTE FOR {(artistName || "ARTIST").split(' ')[0]}
        </button>
    );
}
