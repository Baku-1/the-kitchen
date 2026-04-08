"use client";

import { useEffect, useState } from "react";
import { getApplications, updateApplicationStatus, getActiveArtists } from "@/app/actions/applications";
import AdminScheduler from "@/components/admin/AdminScheduler";
import { Check, X, ExternalLink, User, Music, MapPin, Globe, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { UserProfile } from "@/types";

interface Application {
    id: string;
    stage_name: string;
    genre: string;
    location: string;
    status: string;
    bio: string;
    sample_url?: string;
    social_handle?: string;
    created_at: string;
    updated_at?: string;
    user?: Partial<UserProfile>;
}

export default function AdminPortal() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [artists, setArtists] = useState<Partial<UserProfile>[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadApps = async () => {
        setLoading(true);
        try {
            const data = await getApplications();
            setApplications(data);
            
            const artistsData = await getActiveArtists();
            setArtists(artistsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApps();
    }, []);

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        setProcessingId(id);
        try {
            await updateApplicationStatus(id, status);
            await loadApps();
        } catch (err) {
            console.error(err);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="flex-1 w-full bg-char min-h-screen p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-smoke pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-ember rounded-full animate-pulse" />
                            <span className="text-xs font-black text-ember uppercase tracking-[0.3em]">System Level Access</span>
                        </div>
                        <h1 className="text-6xl font-bebas text-white-app tracking-wide uppercase">Admin Portal</h1>
                        <p className="text-smoke font-barlow italic">Reviewing the next generation of Kitchen legends.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-4 bg-ash border border-smoke flex flex-col items-center">
                            <span className="text-3xl font-bebas text-white-app">{applications.filter(a => a.status === 'pending').length}</span>
                            <span className="text-[10px] text-smoke uppercase font-black tracking-widest">Pending</span>
                        </div>
                        <div className="px-6 py-4 bg-ash border border-smoke flex flex-col items-center">
                            <span className="text-3xl font-bebas text-white-app">{applications.filter(a => a.status === 'approved').length}</span>
                            <span className="text-[10px] text-smoke uppercase font-black tracking-widest">Approved</span>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="h-64 flex items-center justify-center text-smoke font-bebas text-2xl tracking-widest animate-pulse">
                        SCANNING FREQUENCIES...
                    </div>
                ) : applications.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center bg-ash/30 border border-smoke/20 border-dashed">
                        <Info className="w-12 h-12 text-smoke/30 mb-4" />
                        <p className="text-smoke font-bebas text-2xl tracking-widest">NO APPLICATIONS IN QUEUE</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {applications.map((app) => (
                            <div
                                key={app.id}
                                className={cn(
                                    "bg-ash border transition-all duration-300 relative overflow-hidden group",
                                    app.status === 'pending' ? "border-smoke" : (app.status === 'approved' ? "border-ember/30" : "border-flame/20 opacity-60")
                                )}
                            >
                                {/* Status Banner */}
                                <div className={cn(
                                    "absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
                                    app.status === 'pending' ? "bg-smoke text-char" : (app.status === 'approved' ? "bg-ember text-white-app" : "bg-flame text-white-app")
                                )}>
                                    {app.status}
                                </div>

                                <div className="p-8 flex flex-col lg:flex-row gap-8">
                                    {/* Artist Info */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 bg-char border border-smoke flex items-center justify-center text-3xl font-bebas text-smoke">
                                                {app.stage_name[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-4xl font-bebas text-white-app tracking-wide uppercase leading-none mb-1">{app.stage_name}</h3>
                                                <div className="flex items-center gap-4 text-[10px] text-smoke font-black uppercase tracking-widest">
                                                    <span className="flex items-center gap-1"><Music className="w-3 h-3" /> {app.genre}</span>
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {app.location}</span>
                                                    <span className="flex items-center gap-1 text-ember"><User className="w-3 h-3" /> @{app.user?.username}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-char/50 p-6 border-l-2 border-smoke/30 italic font-barlow text-smoke leading-relaxed">
                                            &quot;{app.bio}&quot;
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            <a
                                                href={app.sample_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-char border border-smoke hover:border-ember text-white-app font-bebas text-sm tracking-widest flex items-center gap-2 transition-all uppercase"
                                            >
                                                <Globe className="w-4 h-4" /> View Sample <ExternalLink className="w-3 h-3" />
                                            </a>
                                            <div className="px-4 py-2 bg-char border border-smoke text-smoke font-bebas text-sm tracking-widest flex items-center gap-2 uppercase">
                                                SOCIAL: {app.social_handle}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="lg:w-64 border-l border-smoke/20 lg:pl-8 flex flex-col justify-center gap-4">
                                        {app.status === 'pending' ? (
                                            <>
                                                <button
                                                    disabled={processingId === app.id}
                                                    onClick={() => handleAction(app.id, 'approved')}
                                                    className="w-full py-4 bg-ember hover:bg-flame disabled:bg-smoke/20 text-white-app font-bebas text-xl tracking-widest flex items-center justify-center gap-2 transition-all clip-angled"
                                                >
                                                    {processingId === app.id ? "WAIT..." : <><Check className="w-5 h-5" /> APPROVE</>}
                                                </button>
                                                <button
                                                    disabled={processingId === app.id}
                                                    onClick={() => handleAction(app.id, 'rejected')}
                                                    className="w-full py-4 bg-char border border-flame/30 hover:border-flame disabled:opacity-30 text-flame font-bebas text-xl tracking-widest flex items-center justify-center gap-2 transition-all clip-angled"
                                                >
                                                    <X className="w-5 h-5" /> REJECT
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center p-4">
                                                <p className="text-[10px] text-smoke uppercase font-black tracking-widest mb-1">Processed By System</p>
                                                <p className="text-smoke/50 text-xs font-barlow italic">
                                                    {app.updated_at ? format(new Date(app.updated_at), "MMM d, yyyy HH:mm") : "—"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Admin Scheduling Section */}
                <div className="mt-12">
                    <AdminScheduler artists={artists.filter(a => a.id) as { id: string; username: string; display_name: string; }[]} />
                </div>
            </div>
        </div>
    );
}
