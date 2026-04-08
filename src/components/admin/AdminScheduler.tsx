"use client";

import { useState } from "react";
import { Calendar, Flag, Settings } from "lucide-react";
import { scheduleAdminBattle } from "@/app/actions/moderation";

interface Artist {
    id: string;
    username: string;
    display_name: string;
}

export default function AdminScheduler({ artists }: { artists: Artist[] }) {
    const [artistA, setArtistA] = useState("");
    const [artistB, setArtistB] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [genre, setGenre] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            if (artistA === artistB) throw new Error("Artists must be different");
            if (!scheduledAt) throw new Error("Please select a date and time");
            
            // Format datetime-local to ISO string for DB
            const isoDate = new Date(scheduledAt).toISOString();
            
            await scheduleAdminBattle(artistA, artistB, isoDate, genre, title);
            setSuccess(true);
            setArtistA("");
            setArtistB("");
            setScheduledAt("");
            setGenre("");
            setTitle("");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-char border border-smoke p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-smoke/30">
                <Settings className="w-6 h-6 text-ember" />
                <h2 className="text-3xl font-bebas text-white-app tracking-widest uppercase">Force Booking</h2>
            </div>
            
            <p className="text-smoke text-sm mb-6">Manually pair two artists. This will create the battle and send booking notifications to both artists who must accept before it goes live.</p>

            <form onSubmit={handleSchedule} className="space-y-4">
                {error && <div className="p-3 bg-flame/20 text-flame border border-flame text-sm font-bold">{error}</div>}
                {success && <div className="p-3 bg-green-500/20 text-green-500 border border-green-500 text-sm font-bold">Booking sent to artists for acceptance!</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-smoke uppercase font-black tracking-widest">Artist A</label>
                        <select 
                            required
                            value={artistA} 
                            onChange={e => setArtistA(e.target.value)}
                            className="w-full bg-ash border border-smoke text-white-app p-3 font-barlow focus:border-ember outline-none"
                        >
                            <option value="">Select Artist...</option>
                            {artists.map(a => (
                                <option key={a.id} value={a.id}>{a.display_name} (@{a.username})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-smoke uppercase font-black tracking-widest">Artist B</label>
                        <select 
                            required
                            value={artistB} 
                            onChange={e => setArtistB(e.target.value)}
                            className="w-full bg-ash border border-smoke text-white-app p-3 font-barlow focus:border-ember outline-none"
                        >
                            <option value="">Select Artist...</option>
                            {artists.map(a => (
                                <option key={a.id} value={a.id}>{a.display_name} (@{a.username})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-smoke uppercase font-black tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3" /> Scheduled Time</label>
                    <input 
                        type="datetime-local" 
                        required
                        value={scheduledAt}
                        onChange={e => setScheduledAt(e.target.value)}
                        className="w-full bg-ash border border-smoke text-white-app p-3 font-barlow"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-smoke uppercase font-black tracking-widest flex items-center gap-2"><Flag className="w-3 h-3" /> Genre</label>
                        <select 
                            required
                            value={genre} 
                            onChange={e => setGenre(e.target.value)}
                            className="w-full bg-ash border border-smoke text-white-app p-3 font-barlow focus:border-ember outline-none"
                        >
                            <option value="">Select Genre...</option>
                            <option value="freestyle">Freestyle</option>
                            <option value="written">Written</option>
                            <option value="melodic">Melodic</option>
                            <option value="drill">Drill</option>
                            <option value="all">All Styles</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-smoke uppercase font-black tracking-widest flex items-center gap-2">Event Title</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Main Event Clash"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-ash border border-smoke text-white-app p-3 font-barlow focus:border-ember outline-none placeholder:text-smoke/30"
                        />
                    </div>
                </div>

                <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full py-4 bg-ember hover:bg-flame disabled:bg-smoke/30 text-white-app font-bebas text-2xl tracking-widest uppercase transition-all clip-angled mt-6"
                >
                    {loading ? "Booking..." : "Send Admin Booking"}
                </button>
            </form>
        </div>
    );
}
