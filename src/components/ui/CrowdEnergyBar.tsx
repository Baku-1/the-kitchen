"use client";

import { useEffect, useState } from "react";

export default function CrowdEnergyBar({ battleId }: { battleId: string }) {
    const [energy, setEnergy] = useState(30);

    // Mocking real-time chat velocity changing the energy bar
    useEffect(() => {
        const interval = setInterval(() => {
            setEnergy(prev => {
                // Randomly fluctuate between 20% and 90%
                const jump = Math.floor(Math.random() * 20) - 10;
                return Math.min(Math.max(prev + jump, 10), 95);
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex items-center justify-between px-4 py-2 bg-char border-b border-t border-smoke">
            <span className="text-smoke font-bebas tracking-wide w-24">CROWD ENERGY</span>
            <div className="flex-1 mx-4 h-3 bg-[#111] rounded-full overflow-hidden border border-smoke/50 relative shadow-inner">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-ember via-flame to-heat shadow-[0_0_10px_rgba(255,69,0,0.8)] transition-all duration-1000 ease-in-out"
                    style={{ width: `${energy}%` }}
                />
            </div>
            <span className="text-ember font-bebas tracking-wide w-12 text-right">{energy}%</span>
        </div>
    );
}
