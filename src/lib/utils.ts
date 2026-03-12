import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type CloutTier = "newcomer" | "rising" | "established" | "legend";

export function getCloutTier(score: number): CloutTier {
    if (score <= 300) return "newcomer";
    if (score <= 600) return "rising";
    if (score <= 850) return "established";
    return "legend";
}

export function getTierColor(tier: CloutTier): string {
    switch (tier) {
        case "legend": return "#FF4500";
        case "established": return "#FFB347";
        case "rising": return "#3B82F6";
        case "newcomer": return "#888888";
    }
}
