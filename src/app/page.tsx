import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import BattleCard, { BattleData } from "@/components/ui/BattleCard";
import CloutMeter from "@/components/ui/CloutMeter";
import { getCloutTier } from "@/lib/utils";
import { Mic2, CalendarRange, Cast, Trophy } from "lucide-react";

const MOCK_FEATURED_BATTLE: BattleData = {
  id: "ba1",
  artist_a: { username: "LyricalX", display_name: "LyricalX", record: "23W 4L", clout_score: 920 },
  artist_b: { username: "P_Blaze", display_name: "P-Blaze", record: "18W 9L", clout_score: 764 },
  scheduled_at: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
  genre: "freestyle",
  title: "Main Event",
  status: "accepted"
};

const MOCK_UPCOMING_BATTLES: BattleData[] = [
  {
    id: "ba2",
    artist_a: { username: "FlowKing", display_name: "FlowKing", record: "9W 5L", clout_score: 520 },
    artist_b: { username: "Mad_Mic", display_name: "Mad Mic", record: "7W 7L", clout_score: 480 },
    scheduled_at: new Date(Date.now() - 30 * 60 * 1000), // Started 30 mins ago
    genre: "written",
    status: "live"
  },
  {
    id: "ba3",
    artist_a: { username: "Queen_Spitt", display_name: "Queen Spitt", record: "15W 3L", clout_score: 810 },
    artist_b: { username: "NovaMC", display_name: "NovaMC", record: "11W 8L", clout_score: 610 },
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    genre: "melodic",
    status: "accepted"
  },
  {
    id: "ba4",
    artist_a: { username: "Redhook", display_name: "Redhook", record: "5W 1L", clout_score: 380 },
    artist_b: { username: "Cipher9", display_name: "Cipher9", record: "3W 2L", clout_score: 220 },
    scheduled_at: new Date(Date.now() + 26 * 60 * 60 * 1000),
    genre: "drill",
    title: "UK Division",
    status: "accepted"
  }
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "LyricalX", score: 920, record: "23-4" },
  { rank: 2, name: "Queen Spitt", score: 810, record: "15-3" },
  { rank: 3, name: "P-Blaze", score: 764, record: "18-9" },
  { rank: 4, name: "NovaMC", score: 610, record: "11-8" },
  { rank: 5, name: "FlowKing", score: 520, record: "9-5" },
  { rank: 6, name: "Mad Mic", score: 480, record: "7-7" },
];

export default async function Home() {
  const { userId } = await auth();
  const enterUrl = userId ? "/dashboard" : "/auth";

  return (
    <div className="flex-1 w-full bg-char overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-24 px-4">
        {/* Heat Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-ember/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 text-center max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-ember/50 bg-char/50 text-ember tracking-widest font-barlow-condensed mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(255,69,0,0.3)]">
            <span className="w-2 h-2 rounded-full bg-ember animate-ping"></span>
            1 BATTLE LIVE NOW &bull; 3 TONIGHT
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
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bebas text-smoke mb-6 tracking-wide">MAIN EVENT <span className="text-ember">TONIGHT</span></h2>
        <BattleCard battle={MOCK_FEATURED_BATTLE} variant="featured" />
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* UPCOMING FEED */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bebas text-white-app tracking-wide">THE SCHEDULE</h2>
            <Link href="/battles" className="text-ember font-barlow-condensed tracking-widest uppercase hover:text-flame">View All &rarr;</Link>
          </div>
          <div className="flex flex-col gap-4">
            {MOCK_UPCOMING_BATTLES.map(b => (
              <BattleCard key={b.id} battle={b} />
            ))}
          </div>
        </section>

        {/* LEADERBOARD PREVIEW */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bebas text-white-app tracking-wide">TOP CLOUT</h2>
            <Link href="/leaderboard" className="text-smoke font-barlow-condensed tracking-widest uppercase hover:text-ember">Full List &rarr;</Link>
          </div>

          <div className="bg-ash border border-smoke p-6 flex flex-col gap-6">
            {MOCK_LEADERBOARD.map((artist) => (
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
