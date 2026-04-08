import Link from "next/link";
import BattleCard from "@/components/ui/BattleCard";
import { Search, Filter, AlertTriangle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import type { BattleData } from "@/types";

export default async function BattlesPage() {
    const supabase = createAdminClient();

    const { data: battles, error } = await supabase
        .from('battles')
        .select(`
            *,
            artist_a:artist_a_id (username, display_name, clout_score, wins, losses),
            artist_b:artist_b_id (username, display_name, clout_score, wins, losses)
        `)
        .in('status', ['live', 'accepted', 'completed'])
        .order('scheduled_at', { ascending: false });

    if (error) {
        console.error("Error fetching battles:", JSON.stringify(error, null, 2));
    }

    // Map Supabase data to the format expected by BattleCard
    const formattedBattles = battles?.map(b => ({
        id: b.id,
        artist_a: {
            username: b.artist_a.username,
            display_name: b.artist_a.display_name || b.artist_a.username,
            record: `${b.artist_a.wins}W ${b.artist_a.losses}L`,
            clout_score: b.artist_a.clout_score
        },
        artist_b: {
            username: b.artist_b.username,
            display_name: b.artist_b.display_name || b.artist_b.username,
            record: `${b.artist_b.wins}W ${b.artist_b.losses}L`,
            clout_score: b.artist_b.clout_score
        },
        scheduled_at: new Date(b.scheduled_at),
        genre: b.genre,
        status: b.status as "pending" | "accepted" | "live" | "voting" | "completed" | "cancelled",
        title: b.title
    })) as Partial<BattleData>[] || [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-6xl md:text-8xl font-bebas text-white-app tracking-wide leading-none">THE SCHEDULE</h1>
                    <p className="text-xl text-ember font-barlow-condensed tracking-widest uppercase mt-2">
                        Every clash. Past, present, and future.
                    </p>
                </div>

                <Link
                    href="/challenge"
                    className="px-8 py-4 bg-char border border-ember text-ember font-bebas text-2xl tracking-wider hover:bg-ember hover:text-white-app transition-colors clip-angled text-center"
                >
                    HOST A BATTLE
                </Link>
            </div>

            {error ? (
                <div className="bg-ember/5 border border-ember/20 p-12 rounded-2xl text-center mb-12">
                    <AlertTriangle className="w-12 h-12 text-ember mx-auto mb-4" />
                    <h2 className="text-2xl font-bebas text-ember mb-2 uppercase">CONNECTION ERROR</h2>
                    <p className="text-smoke max-w-md mx-auto mb-6">
                        Failed to load the battle schedule. Ensure the database is reachable.
                    </p>
                    <code className="bg-char/50 px-4 py-2 rounded text-xs text-smoke block max-w-sm mx-auto">
                        {JSON.stringify(error).slice(0, 80)}...
                    </code>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-4 mb-8 bg-ash border border-smoke p-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-smoke" />
                        <input
                            type="text"
                            placeholder="Search artists..."
                            className="w-full bg-char border border-smoke pl-10 pr-4 py-3 text-white-app outline-none focus:border-ember font-barlow"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="relative flex-1 md:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-smoke" />
                            <select className="w-full bg-char border border-smoke pl-9 pr-4 py-3 text-white-app outline-none focus:border-ember appearance-none font-barlow-condensed tracking-wider uppercase">
                                <option>All Statuses</option>
                                <option>Live Now</option>
                                <option>Upcoming</option>
                                <option>Completed</option>
                            </select>
                        </div>

                        <select className="flex-1 md:w-48 bg-char border border-smoke px-4 py-3 text-white-app outline-none focus:border-ember appearance-none font-barlow-condensed tracking-wider uppercase">
                            <option>All Genres</option>
                            <option>Freestyle</option>
                            <option>Written</option>
                            <option>Melodic</option>
                            <option>Drill</option>
                        </select>
                    </div>
                </div>
            )}

            {!error && formattedBattles.length === 0 && (
                <div className="text-smoke text-center py-24 bg-ash/30 rounded-2xl border border-dashed border-white/10">
                    <p className="text-xl uppercase tracking-widest font-bebas">No battles scheduled yet.</p>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {formattedBattles.map(b => (
                    <BattleCard key={b.id} battle={b} />
                ))}
            </div>
        </div>
    );
}
