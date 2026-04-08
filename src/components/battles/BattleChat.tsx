"use client";

import { useState, useEffect, useRef } from "react";
import { Info } from "lucide-react";
import { useDataChannel } from "@livekit/components-react";
import { useUser } from "@clerk/nextjs";
import { ChatMessage } from "@/types";

interface BattleChatProps {
    initialMessages?: ChatMessage[];
    isLocked: boolean;
}

export default function BattleChat({ initialMessages, isLocked }: BattleChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages || []);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();

    // Subscribe to LiveKit Data Channel for pure UDP distribution, handling payload natively via callback
    const { send } = useDataChannel("chat", (msg) => {
        try {
            const payloadStr = new TextDecoder().decode(msg.payload);
            const parsed = JSON.parse(payloadStr);
            setMessages(prev => [...prev, parsed]);
        } catch(e) {
            console.error("Failed to parse chat packet", e);
        }
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLocked) return;

        const username = user?.username || user?.firstName || "Spectator";
        
        // Construct ultra-light ephemeral payload
        const packet = JSON.stringify({
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            message: input,
            user: { username }
        });

        try {
            const encoder = new TextEncoder();
            send(encoder.encode(packet), { reliable: true });
            // Optimistic update for sender
            setMessages(prev => [...prev, JSON.parse(packet)]);
            setInput("");
        } catch (err) {
            console.error("Data channel send failed", err);
        }
    };

    return (
        <div className="w-full lg:w-96 border-l border-smoke bg-ash flex flex-col h-[50vh] lg:h-auto z-50">
            <div className="p-4 border-b border-smoke bg-char flex items-center justify-between">
                <span className="font-bebas text-2xl text-white-app tracking-widest uppercase italic">The Trenches</span>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-ember animate-ping"></div>
                    <span className="text-[10px] text-smoke font-black uppercase tracking-widest">Live Flow</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 font-barlow text-sm scrollbar-thin scrollbar-thumb-smoke/20"
            >
                {isLocked ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                        <Info className="w-12 h-12 mb-4" />
                        <p className="font-bebas text-2xl tracking-widest">Chat Locked</p>
                        <p className="text-[10px] uppercase font-bold tracking-widest">Opens when the heat rises</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-char/40 p-3 border-l-2 border-ember">
                            <span className="font-black text-ember text-[10px] block mb-1 uppercase tracking-tighter">System Alert</span>
                            <p className="text-smoke italic text-xs">Battle is live. No gang references. No personal threats. Spitting bars only.</p>
                        </div>
                        {messages.map((m, i) => (
                            <div key={m.id || i} className="flex flex-col gap-1 animate-fade-in">
                                <span className="font-black text-heat text-[10px] uppercase">{m.user?.username || "Voter"}</span>
                                {m.is_flagged ? (
                                    <p className="text-smoke/30 italic text-xs">[Removed by moderator]</p>
                                ) : (
                                    <p className="text-smoke">{m.message}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-smoke bg-char">
                <form onSubmit={handleSend} className="flex gap-2 items-center">
                    <div className="flex-1 text-smoke font-barlow bg-ash/50 border border-smoke p-1 relative overflow-hidden group focus-within:border-ember transition-all">
                        <input
                            type="text"
                            disabled={isLocked}
                            placeholder={isLocked ? "LOCKED" : "SEND HEAT..."}
                            className="w-full bg-transparent p-4 outline-none font-bold placeholder:text-smoke/30 italic uppercase text-xs"
                            maxLength={100}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLocked || !input.trim()}
                        className="px-6 py-4 bg-ember hover:bg-flame disabled:bg-smoke/20 text-white-app font-bebas text-xl tracking-widest transition-all clip-angled flex items-center gap-2"
                    >
                        {isLocked ? "..." : "DROP HEAT"}
                    </button>
                </form>
            </div>
        </div>
    );
}
