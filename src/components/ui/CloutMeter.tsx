"use client";

import { useEffect, useState } from "react";
import { cn, CloutTier } from "@/lib/utils";

interface CloutMeterProps {
    score: number;
    tier: CloutTier;
    animated?: boolean;
    className?: string;
}

export default function CloutMeter({ score, tier, animated = true, className }: CloutMeterProps) {
    const [fillWidth, setFillWidth] = useState(animated ? 0 : Math.min(Math.max(score, 0), 1000) / 10);

    useEffect(() => {
        if (animated) {
            // Small delay to ensure the browser paints the 0% state first before animating
            const timer = setTimeout(() => {
                setFillWidth(Math.min(Math.max(score, 0), 1000) / 10);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [score, animated]);

    // Determine gradient based on tier
    const gradients = {
        legend: "linear-gradient(90deg, #FF2200, #FF4500, #FF8C00)",
        established: "linear-gradient(90deg, #CC6600, #FF8C00, #FFB347)",
        rising: "linear-gradient(90deg, #1D4ED8, #3B82F6, #60A5FA)",
        newcomer: "linear-gradient(90deg, #444444, #666666, #888888)",
    };

    const glows = {
        legend: "0 0 15px rgba(255, 69, 0, 0.5)",
        established: "0 0 15px rgba(255, 179, 71, 0.5)",
        rising: "0 0 15px rgba(59, 130, 246, 0.5)",
        newcomer: "0 0 10px rgba(136, 136, 136, 0.3)",
    };

    return (
        <div className={cn("w-full flex flex-col gap-2 font-barlow", className)}>
            <div className="relative w-full h-4 bg-[#111] rounded overflow-hidden shadow-inner border border-smoke">
                {/* Tick marks every 10% */}
                <div className="absolute inset-0 flex justify-between px-[10%] opacity-20 pointer-events-none">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-[1px] h-full bg-white" />
                    ))}
                </div>

                {/* The Fill */}
                <div
                    className="absolute top-0 left-0 h-full flex justify-end"
                    style={{
                        width: `${fillWidth}%`,
                        background: gradients[tier],
                        boxShadow: glows[tier],
                        transition: animated ? 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
                    }}
                >
                    {/* Leading edge bright sliver */}
                    <div className="w-1 h-full bg-white opacity-80 mix-blend-overlay"></div>
                </div>
            </div>
            <div className="flex justify-between items-center text-xs tracking-widest uppercase font-bold text-smoke">
                <span>{tier}</span>
                <span className="text-white-app">{score} <span className="text-smoke">/ 1000 CLOUT</span></span>
            </div>
        </div>
    );
}
