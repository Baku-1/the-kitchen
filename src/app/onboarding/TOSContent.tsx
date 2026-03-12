"use client";

import { useState } from "react";
import { acceptTOS } from "@/app/actions/user";
import { useRouter } from "next/navigation";

export default function TOSContent() {
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!accepted) return;
        setLoading(true);
        try {
            await acceptTOS();
            router.push("/onboarding/profile");
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-ash border border-smoke p-8 clip-angled relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember via-flame to-heat"></div>

                <div className="text-center mb-8">
                    <div className="text-6xl mb-4 animate-bounce">🔥</div>
                    <h1 className="text-6xl font-bebas text-white-app tracking-wide leading-none mb-2">KNOW THE RULES OF THE HOUSE</h1>
                    <p className="text-ember font-barlow uppercase tracking-widest font-bold text-sm">Read carefully. This is the only warning.</p>
                </div>

                <div className="bg-char border border-smoke p-6 h-96 overflow-y-auto mb-8 text-sm text-smoke/90 space-y-6 rounded-none font-barlow scrollbar-thin scrollbar-thumb-ember">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="text-ember font-bold">•</span>
                            <p>No gang references, affiliations, or coded street language.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-ember font-bold">•</span>
                            <p>No threats of real-world violence against any individual.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-ember font-bold">•</span>
                            <p>No excessive profanity beyond what the battle artistically requires.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-ember font-bold">•</span>
                            <p>No hate speech targeting race, gender, sexuality, religion, or nationality.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-ember font-bold">•</span>
                            <p className="text-white-app bg-flame/10 px-2">No-show to a scheduled battle = automatic loss. Your record is permanent and public.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-ember font-bold">•</span>
                            <p>Strike 1: Warning. Strike 2: 30-day suspension. Strike 3: Permanent public ban.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-ember font-bold">•</span>
                            <p>By battling you grant The Kitchen license to clip and share your performance.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-ember font-bold">•</span>
                            <p>The Kitchen&apos;s decisions on violations are final.</p>
                        </div>
                    </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer mb-10 group">
                    <div className="mt-1 relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                        />
                        <div className="w-6 h-6 border-2 border-smoke bg-char peer-checked:border-ember peer-checked:bg-ember transition-all shadow-[0_0_10px_rgba(255,69,0,0)] peer-checked:shadow-[0_0_15px_rgba(255,69,0,0.4)]"></div>
                        {accepted && (
                            <svg className="absolute w-4 h-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <span className="text-xs text-smoke/70 group-hover:text-white-app transition-colors select-none font-barlow font-bold uppercase tracking-tight leading-relaxed">
                        I have read and agree to The Kitchen&apos;s Terms of Service and Community Standards. I understand violations result in account termination and a permanent public record on my profile.
                    </span>
                </label>

                <button
                    disabled={!accepted || loading}
                    onClick={handleSubmit}
                    className="w-full py-6 bg-ember hover:bg-flame disabled:bg-smoke/10 disabled:text-smoke/30 text-white-app font-bebas text-3xl tracking-widest transition-all clip-angled shadow-[0_10px_30px_rgba(255,69,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,69,0,0.5)] active:scale-[0.98]"
                >
                    {loading ? (
                        <div className="w-8 h-8 border-4 border-white-app border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                        "I ACCEPT — STEP INTO THE KITCHEN"
                    )}
                </button>
            </div>
        </div>
    );
}
