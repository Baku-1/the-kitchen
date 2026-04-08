"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";

export default function BattleArenaWrapper({ battleId, children }: { battleId: string, children: React.ReactNode }) {
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(`/api/livekit?room=${battleId}`);
                const data = await resp.json();
                if (data.token) {
                    setToken(data.token);
                }
            } catch (e) {
                console.error("Failed to fetch LiveKit token", e);
            }
        })();
    }, [battleId]);

    if (!token) {
        return (
            <div className="flex-1 w-full bg-black min-h-[calc(100vh-64px)] flex flex-col items-center justify-center font-bebas text-smoke text-2xl tracking-widest animate-pulse">
                INITIALIZING BATTLE NETWORK...
            </div>
        );
    }

    return (
        <LiveKitRoom
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            connect={true}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
        >
            {children}
        </LiveKitRoom>
    );
}
