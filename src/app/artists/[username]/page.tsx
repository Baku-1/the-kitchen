import Link from "next/link";
import CloutMeter from "@/components/ui/CloutMeter";
import BattleCard, { BattleMock } from "@/components/ui/BattleCard";
import { getCloutTier } from "@/lib/utils";
import { MapPin, Trophy, Swords, Share2, Plus, CalendarRange } from "lucide-react";

export default async function ArtistProfilePage({ params }: { params: { username: string } }) {
    const { username } = await params;

    // Mock Data
    const artist = {
        username,
        display_name: username.replace("_", " "),
        city: "Chicago",
        country: "USA",
        genre: "freestyle",
        bio: "Taking bodies every night. Undefeated in the Midwest. Step into the kitchen if you want this smoke.",
        wins: 23,
        losses: 4,
        draws: 0,
        no_shows: 0,
        battle_count: 27,
        clout_score: 920,
        avatar_url: ""
    };

    const tier = getCloutTier(artist.clout_score);

    const upcomingBattles: BattleMock[] = [
        {
            id: "ba2",
            artist_a: { username: artist.username, display_name: artist.display_name, record: "23W 4L", clout_score: artist.clout_score },
            artist_b: { username: "P_Blaze", display_name: "P-Blaze", record: "18W 9L", clout_score: 764 },
            scheduled_at: new Date(Date.now() + 4 * 60 * 60 * 1000),
            genre: "freestyle",
            title: "Featured Matchup",
            status: "accepted"
        }
    ];

    const pastBattles: BattleMock[] = [
        {
            id: "ba10",
            artist_a: { username: artist.username, display_name: artist.display_name, record: "22W 4L", clout_score: 900 },
            artist_b: { username: "Mad_Mic", display_name: "Mad Mic", record: "7W 6L", clout_score: 480 },
            scheduled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            genre: "freestyle",
            status: "completed"
        }
    ];

    return (
        <div className="flex-1 w-full bg-char overflow-hidden">

            {/* Banner Area */}
            <div className="h-64 md:h-80 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-char via-char to-ember/20 border-b border-smoke"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-ember/10 rounded-full blur-[80px] pointer-events-none" />
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-10 pb-24">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start mb-12">

                    <div className="w-40 h-40 md:w-56 md:h-56 bg-ash border-2 border-smoke shadow-2xl shrink-0 flex items-center justify-center text-6xl text-smoke font-bebas relative">
                        {artist.display_name.charAt(0).toUpperCase()}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-ember to-heat" />
                    </div>

                    <div className="flex-1 flex flex-col gap-4 mt-4 md:mt-24 w-full">
                        <div className="flex flex-wrap items-baseline justify-between gap-4">
                            <div>
                                <h1 className="text-5xl md:text-7xl font-bebas text-white-app tracking-wide leading-none">{artist.display_name}</h1>
                                <div className="flex items-center gap-4 text-smoke font-barlow mt-2">
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-ember" /> {artist.city}, {artist.country}</span>
                                    <span className="px-2 py-0.5 bg-smoke/20 border border-smoke text-xs uppercase tracking-widest">{artist.genre}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="w-12 h-12 flex items-center justify-center bg-char border border-smoke hover:border-ember text-smoke hover:text-white-app transition-colors clip-angled">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <Link href={`/challenge?to=${artist.username}`} className="h-12 px-6 flex items-center gap-2 bg-ember hover:bg-flame text-white-app font-bebas text-xl tracking-wider transition-colors clip-angled">
                                    <Swords className="w-5 h-5" /> CHALLENGE
                                </Link>
                            </div>
                        </div>

                        <p className="text-smoke text-lg font-barlow max-w-2xl">{artist.bio}</p>
                    </div>
                </div>

                {/* Clout Section */}
                <div className="bg-ash border border-smoke p-6 md:p-8 mb-12 shadow-xl">
                    <CloutMeter score={artist.clout_score} tier={tier} className="mb-8" />

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-x divide-smoke/50 text-center font-bebas tracking-wide">
                        <div className="flex flex-col">
                            <span className="text-smoke text-sm">WINS</span>
                            <span className="text-4xl text-white-app">{artist.wins}</span>
                        </div>
                        <div className="flex flex-col border-none md:border-solid">
                            <span className="text-smoke text-sm">LOSSES</span>
                            <span className="text-4xl text-smoke">{artist.losses}</span>
                        </div>
                        <div className="flex flex-col border-none md:border-solid">
                            <span className="text-smoke text-sm">DRAWS</span>
                            <span className="text-4xl text-smoke">{artist.draws}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-smoke text-sm">NO-SHOWS</span>
                            <span className="text-4xl text-ember">{artist.no_shows}</span>
                        </div>
                        <div className="flex flex-col col-span-2 md:col-span-1">
                            <span className="text-smoke text-sm">TOTAL BATTLES</span>
                            <span className="text-4xl text-heat">{artist.battle_count}</span>
                        </div>
                    </div>
                </div>

                {/* Battles Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    <section>
                        <h2 className="text-3xl font-bebas text-white-app tracking-wide mb-6 flex items-center gap-2">
                            <CalendarRange className="w-6 h-6 text-ember" /> UPCOMING BATTLES
                        </h2>
                        {upcomingBattles.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {upcomingBattles.map(b => (
                                    <BattleCard key={b.id} battle={b} />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-smoke border-dashed p-8 text-center text-smoke font-barlow">
                                No battles scheduled.
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-3xl font-bebas text-white-app tracking-wide mb-6 flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-heat" /> BATTLE HISTORY
                        </h2>
                        {pastBattles.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {pastBattles.map(b => (
                                    <BattleCard key={b.id} battle={b} />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-smoke border-dashed p-8 text-center text-smoke font-barlow">
                                No past battles.
                            </div>
                        )}
                    </section>

                </div>

            </div>
        </div>
    );
}
