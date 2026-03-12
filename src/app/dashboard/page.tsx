import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Swords, Calendar, Trophy, Zap, AlertCircle, Clock } from "lucide-react";
import CloutMeter from "@/components/ui/CloutMeter";
import AdminTrigger from "@/components/dashboard/AdminTrigger";
import { getCloutTier } from "@/lib/utils";

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const supabase = createAdminClient();

    // 1. Fetch User Profile
    const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", userId)
        .single();

    if (profileError || !profile) {
        redirect("/onboarding");
    }

    // 2. Fetch Pending Challenges where this user is the "Chef" (artist_a)
    const { data: challenges, error: challengesError } = await supabase
        .from("battles")
        .select(`
            *,
            challenger:artist_b_id (username, display_name, clout_score)
        `)
        .eq("artist_a_id", profile.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    // 3. Fetch Upcoming Accepted Battles (Both as A or B)
    const { data: upcoming, error: upcomingError } = await supabase
        .from("battles")
        .select(`
            *,
            artist_a:artist_a_id (username, display_name),
            artist_b:artist_b_id (username, display_name)
        `)
        .or(`artist_a_id.eq.${profile.id},artist_b_id.eq.${profile.id}`)
        .eq("status", "accepted")
        .order("scheduled_at", { ascending: true });

    const tier = getCloutTier(profile.clout_score);

    return (
        <div className="flex-1 w-full bg-char min-h-screen pb-24">

            {/* Header / Stats Banner */}
            <div className="bg-ash border-b border-smoke py-12 px-4 shadow-xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-char border-2 border-smoke flex items-center justify-center text-4xl font-bebas text-smoke clip-angled relative">
                            {profile.username[0].toUpperCase()}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-ember" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bebas text-white-app tracking-wide leading-none">{profile.display_name || profile.username}</h1>
                            <p className="text-ember font-barlow-condensed tracking-widest uppercase mt-2">{tier} TIER ARTIST</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 divide-x divide-smoke/30 font-bebas">
                        <div className="pl-8 first:pl-0 flex flex-col items-center">
                            <span className="text-smoke text-xs tracking-widest">WINS</span>
                            <span className="text-4xl text-white-app">{profile.wins}</span>
                        </div>
                        <div className="pl-8 flex flex-col items-center">
                            <span className="text-smoke text-xs tracking-widest">LOSSES</span>
                            <span className="text-4xl text-smoke">{profile.losses}</span>
                        </div>
                        <div className="pl-8 flex flex-col items-center">
                            <span className="text-smoke text-xs tracking-widest">CLOUT</span>
                            <span className="text-4xl text-heat">{profile.clout_score}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Challenges & Battles */}
                <div className="lg:col-span-2 flex flex-col gap-12">

                    {/* Pending Challenges (CHEF WORK) */}
                    <section>
                        <h2 className="text-3xl font-bebas text-white-app tracking-wide mb-6 flex items-center gap-3">
                            <Swords className="w-7 h-7 text-ember" /> INCOMING SMOKE
                            {challenges && challenges.length > 0 && (
                                <span className="px-2 py-0.5 bg-ember text-white-app text-sm animate-pulse">{challenges.length} NEW</span>
                            )}
                        </h2>

                        {challenges && challenges.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {challenges.map((c: any) => (
                                    <div key={c.id} className="bg-ash border border-smoke p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-ember/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-char flex items-center justify-center text-xl font-bebas text-ember">
                                                {c.challenger?.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-white-app font-bebas text-2xl tracking-wide group-hover:text-ember transition-colors">
                                                    @{c.challenger?.username} <span className="text-smoke italic font-normal text-sm ml-2">WANTS BATTLE</span>
                                                </div>
                                                <div className="text-smoke text-xs uppercase tracking-widest font-barlow">
                                                    GENRE: {c.genre} | {c.title || "Standard Matchup"}
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/dashboard/set-time/${c.id}`}
                                            className="w-full md:w-auto px-6 py-3 bg-ember hover:bg-flame text-white-app font-bebas text-xl tracking-widest transition-colors clip-angled flex items-center justify-center gap-2"
                                        >
                                            <Clock className="w-5 h-5" /> SET TIME & ACCEPT
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border border-smoke border-dashed p-12 text-center text-smoke font-barlow italic">
                                No new challenges. The kitchen is quiet... for now.
                            </div>
                        )}
                    </section>

                    {/* Upcoming Battles */}
                    <section>
                        <h2 className="text-3xl font-bebas text-white-app tracking-wide mb-6 flex items-center gap-3">
                            <Calendar className="w-7 h-7 text-smoke" /> THE SCHEDULE
                        </h2>
                        {upcoming && upcoming.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {upcoming.map((u: any) => {
                                    const opponent = u.artist_a_id === profile.id ? u.artist_b : u.artist_a;
                                    const date = u.scheduled_at ? new Date(u.scheduled_at) : null;
                                    return (
                                        <div key={u.id} className="bg-char border border-smoke p-5 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bebas tracking-widest text-ember uppercase bg-ember/10 px-2 py-0.5">LOCKED</span>
                                                <span className="text-xs font-barlow text-smoke italic">VS @{opponent?.username}</span>
                                            </div>
                                            <div className="text-2xl font-bebas text-white-app leading-tight truncate">
                                                {u.title || "UNNAMED CLASH"}
                                            </div>
                                            <div className="text-sm font-barlow text-smoke flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-heat" />
                                                {date && date.getFullYear() > 2000
                                                    ? date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                                                    : "TIME NOT SET"}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="border border-smoke border-dashed p-12 text-center text-smoke font-barlow italic">
                                Nothing in the books yet.
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column: Clout & Quick Actions */}
                <div className="flex flex-col gap-8">

                    <div className="bg-ash border border-smoke p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                            <Trophy className="w-32 h-32" />
                        </div>
                        <h3 className="text-2xl font-bebas text-white-app mb-6 tracking-wide">CLOUT LEVEL</h3>
                        <CloutMeter score={profile.clout_score} tier={tier} className="mb-8" />
                        <Link href="/leaderboard" className="text-xs text-ember hover:underline font-bebas tracking-[0.2em] uppercase">VIEW GLOBAL RANKINGS &rarr;</Link>
                    </div>

                    <div className="bg-char border border-smoke p-8">
                        <h3 className="text-2xl font-bebas text-white-app mb-6 tracking-wide">QUICK ACTIONS</h3>
                        <div className="flex flex-col gap-4 font-bebas tracking-widest">
                            <Link href="/for-artists" className="p-4 border border-smoke hover:border-ember text-smoke hover:text-white-app transition-colors flex items-center justify-between group">
                                APPLY FOR FEATURE <span>&rarr;</span>
                            </Link>
                            <Link href="/onboarding" className="p-4 border border-smoke hover:border-ember text-smoke hover:text-white-app transition-colors flex items-center justify-between group">
                                EDIT PROFILE <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    <div className="p-6 bg-ember/5 border border-ember/20">
                        <div className="flex gap-3 text-ember mb-3">
                            <Zap className="w-5 h-5" />
                            <span className="font-bebas text-xl tracking-wide uppercase italic">Pro Tip</span>
                        </div>
                        <p className="text-xs text-smoke font-barlow leading-relaxed uppercase tracking-tight">
                            As the <span className="text-white-app">Chef</span>, you have 48 hours to set the time. After setting the time, the battle is locked in. No-shows will tank your clout score by <span className="text-ember font-bold">100 points</span>.
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}
