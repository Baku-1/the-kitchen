import { auth } from "@clerk/nextjs/server";
import { Users, Info, Flag, Calendar, Mic2 } from "lucide-react";
import VoteUI from "@/components/ui/VoteUI";
import CrowdEnergyBar from "@/components/ui/CrowdEnergyBar";
import { getCloutTier } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { addToGoogleCalendar } from "@/lib/calendar";

export default async function BattlePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = createAdminClient();
    const { userId: clerkId } = await auth();

    // 1. Fetch real battle data
    // Supporting short IDs by checking if it's a UUID or a fragment
    let query = supabase
        .from("battles")
        .select(`
            *,
            artist_a:artist_a_id (id, username, display_name, clout_score, wins, losses),
            artist_b:artist_b_id (id, username, display_name, clout_score, wins, losses)
        `);

    if (id.length < 30) {
        // Assume short ID ba1, ba2 etc. - for this demo we'll use a like or a specific column if we had one
        // But for now let's just use the full ID if it matches
        query = query.filter('id::text', 'ilike', `${id}%`);
    } else {
        query = query.eq('id', id);
    }

    const { data: battle, error } = await query.single();

    if (error || !battle) {
        return <div className="p-24 text-center text-ember font-bebas text-4xl">Battle Not Found</div>;
    }

    const artistA = battle.artist_a as any;
    const artistB = battle.artist_b as any;
    const state = battle.status;

    // 2. Fetch voter status if logged in
    let hasVotedForId = null;
    if (clerkId) {
        const { data: profile } = await supabase.from("users").select("id").eq("clerk_id", clerkId).single();
        if (profile) {
            const { data: existingVote } = await supabase
                .from("votes")
                .select("voted_for_id")
                .eq("battle_id", battle.id)
                .eq("voter_id", profile.id)
                .single();
            if (existingVote) hasVotedForId = existingVote.voted_for_id;
        }
    }

    // Calculate percentages
    const totalVotes = (battle.vote_count_a || 0) + (battle.vote_count_b || 0);
    const results = {
        a: totalVotes > 0 ? Math.round((battle.vote_count_a / totalVotes) * 100) : 0,
        b: totalVotes > 0 ? Math.round((battle.vote_count_b / totalVotes) * 100) : 0,
        total: totalVotes
    };

    return (
        <div className="flex-1 flex flex-col w-full bg-char overflow-hidden">
            {/* Header */}
            <div className="w-full bg-ash border-b border-smoke p-4 flex justify-between items-center z-50 relative">
                <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-char border border-smoke text-[10px] font-barlow-condensed tracking-widest text-smoke uppercase">{battle.genre}</span>
                    <h1 className="text-2xl font-bebas text-white-app tracking-wide uppercase">{artistA.display_name} VS {artistB.display_name}</h1>
                </div>
                <div className="flex items-center gap-6">
                    {state === "live" && (
                        <div className="flex items-center gap-2 text-ember font-barlow-condensed tracking-widest font-black text-sm">
                            <span className="w-2 h-2 bg-ember rounded-full animate-ping"></span>
                            LIVE STREAM
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-smoke font-barlow text-xs font-bold">
                        <Users className="w-4 h-4 text-heat" /> 1,240 VIEWERS
                    </div>
                </div>
            </div>

            {state === "live" && <CrowdEnergyBar battleId={battle.id} />}

            <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
                {/* Main Stage */}
                <div className="flex-1 flex flex-col items-center bg-black relative overflow-hidden">

                    {/* States Banners / Overlays */}
                    {state === "upcoming" && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-char/80 to-black">
                            <div className="mb-8 p-4 bg-char border border-ember/30 backdrop-blur shadow-[0_0_30px_rgba(255,69,0,0.2)]">
                                <h2 className="text-2xl font-barlow-condensed tracking-[0.4em] uppercase text-ember mb-4 font-black italic">THE CLASH IS IMMINENT</h2>
                                <div className="text-8xl md:text-9xl font-bebas text-white-app drop-shadow-2xl tabular-nums tracking-widest">
                                    {format(new Date(battle.scheduled_at), "HH:mm:ss")}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => addToGoogleCalendar({
                                        id: battle.id,
                                        artist_a_name: artistA.display_name,
                                        artist_b_name: artistB.display_name,
                                        scheduled_at: battle.scheduled_at
                                    } as any)}
                                    className="px-8 py-3 bg-char border border-smoke hover:border-ember text-white-app font-bebas text-xl tracking-widest transition-all uppercase flex items-center gap-2"
                                >
                                    <Calendar className="w-5 h-5" /> Add to Calendar
                                </button>
                                <button className="px-8 py-3 bg-ash border border-smoke hover:border-ember text-white-app font-bebas text-xl tracking-widest transition-all uppercase">
                                    Download .ICS
                                </button>
                            </div>
                        </div>
                    )}

                    {(state === "voting" || state === "completed") && (
                        <div className="absolute bottom-0 left-0 w-full z-40 bg-char/95 backdrop-blur-xl border-t border-ember/30 pb-12">
                            <VoteUI
                                battleId={battle.id}
                                artistA={artistA}
                                artistB={artistB}
                                results={results}
                                votedForId={hasVotedForId}
                                isCompleted={state === "completed"}
                            />
                        </div>
                    )}

                    {(state === "ghost_a" || state === "ghost_b") && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-char/90 backdrop-blur-sm p-4 text-center">
                            <div className="bg-flame/10 border-2 border-flame p-12 max-w-xl shadow-[0_0_50px_rgba(255,0,0,0.2)]">
                                <h2 className="text-6xl font-bebas text-flame mb-4 tracking-wide uppercase">⚠️ NO-SHOW DETECTED</h2>
                                <p className="text-2xl font-bebas text-white-app mb-8">
                                    {state === "ghost_a" ? artistA.display_name : artistB.display_name} DID NOT SHOW
                                </p>
                                <div className="text-xl font-bebas text-ember border-t border-flame/30 pt-4 uppercase">
                                    {state === "ghost_a" ? artistB.display_name : artistA.display_name} WINS BY DEFAULT
                                </div>
                                <p className="mt-4 text-[10px] text-smoke uppercase font-black tracking-widest">
                                    A permanent no-show penalty has been recorded.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Split View Streams */}
                    <div className="w-full h-full flex flex-col md:flex-row">
                        <div className="flex-1 relative border-r border-[#111] overflow-hidden group">
                            <div className="absolute inset-0 bg-ash/20 flex items-center justify-center">
                                <Mic2 className="w-64 h-64 text-smoke/5 opacity-10 absolute -rotate-12" />
                                <div className="text-[20rem] font-bebas text-smoke/5 pointer-events-none select-none italic">{artistA.display_name[0]}</div>
                            </div>
                            <div className="absolute bottom-6 left-6 p-4 bg-char/80 backdrop-blur border border-smoke shadow-2xl z-20">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-3xl font-bebas text-white-app tracking-wide">{artistA.display_name}</span>
                                    {state === "live" && <span className="px-2 py-0.5 bg-ember text-[8px] font-black italic rounded-sm animate-pulse">LIVE</span>}
                                </div>
                                <div className="font-barlow-condensed text-smoke text-[10px] uppercase font-black tracking-[0.2em]">
                                    {artistA.wins}W - {artistA.losses}L &bull; {artistA.clout_score} CLOUT
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-ash/20 flex items-center justify-center">
                                <Mic2 className="w-64 h-64 text-smoke/5 opacity-10 absolute rotate-12" />
                                <div className="text-[20rem] font-bebas text-smoke/5 pointer-events-none select-none italic">{artistB.display_name[0]}</div>
                            </div>
                            <div className="absolute bottom-6 right-6 text-right p-4 bg-char/80 backdrop-blur border border-smoke shadow-2xl z-20">
                                <div className="flex items-center justify-end gap-3 mb-1">
                                    {state === "live" && <span className="px-2 py-0.5 bg-ember text-[8px] font-black italic rounded-sm animate-pulse">LIVE</span>}
                                    <span className="text-3xl font-bebas text-white-app tracking-wide">{artistB.display_name}</span>
                                </div>
                                <div className="font-barlow-condensed text-smoke text-[10px] uppercase font-black tracking-[0.2em]">
                                    {artistB.wins}W - {artistB.losses}L &bull; {artistB.clout_score} CLOUT
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Chat */}
                <div className="w-full lg:w-96 border-l border-smoke bg-ash flex flex-col h-[50vh] lg:h-auto z-50">
                    <div className="p-4 border-b border-smoke bg-char flex items-center justify-between">
                        <span className="font-bebas text-2xl text-white-app tracking-widest uppercase italic">The Trenches</span>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-ember animate-ping"></div>
                            <span className="text-[10px] text-smoke font-black uppercase tracking-widest">Live Flow</span>
                        </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 font-barlow text-sm scrollbar-thin scrollbar-thumb-smoke/20">
                        {state === "upcoming" ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                <Info className="w-12 h-12 mb-4" />
                                <p className="font-bebas text-2xl tracking-widest">Chat Locked</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest">Opens when the heat rises</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-char/40 p-3 border-l-2 border-ember">
                                    <span className="font-black text-ember text-[10px] block mb-1 uppercase tracking-tighter">System Alert</span>
                                    <p className="text-smoke italic text-xs">Battle is live. No gang references. No personal threats. Spitting bars only.</p>
                                </div>
                                {/* Mock Messages */}
                                <div className="flex flex-col gap-1">
                                    <span className="font-black text-heat text-[10px] uppercase">nyc_beast</span>
                                    <p className="text-smoke">mad mic came for the crown tonight 😤</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-black text-ember text-[10px] uppercase">detroit_chef</span>
                                    <p className="text-smoke">flowking 3-0 zero debate</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-6 border-t border-smoke bg-char">
                        <div className="flex text-smoke font-barlow bg-ash/50 border border-smoke p-1 relative overflow-hidden group focus-within:border-ember transition-all">
                            <input
                                type="text"
                                disabled={state === "upcoming"}
                                placeholder={state === "upcoming" ? "LOCKED" : "SEND HEAT..."}
                                className="w-full bg-transparent p-4 outline-none font-bold placeholder:text-smoke/30 italic uppercase text-xs"
                                maxLength={100}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
