import { createAdminClient } from "@/lib/supabase/server";
import ArtistCard from "@/components/artists/ArtistCard";

export default async function ArtistDirectoryPage() {
    const supabase = createAdminClient();

    // Attempt to fetch artists from Supabase
    const { data: artists, error } = await supabase
        .from('users')
        .select('*')
        .order('clout_score', { ascending: false });

    if (error) {
        console.error("Error fetching artists:", JSON.stringify(error, null, 2));
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <h1 className="text-7xl font-bebas text-white-app leading-none tracking-tight">ARTISTS</h1>
                    <p className="text-smoke mt-2 max-w-xl border-l-2 border-ember pl-4">
                        The heavy hitters, the wordsmiths, and the future legends.
                        Browsing the current roster of talent in The Kitchen.
                    </p>
                </div>
                <div className="text-sm text-smoke/50 font-mono bg-ash/50 px-3 py-1 rounded border border-white/5">
                    TOTAL ROSTER: {artists?.length || 0}
                </div>
            </div>

            {error ? (
                <div className="bg-ember/5 border border-ember/20 p-12 rounded-2xl text-center">
                    <h2 className="text-2xl font-bebas text-ember mb-4 uppercase">CONNECTION ERROR</h2>
                    <p className="text-smoke max-w-md mx-auto mb-6">
                        We&apos;re having trouble connecting to the database. If this is a local environment,
                        make sure your Supabase instance is running.
                    </p>
                    <code className="bg-char/50 px-4 py-2 rounded text-xs text-smoke block max-w-sm mx-auto">
                        {JSON.stringify(error).slice(0, 100)}...
                    </code>
                </div>
            ) : (!artists || artists.length === 0) ? (
                <div className="text-smoke text-center py-24 bg-ash/30 rounded-2xl border border-dashed border-white/10">
                    <p className="text-xl">No artists found in the kitchen.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artists.map((artist) => (
                        <ArtistCard key={artist.id} artist={artist as import("@/types").UserProfile} />
                    ))}
                </div>
            )}
        </div>
    );
}
