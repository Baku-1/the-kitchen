import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import BattleCard, { BattleData } from "@/components/ui/BattleCard";
import CloutMeter from "@/components/ui/CloutMeter";
import { getCloutTier } from "@/lib/utils";
import { Mic2, CalendarRange, Cast, Trophy } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";

export default async function Home() {
  const { userId } = await auth();
  const enterUrl = userId ? "/dashboard" : "/auth";
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  // 1. Count live battles and tonight's battles (next 12 hours)
  const tonight = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

  const [{ count: liveCount }, { count: tonightCount }] = await Promise.all([
    supabase.from("battles").select("*", { count: "exact", head: true }).eq("status", "live"),
    supabase.from("battles").select("*", { count: "exact", head: true }).in("status", ["accepted", "live"]).lte("scheduled_at", tonight),
  ]);

  // 2. Featured battle: next upcoming accepted battle, or the current live one
  const { data: featuredRaw } = await supabase
    .from("battles")
    .select(`*, artist_a:artist_a_id (username, display_name, clout_score, wins, losses), artist_b:artist_b_id (username, display_name, clout_score, wins, losses)`)
    .in("status", ["live", "accepted"])
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .single();

  // 3. Upcoming battles (next 5 after featured, any status that's relevant)
  const { data: upcomingRaw } = await supabase
    .from("battles")
    .select(`*, artist_a:artist_a_id (username, display_name, clout_score, wins, losses), artist_b:artist_b_id (username, display_name, clout_score, wins, losses)`)
    .in("status", ["live", "accepted"])
    .order("scheduled_at", { ascending: true })
    .range(1, 5);

  // 4. Leaderboard top 6
  const { data: leaderboardRaw } = await supabase
    .from("users")
    .select("username, display_name, clout_score, wins, losses")
    .order("clout_score", { ascending: false })
    .limit(6);

  // Format battle data for BattleCard component
  const formatBattle = (b: any): BattleData => ({
    id: b.id,
    artist_a: {
      username: b.artist_a.username,
      display_name: b.artist_a.display_name || b.artist_a.username,
      record: `${b.artist_a.wins}W ${b.artist_a.losses}L`,
      clout_score: b.artist_a.clout_score,
    },
    artist_b: {
      username: b.artist_b.username,
      display_name: b.artist_b.display_name || b.artist_b.username,
      record: `${b.artist_b.wins}W ${b.artist_b.losses}L`,
      clout_score: b.artist_b.clout_score,
    },
    scheduled_at: new Date(b.scheduled_at),
    genre: b.genre,
    status: b.status,
    title: b.title,
  });

  const featured = featuredRaw ? formatBattle(featuredRaw) : null;
  const upcoming = (upcomingRaw || []).map(formatBattle);
  const leaderboard = (leaderboardRaw || []).map((a, i) => ({
    rank: i + 1,
    name: a.display_name || a.username,
    score: a.clout_score || 0,
    record: `${a.wins}-${a.losses}`,
  }));

  const liveBadge = (liveCount || 0) > 0
    ? `${liveCount} BATTLE${(liveCount || 0) > 1 ? "S" : ""} LIVE NOW`
    : "NO BATTLES LIVE";
  const tonightBadge = (tonightCount || 0) > 0 ? ` \u2022 ${tonightCount} TONIGHT` : "";

  return (
    <div className="flex-1 w-full bg-char overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-24 px-4">
        {/* Heat Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-ember/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 text-center max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-ember/50 bg-char/50 text-ember tracking-widest font-barlow-condensed mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(255,69,0,0.3)]">
            {(liveCount || 0) > 0 && <span className="w-2 h-2 rounded-full bg-ember animate-ping"></span>}
            {liveBadge}{tonightBadge}
          </div>

          <h1 className="text-8xl md:text-[10rem] leading-none font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white-app to-smoke tracking-tight mb-4 drop-shadow-2xl">
            THE KITCHEN
          </h1>

          <p className="text-xl md:text-3xl text-ember font-barlow-condensed tracking-widest uppercase mb-2">
            If you can&apos;t take the heat, get out of the kitchen.
          </p>
          <p className="text-lg md:text-xl text-smoke font-barlow italic mb-12">
            You can dish it, but can you take it?
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
            <Link
              href={enterUrl}
              className="flex-1 py-4 bg-ember hover:bg-flame text-white-app font-bebas text-2xl tracking-widest transition-colors clip-angled shadow-[0_4px_20px_rgba(255,69,0,0.4)]"
            >
              ENTER THE KITCHEN
            </Link>
            <Link
              href="/battles"
              className="flex-1 py-4 bg-ash border border-smoke hover:border-ember text-white-app font-bebas text-2xl tracking-widest transition-colors clip-angled"
            >
              WATCH LIVE NOW
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED EVENT */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bebas text-smoke mb-6 tracking-wide">MAIN EVENT <span className="text-ember">TONIGHT</span></h2>
          <BattleCard battle={featured} variant="featured" />
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* UPCOMING FEED */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bebas text-white-app tracking-wide">THE SCHEDULE</h2>
            <Link href="/battles" className="text-ember font-barlow-condensed tracking-widest uppercase hover:text-flame">View All &rarr;</Link>
          </div>
          {upcoming.length > 0 ? (
            <div className="flex flex-col gap-4">
              {upcoming.map(b => (
                <BattleCard key={b.id} battle={b} />
              ))}
            </div>
          ) : (
            <div className="text-smoke text-center py-16 bg-ash/30 border border-dashed border-white/10">
              <p className="text-xl uppercase tracking-widest font-bebas">No upcoming battles scheduled.</p>
            </div>
          )}
        </section>

        {/* LEADERBOARD PREVIEW */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bebas text-white-app tracking-wide">TOP CLOUT</h2>
            <Link href="/leaderboard" className="text-smoke font-barlow-condensed tracking-widest uppercase hover:text-ember">Full List &rarr;</Link>
          </div>

          {leaderboard.length > 0 ? (
            <div className="bg-ash border border-smoke p-6 flex flex-col gap-6">
              {leaderboard.map((artist) => (
                <div key={artist.rank} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between font-barlow">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bebas text-smoke w-6">#{artist.rank}</span>
                      <span className="text-lg font-bebas tracking-wide text-white-app">{artist.name}</span>
                    </div>
                    <span className="text-xs text-smoke font-barlow-condensed tracking-widest">{artist.record}</span>
                  </div>
                  <CloutMeter score={artist.score} tier={getCloutTier(artist.score)} compact={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-ash border border-smoke p-6 text-smoke text-center">
              <p className="font-bebas tracking-widest">NO ARTISTS YET</p>
            </div>
          )}
        </section>
      </div>

      {/* HOW IT WORKS */}
      <section className="border-y border-smoke bg-ash py-24 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bebas text-white-app tracking-wide mb-4">HOW IT WORKS</h2>
            <p className="text-smoke font-barlow text-lg">Four steps to legendary status.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-char border border-smoke flex items-center justify-center text-ember">
                <Mic2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bebas tracking-wide">1. CHALLENGE</h3>
              <p className="text-smoke font-barlow text-sm">Call out any artist on the platform. If they accept, the match is locked.</p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-char border border-smoke flex items-center justify-center text-ember">
                <CalendarRange className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bebas tracking-wide">2. SCHEDULE</h3>
              <p className="text-smoke font-barlow text-sm">The battle goes on the public calendar. Share the link. Tell your block.</p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-char border border-smoke flex items-center justify-center text-ember">
                <Cast className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bebas tracking-wide">3. BATTLE LIVE</h3>
              <p className="text-smoke font-barlow text-sm">Split-screen live video. Both of you spitting bars. The crowd goes wild.</p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-char border border-smoke flex items-center justify-center text-ember">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bebas tracking-wide">4. FANS VOTE</h3>
              <p className="text-smoke font-barlow text-sm">Live voting opens for 2 hours post-battle. Winner takes the clout.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
