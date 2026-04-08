"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/user";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProfileEditFormProps {
    initialData: {
        username: string;
        display_name: string;
        city: string;
        country: string;
        genre: string;
        bio: string;
    };
}

export default function ProfileEditForm({ initialData }: ProfileEditFormProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [formData, setFormData] = useState(initialData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            await updateProfile(formData);
            setStatus({ type: 'success', message: "Profile updated successfully!" });
        } catch (err: unknown) {
            console.error(err);
            setStatus({ type: 'error', message: err instanceof Error ? err.message : "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-ash border border-smoke p-10 clip-angled relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember via-flame to-heat"></div>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-5xl text-white-app font-bebas tracking-wide uppercase italic">Edit Profile</h1>
                <Link href="/dashboard" className="text-[10px] text-smoke hover:text-white-app font-black uppercase tracking-widest flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
            </div>

            {status && (
                <div className={cn(
                    "p-4 mb-8 font-barlow text-sm font-bold flex items-center gap-3 animate-fade-in",
                    status.type === 'success' ? "bg-ember/10 border border-ember text-ember" : "bg-flame/10 border border-flame text-flame"
                )}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 font-barlow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-smoke mb-2 uppercase text-[10px] tracking-widest font-black">Username</label>
                        <input
                            disabled
                            type="text"
                            className="w-full bg-char/50 border border-smoke/30 text-smoke/50 p-4 outline-none font-bold italic"
                            value={formData.username}
                        />
                        <p className="text-[8px] text-smoke/30 mt-2 uppercase font-bold tracking-widest">Username cannot be changed.</p>
                    </div>

                    <div>
                        <label className="block text-smoke mb-2 uppercase text-[10px] tracking-widest font-black">Display Name</label>
                        <input
                            required
                            type="text"
                            maxLength={50}
                            className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-all font-bold"
                            value={formData.display_name}
                            onChange={e => setFormData(p => ({ ...p, display_name: e.target.value }))}
                            placeholder="Kurt the Great"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <label className="block text-smoke mb-2 uppercase text-[10px] tracking-widest font-black">City</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-all font-bold"
                            value={formData.city}
                            onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                            placeholder="Detroit"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-smoke mb-2 uppercase text-[10px] tracking-widest font-black">Country</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-all font-bold"
                            value={formData.country}
                            onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
                            placeholder="USA"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-smoke mb-2 uppercase text-[10px] tracking-widest font-black">Primary Genre</label>
                    <div className="relative">
                        <select
                            className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-all font-bold appearance-none cursor-pointer uppercase tracking-widest text-sm"
                            value={formData.genre}
                            onChange={e => setFormData(p => ({ ...p, genre: e.target.value }))}
                        >
                            <option value="freestyle">Freestyle</option>
                            <option value="written">Written</option>
                            <option value="melodic">Melodic</option>
                            <option value="drill">Drill</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-smoke">▼</div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-smoke uppercase text-[10px] tracking-widest font-black">Bio</label>
                        <span className={cn(
                            "text-[10px] font-black tracking-widest uppercase",
                            formData.bio.length >= 150 ? "text-ember" : "text-smoke/50"
                        )}>
                            {formData.bio.length} / 160
                        </span>
                    </div>
                    <textarea
                        maxLength={160}
                        rows={4}
                        className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-all resize-none font-medium placeholder:text-smoke/30"
                        value={formData.bio}
                        onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                        placeholder="I don't just cook, I scorch the earth..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-6 bg-ember hover:bg-flame text-white-app font-bebas text-3xl tracking-widest transition-all clip-angled shadow-[0_10px_30px_rgba(255,69,0,0.3)] disabled:opacity-50 active:scale-[0.98]"
                >
                    {loading ? (
                        <div className="w-8 h-8 border-4 border-white-app border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                        "UPDATE PROFILE 🔥"
                    )}
                </button>
            </form>
        </div>
    );
}
