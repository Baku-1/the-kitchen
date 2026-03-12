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
    const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
    const [rotation, setRotation] = useState(animated ? -90 : (score / 1000) * 180 - 90);

    useEffect(() => {
        if (animated) {
            const timeout = setTimeout(() => {
                setDisplayScore(score);
                setRotation((score / 1000) * 180 - 90);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [score, animated]);

    const tierColors = {
        legend: "#FF4500",
        established: "#FF8C00",
        rising: "#3B82F6",
        newcomer: "#666666",
    };

    const currentColor = tierColors[tier];

    if (compact) {
        return (
            <div className={cn("inline-flex flex-col items-center gap-1", className)} role="img" aria-label={`Clout score: ${score}`}>
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                        <circle
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke="#222"
                            strokeWidth="10"
                        />
                        <circle
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke={currentColor}
                            strokeWidth="10"
                            strokeDasharray="251.32"
                            strokeDashoffset={251.32 - (displayScore / 1000) * 251.32}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                            style={{ filter: displayScore > 500 ? `drop-shadow(0 0 3px ${currentColor})` : 'none' }}
                        />
                    </svg>
                    <span suppressHydrationWarning className="absolute inset-0 flex items-center justify-center text-[10px] font-bebas text-white-app tracking-tighter">
                        {displayScore || score}
                    </span>
                </div>
                <span className="text-[8px] font-barlow-condensed text-smoke uppercase tracking-widest font-black leading-none">{tier}</span>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col items-center gap-4", className)} role="img" aria-label={`Clout gauge: ${score} (${tier})`}>
            <div className="relative w-64 h-32 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#444" />
                            <stop offset="25%" stopColor="#3B82F6" />
                            <stop offset="50%" stopColor="#FF8C00" />
                            <stop offset="100%" stopColor="#FF4500" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <path
                        d="M 20 90 A 80 80 0 0 1 180 90"
                        fill="none"
                        stroke="#222"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />

                    <path
                        suppressHydrationWarning
                        d="M 20 90 A 80 80 0 0 1 180 90"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray="251.32"
                        strokeDashoffset={251.32 - (displayScore / 1000) * 251.32}
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: displayScore > 500 ? 'url(#glow)' : 'none' }}
                    />

                    <g style={{ transform: `translate(100px, 90px) rotate(${rotation}deg)`, transition: 'transform 1s ease-out' }}>
                        <path
                            d="M -2 0 L 0 -85 L 2 0 Z"
                            fill={currentColor}
                            style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}
                        />
                        <circle r="5" fill="#111" stroke={currentColor} strokeWidth="2" />
                    </g>
                </svg>

                <div className="absolute bottom-2 flex flex-col items-center">
                    <span suppressHydrationWarning className="text-4xl font-bebas text-white-app tracking-widest">{displayScore || score}</span>
                    <span className="text-[10px] font-barlow-condensed text-smoke uppercase tracking-[0.3em] font-black">{tier}</span>
                </div>
            </div>

            <div className="w-full flex justify-between px-2 text-[10px] font-bebas text-smoke/30 uppercase tracking-widest">
                <span>NEWCOMER</span>
                <span>LEGEND</span>
            </div>
        </div>
    );
}
