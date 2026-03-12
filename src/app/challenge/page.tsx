"use client";

import { useState } from "react";

export default function ChallengePage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock submit process
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    if (success) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-24 w-full text-center animate-fade-in">
                <div className="w-24 h-24 bg-char border-4 border-ember rounded-full flex items-center justify-center mx-auto mb-8 text-ember">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-5xl font-bebas text-white-app mb-4 tracking-wide">CHALLENGE SENT.</h1>
                <p className="text-xl text-smoke font-barlow mb-12">
                    They have 48 hours to accept. We'll let you know when they respond.
                </p>
                <button
                    onClick={() => window.location.href = "/dashboard"}
                    className="px-8 py-4 bg-ember hover:bg-flame text-white-app font-bebas text-2xl tracking-wider transition-colors clip-angled"
                >
                    RETURN TO DASHBOARD
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 w-full">

            <div className="text-center mb-12">
                <h1 className="text-6xl font-bebas text-white-app tracking-wide mb-4 text-transparent bg-clip-text bg-gradient-to-r from-ember to-heat">
                    SEND A CHALLENGE
                </h1>
                <p className="text-lg text-smoke font-barlow">Call out an opponent. Set the terms. See if they accept.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-ash border border-smoke p-8 clip-angled font-barlow relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember to-flame"></div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-smoke mb-2 uppercase text-sm tracking-widest font-bold">Opponent Username</label>
                        <input
                            required
                            type="text"
                            placeholder="@username"
                            className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-colors text-lg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-smoke mb-2 uppercase text-sm tracking-widest font-bold">Date</label>
                            <input
                                required
                                type="date"
                                min={new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0]} // Must be 48h in future
                                className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-colors [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-smoke mb-2 uppercase text-sm tracking-widest font-bold">Time (Your Local Time)</label>
                            <input
                                required
                                type="time"
                                className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-colors [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-smoke mb-2 uppercase text-sm tracking-widest font-bold">Genre</label>
                            <select className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-colors appearance-none">
                                <option value="freestyle">Freestyle</option>
                                <option value="written">Written</option>
                                <option value="melodic">Melodic</option>
                                <option value="drill">Drill</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-smoke mb-2 uppercase text-sm tracking-widest font-bold">Event Title (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. East Coast vs South"
                                maxLength={40}
                                className="w-full bg-char border border-smoke text-white-app p-4 focus:border-ember outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-smoke/50 mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-ember hover:bg-flame disabled:bg-smoke disabled:text-char text-white-app font-bebas text-3xl tracking-widest transition-colors clip-angled shadow-[0_0_20px_rgba(255,69,0,0.3)]"
                        >
                            {loading ? "SENDING CHALLENGE..." : "LOCK IT IN"}
                        </button>
                        <p className="text-center text-xs text-smoke mt-4 uppercase tracking-widest">
                            By challenging, you agree to show up. No-shows result in a severe loss of credibility.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
