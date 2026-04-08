import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Calendar, Mic2 } from "lucide-react";
import VoteUI from "@/components/ui/VoteUI";
import CrowdEnergyBar from "@/components/ui/CrowdEnergyBar";
import BattleChat from "@/components/battles/BattleChat";
import VoteButton from "@/components/battles/VoteButton";
import CloutMeter from "@/components/ui/CloutMeter";
import LiveStream from "@/components/battle/LiveStream";
import BattleArenaWrapper from "@/components/battle/BattleArenaWrapper";
import BattleModPanel from "@/components/battle/BattleModPanel";
import { getCloutTier } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { addToGoogleCalendar } from "@/lib/calendar";
import { UserProfile, ChatMessage } from "@/types";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS || "").split(",").map(s => s.trim()).filter(Boolean);

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

    // NO SHORTCUTS: Guarantee display name is a string and handle potentials nulls gracefully.
    const rawArtistA = battle.artist_a || {};
    const rawArtistB = battle.artist_b || {};
    const artistA = { ...rawArtistA, display_name: rawArtistA.display_name || rawArtistA.username || "TBD" } as UserProfile & { display_name: string };
    const artistB = { ...rawArtistB, display_name: rawArtistB.display_name || rawArtistB.username || "TBD" } as UserProfile & { display_name: string };
    const state = battle.status;

    if (state === "pending") {
        return (
            <div className="flex-1 w-full bg-char min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8">
                <div className="mb-8 p-12 bg-ash border border-smoke/30 shadow-2xl max-w-lg text-center animate-fade-in">
                    <h2 className="text-4xl font-barlow-condensed tracking-[0.4em] uppercase text-smoke mb-4 font-black">HOLDING PATTERN</h2>
                    <p className="text-white-app font-barlow text-lg mb-8 leading-relaxed">
                        The callout has been sent, but the Chef has not set a time. 
                        This bout is not officially sanctioned until they accept.
                    </p>
                    <Link href="/dashboard" className="px-8 py-4 bg-ember hover:bg-flame text-white-app font-bebas text-2xl tracking-widest uppercase transition-colors clip-angled inline-block">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }


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

    // 3. Fetch Initial Chat Messages
    const { data: initialMessages } = await supabase
        .from("chat_messages")
        .select(`
            *,
            user:user_id (username, display_name)
        `)
        .eq("battle_id", battle.id)
        .order("created_at", { ascending: true })
        .limit(50);

    const isAdmin = ADMIN_IDS.includes(clerkId || "");

    return (
        <BattleArenaWrapper battleId={battle.id}>
            <div className="flex-1 flex flex-col w-full bg-char overflow-hidden">
            {/* Admin Moderation Panel */}
            {isAdmin && (
                <BattleModPanel
                    battleId={battle.id}
                    battleStatus={state}
                    artistA={{ id: artistA.id, username: artistA.username, display_name: artistA.display_name }}
                    artistB={{ id: artistB.id, username: artistB.username, display_name: artistB.display_name }}
                    chatMessages={(initialMessages || []).map((m: ChatMessage) => ({ ...m, user_id: m.user_id, user: m.user ? { username: m.user.username || "Unknown" } : undefined }))}
                />
            )}
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

                </div>
            </div>

            {/* Energy Bar (Now Real-time) */}
            <CrowdEnergyBar battleId={battle.id} isCompleted={state === "completed"} />

            <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
                {/* Main Stage */}
                <div className="flex-1 flex flex-col items-center bg-black relative overflow-hidden">

                    {/* States Banners / Overlays */}
                    {state === "upcoming" && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-char/80 to-black">
                            <div className="mb-8 p-4 bg-char border border-ember/30 backdrop-blur shadow-[0_0_30px_rgba(255,69,0,0.2)]">
                                <h2 className="text-2xl font-barlow-condensed tracking-[0.4em] uppercase text-ember mb-4 font-black italic">THE CLASH IS IMMINENT</h2>
                                <div className="text-8xl md:text-9xl font-bebas text-white-app drop-shadow-2xl tabular-nums tracking-widest">
                                    {battle.scheduled_at ? format(new Date(battle.scheduled_at), "HH:mm:ss") : "TBA"}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => addToGoogleCalendar({
                                        id: battle.id,
                                        artist_a_name: artistA.display_name,
                                        artist_b_name: artistB.display_name,
                                        scheduled_at: battle.scheduled_at
                                    } as Parameters<typeof addToGoogleCalendar>[0])}
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

                    {(state === "live" || state === "voting" || state === "completed") && (
                        <div className="w-full z-40 bg-char border-t border-ember/30 py-12 px-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                            <VoteUI
                                battleId={battle.id}
                                artistA={{ id: artistA.id, name: artistA.display_name }}
                                artistB={{ id: artistB.id, name: artistB.display_name }}
                                results={results}
                                votedForId={hasVotedForId}
                                isCompleted={state === "completed"}
                                winnerId={battle.winner_id}
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
                    <div className="w-full min-h-[500px] flex-1 flex flex-col md:flex-row relative">
                        {/* LiveKit video layer — shown when battle is live */}
                        {state === "live" && (
                            <div className="absolute inset-0 z-0">
                                <LiveStream
                                    battleId={battle.id}
                                    artistAUsername={artistA.username}
                                    artistBUsername={artistB.username}
                                />
                            </div>
                        )}

                        {/* Artist A panel */}
                        <div className="flex-1 relative border-r border-[#111] overflow-hidden group">
                            {state !== "live" && (
                                <div className="absolute inset-0 bg-ash/20 flex items-center justify-center">
                                    <Mic2 className="w-64 h-64 text-smoke/5 opacity-10 absolute -rotate-12" />
                                    <div className="text-[20rem] font-bebas text-smoke/5 pointer-events-none select-none italic">{artistA.display_name[0]}</div>
                                </div>
                            )}
                            <div className="absolute bottom-6 left-6 p-4 bg-char/80 backdrop-blur border border-smoke shadow-2xl z-20">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-3xl font-bebas text-white-app tracking-wide">{artistA.display_name}</span>
                                    {state === "live" && <span className="px-2 py-0.5 bg-ember text-[8px] font-black italic rounded-sm animate-pulse">LIVE</span>}
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] text-smoke font-black uppercase tracking-widest">{artistA.wins}W - {artistA.losses}L</span>
                                    </div>
                                    <CloutMeter score={artistA.clout_score} tier={getCloutTier(artistA.clout_score)} compact />
                                </div>
                            </div>

                            {/* Integrated Vote Button A */}
                            {(state === "live" || state === "voting") && !hasVotedForId && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all">
                                    <VoteButton
                                        battleId={battle.id}
                                        artistId={artistA.id}
                                        artistName={artistA.display_name}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Artist B panel */}
                        <div className="flex-1 relative overflow-hidden group">
                            {state !== "live" && (
                                <div className="absolute inset-0 bg-ash/20 flex items-center justify-center">
                                    <Mic2 className="w-64 h-64 text-smoke/5 opacity-10 absolute rotate-12" />
                                    <div className="text-[20rem] font-bebas text-smoke/5 pointer-events-none select-none italic">{artistB.display_name?.[0]}</div>
                                </div>
                            )}
                            <div className="absolute bottom-6 right-6 text-right p-4 bg-char/80 backdrop-blur border border-smoke shadow-2xl z-20">
                                <div className="flex items-center justify-end gap-3 mb-1">
                                    {state === "live" && <span className="px-2 py-0.5 bg-ember text-[8px] font-black italic rounded-sm animate-pulse">LIVE</span>}
                                    <span className="text-3xl font-bebas text-white-app tracking-wide">{artistB.display_name}</span>
                                </div>
                                <div className="flex items-center justify-end gap-4 mt-2">
                                    <CloutMeter score={artistB.clout_score} tier={getCloutTier(artistB.clout_score)} compact />
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-smoke font-black uppercase tracking-widest">{artistB.wins}W - {artistB.losses}L</span>
                                    </div>
                                </div>
                            </div>

                            {/* Integrated Vote Button B */}
                            {(state === "live" || state === "voting") && !hasVotedForId && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all">
                                    <VoteButton
                                        battleId={battle.id}
                                        artistId={artistB.id}
                                        artistName={artistB.display_name}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Chat (Now Client Component) */}
                <BattleChat
                    initialMessages={initialMessages || []}
                    isLocked={state === "upcoming"}
                />
            </div>
            </div>
        </BattleArenaWrapper>
    );
}
