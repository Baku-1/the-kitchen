"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/user";
import { cn } from "@/lib/utils";

export default function ProfileForm({ defaultUsername }: { defaultUsername: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        username: defaultUsername,
        display_name: "",
        city: "",
        country: "",
        genre: "freestyle",
        bio: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await updateProfile(formData);
            // Wait for revalidation
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to update profile");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-ash border border-smoke p-8 clip-angled relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember via-flame to-heat"></div>
                <h1 className="text-4xl text-white-app mb-2 font-bebas text-center tracking-wide">SET YOUR STAGE</h1>
                <p className="text-ember font-barlow text-center uppercase tracking-widest text-xs mb-8 font-bold">This is how the world sees you.</p>

                {error && (
                    <div className="bg-flame/10 border border-flame text-flame p-4 mb-6 font-barlow text-sm font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 font-barlow">
                    <div>
                        <label className="block text-smoke mb-2 uppercase text-xs tracking-tighter font-black">Username</label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                maxLength={30}
                                className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-all font-bold placeholder:text-smoke/30"
                                value={formData.username}
                                onChange={e => setFormData(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                                placeholder="chef_kurt"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-smoke/50 uppercase font-black">@ {formData.username.length}/30</div>
                        </div>
                        <p className="text-[10px] text-smoke/50 mt-2 uppercase font-bold tracking-tighter">Unique handle. No spaces. Max 30 chars.</p>
                    </div>

                    <div>
                        <label className="block text-smoke mb-2 uppercase text-xs tracking-tighter font-black">Display Name</label>
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

                    <div className="flex gap-4">
                        <div className="flex-[2]">
                            <label className="block text-smoke mb-2 uppercase text-xs tracking-tighter font-black">City</label>
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
                            <label className="block text-smoke mb-2 uppercase text-xs tracking-tighter font-black">Country</label>
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
                        <label className="block text-smoke mb-2 uppercase text-xs tracking-tighter font-black">Primary Genre</label>
                        <div className="relative">
                            <select
                                className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-all font-bold appearance-none cursor-pointer"
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
                            <label className="block text-smoke uppercase text-xs tracking-tighter font-black">Bio</label>
                            <span className={cn(
                                "text-[10px] font-black tracking-tighter uppercase",
                                formData.bio.length >= 150 ? "text-ember" : "text-smoke/50"
                            )}>
                                {formData.bio.length} / 160
                            </span>
                        </div>
                        <textarea
                            maxLength={160}
                            rows={3}
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
                            "LET'S COOK 🔥"
                        )}
                    </button>
                    <p className="text-[10px] text-smoke/40 text-center uppercase tracking-widest font-bold">Your record is permanent. Build it well.</p>
                </form>
            </div>
        </div>
    );
}
