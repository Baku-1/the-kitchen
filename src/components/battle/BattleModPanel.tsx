"use client";

import { useState } from "react";
import {
    ShieldAlert, Play, Square, VolumeX, Volume2,
    Trash2, Ban, UserX, AlertTriangle
} from "lucide-react";
import {
    setBattleStatus, muteArtist, removeArtistFromRoom,
    deleteChatMessage, banUserFromChat
} from "@/app/actions/moderation";

interface BattleModPanelProps {
    battleId: string;
    battleStatus: string;
    artistA: { id: string; username: string; display_name: string };
    artistB: { id: string; username: string; display_name: string };
    chatMessages: Array<{ id: string; message: string; user?: { username: string; id?: string }; user_id: string; is_flagged: boolean }>;
}

export default function BattleModPanel({ battleId, battleStatus, artistA, artistB, chatMessages }: BattleModPanelProps) {
    const [status, setStatus] = useState(battleStatus);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [mutedA, setMutedA] = useState(false);
    const [mutedB, setMutedB] = useState(false);

    const act = async (key: string, fn: () => Promise<any>) => {
        setLoading(key);
        setError(null);
        try {
            await fn();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(null);
        }
    };

    const handleStatus = (newStatus: string) => act(`status_${newStatus}`, async () => {
        await setBattleStatus(battleId, newStatus);
        setStatus(newStatus);
    });

    const handleMute = (username: string, isMuted: boolean, side: "a" | "b") =>
        act(`mute_${side}`, async () => {
            await muteArtist(battleId, username, !isMuted);
            if (side === "a") setMutedA(!isMuted);
            else setMutedB(!isMuted);
        });

    const handleKick = (username: string) => act(`kick_${username}`, () =>
        removeArtistFromRoom(battleId, username)
    );

    const handleDeleteMsg = (msgId: string) => act(`del_${msgId}`, () =>
        deleteChatMessage(msgId)
    );

    const handleBan = (userId: string, username: string) => act(`ban_${username}`, () =>
        banUserFromChat(battleId, userId, "Offensive conduct — banned by moderator")
    );

    const statusActions = [
        { label: "GO LIVE", target: "live", icon: Play, color: "bg-red-600 hover:bg-red-500", show: status === "accepted" },
        { label: "OPEN VOTING", target: "voting", icon: Square, color: "bg-amber-600 hover:bg-amber-500", show: status === "live" },
        { label: "END BATTLE", target: "completed", icon: Square, color: "bg-smoke/50 hover:bg-smoke/40", show: status === "voting" },
        { label: "CANCEL", target: "cancelled", icon: AlertTriangle, color: "bg-flame/50 hover:bg-flame/40", show: status !== "completed" && status !== "cancelled" },
    ].filter(a => a.show);

    return (
        <div className="w-full bg-black border-b-2 border-red-600 z-50 relative">
            <div className="max-w-7xl mx-auto px-4 py-3">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Moderator Controls</span>
                    <span className="ml-auto text-[10px] text-smoke uppercase tracking-widest font-bold">
                        STATUS: <span className="text-white-app">{status.toUpperCase()}</span>
                    </span>
                </div>

                {error && (
                    <div className="mb-3 p-2 bg-flame/20 border border-flame text-flame text-xs font-bold uppercase tracking-tight flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Battle Controls */}
                    <div className="flex flex-wrap gap-2">
                        {statusActions.map(a => (
                            <button
                                key={a.target}
                                disabled={loading !== null}
                                onClick={() => handleStatus(a.target)}
                                className={`px-4 py-2 ${a.color} text-white-app font-bebas tracking-widest text-sm flex items-center gap-2 clip-angled disabled:opacity-30 transition-all`}
                            >
                                {loading === `status_${a.target}` ? "..." : <><a.icon className="w-4 h-4" /> {a.label}</>}
                            </button>
                        ))}
                    </div>

                    {/* Artist Controls */}
                    <div className="flex gap-3">
                        {[
                            { artist: artistA, muted: mutedA, side: "a" as const },
                            { artist: artistB, muted: mutedB, side: "b" as const },
                        ].map(({ artist, muted, side }) => (
                            <div key={side} className="flex-1 bg-char/50 border border-smoke/30 p-2 flex items-center gap-2">
                                <span className="text-xs font-bebas text-white-app tracking-wide truncate flex-1">@{artist.username}</span>
                                <button
                                    disabled={loading !== null || status !== "live"}
                                    onClick={() => handleMute(artist.username, muted, side)}
                                    className={`p-1.5 ${muted ? "bg-red-600 text-white-app" : "bg-ash text-smoke hover:text-white-app"} transition-all disabled:opacity-30`}
                                    title={muted ? "Unmute" : "Mute"}
                                >
                                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                                <button
                                    disabled={loading !== null || status !== "live"}
                                    onClick={() => handleKick(artist.username)}
                                    className="p-1.5 bg-ash text-smoke hover:text-flame transition-all disabled:opacity-30"
                                    title="Remove from room"
                                >
                                    <UserX className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Quick Chat Mod */}
                    <div className="max-h-24 overflow-y-auto bg-char/30 border border-smoke/20 p-2 space-y-1 scrollbar-thin scrollbar-thumb-smoke/20">
                        {chatMessages.filter(m => !m.is_flagged).slice(-10).map(m => (
                            <div key={m.id} className="flex items-center gap-2 text-[10px]">
                                <span className="text-smoke font-bold truncate max-w-[80px]">{m.user?.username || "anon"}</span>
                                <span className="text-smoke/60 truncate flex-1">{m.message}</span>
                                <button
                                    onClick={() => handleDeleteMsg(m.id)}
                                    disabled={loading !== null}
                                    className="text-smoke/30 hover:text-flame transition-colors shrink-0 disabled:opacity-30"
                                    title="Delete message"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => handleBan(m.user_id, m.user?.username || "user")}
                                    disabled={loading !== null}
                                    className="text-smoke/30 hover:text-red-500 transition-colors shrink-0 disabled:opacity-30"
                                    title="Ban user from chat"
                                >
                                    <Ban className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {chatMessages.filter(m => !m.is_flagged).length === 0 && (
                            <span className="text-smoke/30 text-[10px] italic">No messages yet</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
