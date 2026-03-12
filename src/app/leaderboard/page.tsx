import Link from "next/link";
import CloutMeter from "@/components/ui/CloutMeter";
import { getCloutTier, CloutTier } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/server";
import { AlertTriangle } from "lucide-react";

export default async function LeaderboardPage() {
    const supabase = createAdminClient();

    // Fetch top users by clout score
    const { data: leaderboard, error } = await supabase
        .from('users')
        .select('*')
        .order('clout_score', { ascending: false });

    if (error) {
        console.error("Error fetching leaderboard:", JSON.stringify(error, null, 2));
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-16 w-full">
            <div className="text-center mb-12">
                <h1 className="text-6xl md:text-8xl font-bebas text-white-app tracking-wide mb-4">THE CLOUT LEADERS</h1>
                <p className="text-xl text-smoke font-barlow">Who really runs the kitchen?</p>
            </div>

            {error ? (
                <div className="bg-ember/5 border border-ember/20 p-12 rounded-2xl text-center mb-12">
                    <AlertTriangle className="w-12 h-12 text-ember mx-auto mb-4" />
                    <h2 className="text-2xl font-bebas text-ember mb-2 uppercase">CONNECTION ERROR</h2>
                    <p className="text-smoke max-w-md mx-auto mb-6">
                        Failed to load the leaderboards. Ensure the kitchen database is online.
                    </p>
                    <code className="bg-char/50 px-4 py-2 rounded text-xs text-smoke block max-w-sm mx-auto">
                        {JSON.stringify(error).slice(0, 80)}...
                    </code>
                </div>
            ) : (
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                    <div className="flex gap-4 font-barlow-condensed tracking-widest text-sm uppercase">
                        <button className="text-ember border-b-2 border-ember pb-1">All-Time</button>
                        <button className="text-smoke hover:text-white-app transition-colors pb-1">Monthly</button>
                        <button className="text-smoke hover:text-white-app transition-colors pb-1">Weekly</button>
                    </div>
                </div>
            )}

            {!error && (!leaderboard || leaderboard.length === 0) ? (
                <div className="text-smoke text-center py-24 bg-ash/30 rounded-2xl border border-dashed border-white/10">
                    <p className="text-xl uppercase tracking-widest font-bebas">The leaderboard is currently empty.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {leaderboard?.map((artist, index) => {
                        const tier = getCloutTier(artist.clout_score || 0);
                        return (
                            <div key={artist.id} className="bg-ash/50 border border-white/5 p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 hover:border-ember/30 transition-all group">

                                {/* Rank */}
                                <div className="w-12 text-center text-4xl font-bebas text-smoke group-hover:text-ember transition-colors">
                                    #{index + 1}
                                </div>

                                {/* Avatar & Info */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-16 h-16 bg-char border border-white/10 flex items-center justify-center font-bebas text-2xl text-smoke overflow-hidden">
                                        {artist.avatar_url ? (
                                            <img src={artist.avatar_url} alt={artist.username} className="w-full h-full object-cover" />
                                        ) : (
                                            artist.display_name?.charAt(0) || artist.username.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <Link href={`/artists/${artist.username}`} className="text-3xl font-bebas text-white-app tracking-wide hover:text-ember transition-colors">
                                            {artist.display_name || artist.username}
                                        </Link>
                                        <div className="flex items-center gap-2 text-xs font-barlow text-smoke mt-1 font-medium uppercase tracking-tighter">
                                            <span>{artist.city}</span> &bull; <span>{artist.wins}W - {artist.losses}L</span>
                                        </div>
                                        <div className="mt-4 w-48">
                                            <CloutMeter score={artist.clout_score || 0} tier={tier} compact={true} />
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="ml-auto w-full md:w-auto">
                                    <Link
                                        href={`/challenge?to=${artist.username}`}
                                        className="block w-full text-center px-8 py-3 bg-char border border-ember/50 text-ember hover:bg-ember hover:text-white-app font-bebas text-xl tracking-wider transition-colors clip-angled"
                                    >
                                        CHALLENGE
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
