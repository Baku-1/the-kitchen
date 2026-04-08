"use client";

import { useEffect, useState } from "react";
import { useDataChannel } from "@livekit/components-react";

export default function CrowdEnergyBar({ isCompleted = false }: { battleId: string, isCompleted?: boolean }) {
    const [energy, setEnergy] = useState(30);
    const [maxEnergy, setMaxEnergy] = useState(30);

    // Increment energy natively via WebRTC data channel callback
    useDataChannel("chat", (msg) => {
        if (msg && msg.payload) {
            setEnergy(prev => {
                const newEnergy = Math.min(prev + 8, 100);
                if (newEnergy > maxEnergy) setMaxEnergy(newEnergy);
                return newEnergy;
            });
        }
    });

    useEffect(() => {
        // Decay logic: slowly drop energy over time
        const interval = setInterval(() => {
            setEnergy(prev => Math.max(prev - 1, 15));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex-col bg-char border-b border-t border-smoke">
            <div className="w-full flex items-center justify-between px-4 py-2">
                <span className="text-smoke font-bebas tracking-wide w-24">CROWD ENERGY</span>
                <div className="flex-1 mx-4 h-3 bg-[#111] rounded-full overflow-hidden border border-smoke/50 relative shadow-inner">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-ember via-flame to-heat shadow-[0_0_15px_rgba(255,69,0,0.8)] transition-all duration-300 ease-out"
                        style={{ width: `${energy}%` }}
                    />
                    {/* Max Energy Marker */}
                    <div
                        className="absolute top-0 h-full w-[2px] bg-white opacity-20 shadow-[0_0_10px_white] transition-all duration-1000"
                        style={{ left: `${maxEnergy}%` }}
                    />
                </div>
                <div className="flex items-center gap-3 w-16 justify-end">
                    <span className="text-ember font-bebas tracking-wide text-xl">{energy}%</span>
                </div>
            </div>

            {isCompleted && (
                <div className="bg-ash/50 py-1 px-4 border-t border-smoke/30 flex justify-center items-center gap-2 animate-pulse">
                    <span className="text-[10px] font-black text-smoke uppercase tracking-tight">MATCH PEAK HEAT:</span>
                    <span className="text-ember font-bebas text-lg tracking-widest">{maxEnergy}% — 🔥 SCORCHING!</span>
                </div>
            )}
        </div>
    );
}
