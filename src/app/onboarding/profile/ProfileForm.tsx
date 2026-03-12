"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/user";

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
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to update profile");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-ash border border-smoke p-8 clip-angled relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember via-flame to-heat"></div>
                <h1 className="text-4xl text-white-app mb-6 font-bebas text-center">SET YOUR STAGE</h1>

                {error && (
                    <div className="bg-char border border-ember text-ember p-4 mb-6 font-barlow text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 font-barlow">
                    <div>
                        <label className="block text-smoke mb-1 uppercase text-sm tracking-wider font-bold">Username</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-char border border-smoke text-white-app p-3 focus:border-ember outline-none transition-colors"
                            value={formData.username}
                            onChange={e => setFormData(p => ({ ...p, username: e.target.value.replace(/\s+/g, '') }))}
                        />
                        <p className="text-xs text-smoke/70 mt-1">Unique, no spaces. Shown publicly.</p>
                    </div>

                    <div>
                        <label className="block text-smoke mb-1 uppercase text-sm tracking-wider font-bold">Display Name</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-char border border-smoke text-white-app p-3 focus:border-ember outline-none transition-colors"
                            value={formData.display_name}
                            onChange={e => setFormData(p => ({ ...p, display_name: e.target.value }))}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-smoke mb-1 uppercase text-sm tracking-wider font-bold">City</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-char border border-smoke text-white-app p-3 focus:border-ember outline-none transition-colors"
                                value={formData.city}
                                onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-smoke mb-1 uppercase text-sm tracking-wider font-bold">Country</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-char border border-smoke text-white-app p-3 focus:border-ember outline-none transition-colors"
                                value={formData.country}
                                onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-smoke mb-1 uppercase text-sm tracking-wider font-bold">Primary Genre</label>
                        <select
                            className="w-full bg-char border border-smoke text-white-app p-3 focus:border-ember outline-none transition-colors appearance-none"
                            value={formData.genre}
                            onChange={e => setFormData(p => ({ ...p, genre: e.target.value }))}
                        >
                            <option value="freestyle">Freestyle</option>
                            <option value="written">Written</option>
                            <option value="melodic">Melodic</option>
                            <option value="drill">Drill</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-smoke mb-1 uppercase text-sm tracking-wider font-bold">Bio</label>
                        <textarea
                            maxLength={160}
                            rows={3}
                            className="w-full bg-char border border-smoke text-white-app p-3 focus:border-ember outline-none transition-colors resize-none"
                            value={formData.bio}
                            onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                            placeholder="160 characters max..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-4 bg-flame hover:bg-heat text-char font-bebas text-2xl tracking-wider transition-colors clip-angled disabled:opacity-50"
                    >
                        {loading ? "SAVING..." : "ENTER THE KITCHEN"}
                    </button>
                </form>
            </div>
        </div>
    );
}
