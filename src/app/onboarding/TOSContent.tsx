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

                <h1 className="text-4xl text-white-app mb-6 text-center">KNOW THE RULES OF THE HOUSE</h1>

                <div className="bg-char border border-smoke p-6 h-80 overflow-y-auto mb-6 text-sm text-smoke/90 space-y-4 rounded font-barlow">
                    <p className="text-white-app font-bold mb-2 uppercase text-lg text-ember">Terms of Service & Community Standards</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>No gang references, affiliations, or coded street language.</li>
                        <li>No threats of real-world violence against any individual.</li>
                        <li>Excessive profanity beyond what the battle artistically requires is prohibited.</li>
                        <li>No hate speech targeting race, gender, sexuality, religion, or nationality.</li>
                        <li className="text-flame">No-show to a scheduled battle = automatic loss of credibility. The community keeps the score.</li>
                        <li>Violation = immediate suspension. Second violation = permanent ban with public record.</li>
                        <li>By battling, you grant The Kitchen a license to clip and share your performance.</li>
                        <li>The Kitchen&apos;s decisions on rule violations are final.</li>
                    </ul>
                </div>

                <label className="flex items-start gap-4 cursor-pointer mb-8 group">
                    <div className="mt-1 relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                        />
                        <div className="w-6 h-6 border-2 border-smoke bg-char peer-checked:border-ember peer-checked:bg-ember transition-colors"></div>
                        {accepted && (
                            <svg className="absolute w-4 h-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <span className="text-sm text-smoke/80 group-hover:text-white-app transition-colors select-none font-barlow font-medium">
                        I have read and agree to The Kitchen&apos;s Terms of Service and Community Standards. I understand violations result in account termination and a permanent public record.
                    </span>
                </label>

                <button
                    disabled={!accepted || loading}
                    onClick={handleSubmit}
                    className="w-full py-4 bg-ember hover:bg-flame disabled:bg-smoke disabled:text-char text-white-app font-bebas text-2xl tracking-wider transition-colors clip-angled"
                >
                    {loading ? "ACCEPTING..." : "ACCEPT & ENTER"}
                </button>
            </div>
        </div>
    );
}
