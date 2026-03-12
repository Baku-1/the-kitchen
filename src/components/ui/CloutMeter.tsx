"use client";

import { useEffect, useState } from "react";
import { cn, CloutTier } from "@/lib/utils";

interface CloutMeterProps {
    score: number;
    tier: CloutTier;
    animated?: boolean;
    className?: string;
    compact?: boolean;
}

export default function CloutMeter({ score, tier, animated = true, className, compact = false }: CloutMeterProps) {
    const [fillWidth, setFillWidth] = useState(animated ? 0 : Math.min(Math.max(score, 0), 1000) / 10);

    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => {
                setFillWidth(Math.min(Math.max(score, 0), 1000) / 10);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [score, animated]);

    const gradients = {
        legend: "linear-gradient(90deg, #FF2200, #FF4500, #FF8C00)",
        established: "linear-gradient(90deg, #CC6600, #FF8C00, #FFB347)",
        rising: "linear-gradient(90deg, #1D4ED8, #3B82F6, #60A5FA)",
        newcomer: "linear-gradient(90deg, #444444, #666666, #888888)",
    };

    const glows = {
        legend: "0 0 12px rgba(255, 69, 0, 0.6)",
        established: "0 0 12px rgba(255, 140, 0, 0.4)",
        rising: "0 0 12px rgba(59, 130, 246, 0.4)",
        newcomer: "none",
    };

    return (
        <div className={cn("w-full flex flex-col gap-2 font-barlow", className)}>
            <div className={cn(
                "relative w-full bg-[#111] rounded-[2px] overflow-hidden border border-[#222]",
                compact ? "h-3" : "h-[20px]"
            )}>
                {/* Tick marks every 10% */}
                <div className="absolute inset-0 flex justify-between px-[10%] opacity-30 pointer-events-none">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-[1px] h-full bg-[#333]" />
                    ))}
                </div>

                {/* The Fill */}
                <div
                    className="absolute top-0 left-0 h-full flex justify-end transition-all"
                    style={{
                        width: `${fillWidth}%`,
                        background: gradients[tier],
                        boxShadow: glows[tier],
                        transition: animated ? 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
                    }}
                >
                    {/* Leading edge bright sliver */}
                    <div className="w-[2px] h-full bg-white opacity-60 shadow-[0_0_8px_white]"></div>
                </div>
            </div>
            <div className="flex justify-between items-center text-xs tracking-widest uppercase font-bold text-smoke">
                <span className="text-white-app font-bebas text-lg tracking-normal">{score}</span>
                <span className="text-smoke">/ 1000 CLOUT</span>
            </div>
        </div>
    );
}
