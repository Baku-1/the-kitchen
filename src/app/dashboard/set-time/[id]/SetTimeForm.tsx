"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { finalizeChallenge } from "@/app/actions/battles";
import { Clock, Calendar, AlertTriangle } from "lucide-react";

export default function SetTimeForm({ battleId }: { battleId: string }) {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Combine date and time into a single ISO string
            const scheduledAt = new Date(`${date}T${time}`).toISOString();

            await finalizeChallenge({
                battleId,
                scheduledAt
            });

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to schedule battle");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 font-barlow">
            {error && (
                <div className="p-4 bg-flame/10 border border-flame text-flame flex items-center gap-3 animate-shake">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-tight text-sm">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-smoke mb-2 uppercase text-xs tracking-[0.2em] font-bold">SELECT DATE</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ember" />
                        <input
                            required
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-char border border-smoke text-white-app p-5 pl-12 focus:border-ember outline-none transition-all [color-scheme:dark] font-bold tracking-widest"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-smoke mb-2 uppercase text-xs tracking-[0.2em] font-bold">SELECT TIME</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ember" />
                        <input
                            required
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-char border border-smoke text-white-app p-5 pl-12 focus:border-ember outline-none transition-all [color-scheme:dark] font-bold tracking-widest"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading || !date || !time}
                    className="w-full py-6 bg-ember hover:bg-flame disabled:bg-ash disabled:text-smoke disabled:border-smoke text-white-app font-bebas text-4xl tracking-[0.1em] transition-all clip-angled shadow-[0_10px_30px_rgba(255,69,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,69,0,0.4)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4"
                >
                    {loading ? (
                        <div className="w-8 h-8 border-4 border-white-app border-t-transparent rounded-full animate-spin" />
                    ) : (
                        "LOCK IN THE SCHEDULE"
                    )}
                </button>
            </div>
        </form>
    );
}
