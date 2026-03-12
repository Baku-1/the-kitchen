import Link from "next/link";
import { getCloutTier, getTierColor } from "@/lib/utils";
import { User } from "lucide-react";
import CloutMeter from "@/components/ui/CloutMeter";

interface ArtistCardProps {
    artist: {
        id: string;
        username: string;
        display_name: string | null;
        city: string | null;
        country: string | null;
        genre: string | null;
        clout_score: number | null;
        avatar_url: string | null;
    };
}

export default function ArtistCard({ artist }: ArtistCardProps) {
    const cloutScore = artist.clout_score || 0;
    const tier = getCloutTier(cloutScore);
    const tierColor = getTierColor(tier);

    return (
        <Link
            href={`/artists/${artist.username}`}
            className="group relative bg-ash/50 border border-white/5 p-6 rounded-xl hover:bg-ember/10 transition-all duration-300 overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-ember/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-center gap-6">
                {/* Avatar Placeholder */}
                <div className="w-20 h-20 rounded-full bg-char border-2 border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:border-ember/50 transition-colors">
                    {artist.avatar_url ? (
                        <img src={artist.avatar_url} alt={artist.username} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-10 h-10 text-smoke group-hover:text-ember transition-colors" />
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-2xl font-bebas text-white-app tracking-wide group-hover:text-ember transition-colors">
                            {artist.display_name || artist.username}
                        </h3>
                        <div className="flex flex-col items-end">
                            <span
                                className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                                style={{ backgroundColor: `${tierColor}20`, color: tierColor }}
                            >
                                {tier}
                            </span>
                        </div>
                    </div>

                    <p className="text-smoke text-sm mb-3">
                        {artist.city}{artist.country ? `, ${artist.country}` : ''}
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-smoke/50 uppercase font-bold tracking-tighter">Genre</span>
                            <span className="text-sm text-white-app font-medium capitalize">{artist.genre || 'Various'}</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex flex-col items-center">
                            <CloutMeter score={cloutScore} tier={tier} compact />
                        </div>
                    </div>
                </div>
            </div>

            {/* Angled Clip-path decoration */}
            <div className="absolute top-0 right-0 w-16 h-1 bg-ember/20 group-hover:bg-ember transition-colors" />
        </Link>
    );
}
