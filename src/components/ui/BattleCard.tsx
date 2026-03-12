"use client";

import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar, Video } from "lucide-react";
import { addToGoogleCalendar } from "@/lib/calendar";

export interface ArtistData {
    username: string;
    display_name: string;
    record: string;
    avatar_url?: string;
    clout_score: number;
}

export interface BattleData {
    id: string;
    artist_a: ArtistData;
    artist_b: ArtistData;
    scheduled_at: Date;
    genre: string;
    status: "live" | "accepted" | "completed";
    title?: string;
}

export default function BattleCard({ battle, variant = "row" }: { battle: BattleData, variant?: "row" | "featured" }) {
    const isLive = battle.status === "live";

    if (variant === "featured") {
        return (
            <div className="relative w-full bg-ash border border-smoke overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember via-flame to-heat"></div>
                <div className="p-8 flex flex-col items-center text-center">

                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-char border border-smoke text-xs font-barlow-condensed tracking-widest uppercase text-smoke">
                            {battle.genre}
                        </span>
                        {isLive ? (
                            <span className="flex items-center gap-2 text-ember font-barlow-condensed tracking-widest uppercase font-bold text-sm bg-ember/10 px-3 py-1 rounded">
                                <span className="w-2 h-2 rounded-full bg-ember animate-ping"></span>
                                LIVE NOW
                            </span>
                        ) : (
                            <span className="text-sm font-barlow-condensed tracking-widest text-heat uppercase">
                                {format(battle.scheduled_at, "MMM do, h:mm a")}
                            </span>
                        )}
                        {battle.title && (
                            <span className="text-sm font-barlow text-smoke uppercase">
                                &bull; {battle.title}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-8 w-full max-w-2xl mb-8">
                        <div className="flex-1 flex justify-end text-right">
                            <div>
                                <h3 className="text-3xl font-bebas text-white-app tracking-wide">{battle.artist_a.display_name}</h3>
                                <p className="text-smoke font-barlow text-sm uppercase">{battle.artist_a.record}</p>
                            </div>
                        </div>

                        <div className="text-4xl text-smoke font-bebas opacity-50 px-4">VS</div>

                        <div className="flex-1 flex justify-start text-left">
                            <div>
                                <h3 className="text-3xl font-bebas text-white-app tracking-wide">{battle.artist_b.display_name}</h3>
                                <p className="text-smoke font-barlow text-sm uppercase">{battle.artist_b.record}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {isLive ? (
                            <Link
                                href={`/battles/${battle.id}`}
                                className="px-8 py-3 bg-ember hover:bg-flame text-white-app font-bebas text-xl tracking-wider clip-angled transition-colors flex items-center gap-2"
                            >
                                <Video className="w-5 h-5" /> WATCH LIVE
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={`/battles/${battle.id}`}
                                    className="px-8 py-3 bg-char border hover:border-smoke text-white-app font-bebas text-xl tracking-wider clip-angled transition-colors"
                                >
                                    BATTLE DETAILS
                                </Link>
                                <div className="flex">
                                    <button
                                        onClick={() => addToGoogleCalendar({
                                            id: battle.id,
                                            artist_a_name: battle.artist_a.display_name,
                                            artist_b_name: battle.artist_b.display_name,
                                            scheduled_at: battle.scheduled_at
                                        })}
                                        className="px-6 py-3 bg-smoke/30 hover:bg-smoke text-smoke hover:text-white-app font-bebas text-xl tracking-wider clip-angled transition-colors flex items-center gap-2"
                                    >
                                        <Calendar className="w-5 h-5" /> ADD TO CALENDAR
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Row Variant
    return (
        <Link
            href={`/battles/${battle.id}`}
            className={cn(
                "flex items-center justify-between p-4 bg-ash border transition-all hover:bg-smoke/30",
                isLive ? "border-l-4 border-l-ember border-y-smoke border-r-smoke bg-ember/5" : "border-smoke hover:border-smoke/80"
            )}
        >
            <div className="flex items-center gap-6">
                <div className="w-24 text-center">
                    {isLive ? (
                        <span className="text-ember font-barlow-condensed tracking-widest uppercase font-bold text-xs flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse"></span>
                            LIVE
                        </span>
                    ) : (
                        <span className="text-smoke font-barlow-condensed tracking-widest uppercase text-xs">
                            {format(battle.scheduled_at, "MMM dd, h:mm a")}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xl font-bebas tracking-wide w-32 text-right truncate">
                        {battle.artist_a.display_name}
                    </span>
                    <span className="text-xs text-smoke font-bebas opacity-50">VS</span>
                    <span className="text-xl font-bebas tracking-wide w-32 truncate">
                        {battle.artist_b.display_name}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="hidden sm:inline-block px-2 py-1 bg-char border border-smoke text-[10px] font-barlow-condensed tracking-widest uppercase text-smoke">
                    {battle.genre}
                </span>
                <div className="text-xs font-barlow-condensed tracking-widest text-ember uppercase">
                    {isLive ? "Watch →" : "Details →"}
                </div>
            </div>
        </Link>
    );
}
