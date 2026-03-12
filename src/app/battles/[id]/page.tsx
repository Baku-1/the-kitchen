import Link from "next/link";
import { Users, Info, Flag } from "lucide-react";
import VoteUI from "@/components/ui/VoteUI";
import CrowdEnergyBar from "@/components/ui/CrowdEnergyBar";
import { getCloutTier } from "@/lib/utils";

// In a real app we would use @livekit/components-react to render tracks
// e.g. <LiveKitRoom><VideoTrack /></LiveKitRoom>

export default async function BattlePage({ params, searchParams }: { params: { id: string }, searchParams: { state?: string } }) {
    const { id } = await params;

    // Use a query parameter ?state=upcoming|live|voting|completed to see different states for demo
    const state = searchParams.state || "live";

    const artistA = { id: "a1", name: "FlowKing", city: "Detroit", clout_score: 520, record: "9-5", avatar: "F" };
    const artistB = { id: "b1", name: "Mad Mic", city: "NYC", clout_score: 480, record: "7-7", avatar: "M" };

    return (
        <div className="flex-1 flex flex-col w-full bg-char overflow-hidden">

            {/* Header */}
            <div className="w-full bg-ash border-b border-smoke p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-char border border-smoke text-xs font-barlow-condensed tracking-widest text-smoke uppercase">Written</span>
                    <h1 className="text-xl font-bebas text-white-app tracking-wide">{artistA.name} VS {artistB.name}</h1>
                </div>
                <div className="flex items-center gap-4">
                    {state === "live" && (
                        <div className="flex items-center gap-2 text-ember font-barlow-condensed tracking-widest">
                            <span className="w-2 h-2 bg-ember rounded-full animate-pulse"></span>
                            LIVE
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-smoke font-barlow text-sm">
                        <Users className="w-4 h-4" /> 1,240
                    </div>
                    <button className="text-smoke hover:text-white-app">
                        <Flag className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {state === "live" && <CrowdEnergyBar battleId={id} />}

            <div className="flex-1 flex flex-col lg:flex-row h-full">
                {/* Main Stage (Left Content) */}
                <div className="flex-1 flex flex-col items-center bg-black relative">

                    {state === "upcoming" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8">
                            <h2 className="text-7xl font-bebas text-white-app mb-4 text-center">BATTLE STARTS IN</h2>
                            <div className="text-9xl font-bebas text-ember drop-shadow-2xl mb-12 tabular-nums">04:15:30</div>
                            <div className="flex gap-6 w-full max-w-2xl text-center">
                                <div className="flex-1 bg-ash border border-smoke p-6">
                                    <h3 className="text-4xl font-bebas text-white-app mb-2">{artistA.name}</h3>
                                    <p className="text-smoke font-barlow">{artistA.city}</p>
                                </div>
                                <div className="flex items-center justify-center text-4xl font-bebas text-smoke">VS</div>
                                <div className="flex-1 bg-ash border border-smoke p-6">
                                    <h3 className="text-4xl font-bebas text-white-app mb-2">{artistB.name}</h3>
                                    <p className="text-smoke font-barlow">{artistB.city}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {state === "voting" && (
                        <div className="absolute inset-0 bg-char/90 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                            <VoteUI battleId={id} artistA={artistA} artistB={artistB} endTime={new Date(Date.now() + 2 * 60 * 60 * 1000)} />
                        </div>
                    )}

                    {state === "completed" && (
                        <div className="absolute inset-0 bg-char/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 animate-fade-in">
                            <div className="text-center mb-8">
                                <h2 className="text-8xl font-bebas text-ember mb-2 drop-shadow-[0_0_20px_rgba(255,69,0,0.5)]">FLOWKING WINS</h2>
                                <p className="text-xl text-white-app font-barlow-condensed tracking-widest uppercase">The vote is final: 68% to 32%</p>
                            </div>
                            <div className="flex gap-8">
                                <Link href={`/artists/${artistA.name}`} className="px-6 py-3 bg-ember text-white-app font-bebas text-xl clip-angled">View Winner Profile</Link>
                                <Link href={`/artists/${artistB.name}`} className="px-6 py-3 bg-char border border-smoke hover:border-ember text-white-app font-bebas text-xl clip-angled">View Loser Profile</Link>
                            </div>
                        </div>
                    )}

                    {/* Video Streams (Mocked for now without actual LiveKit token logic) */}
                    <div className="w-full h-full flex flex-col md:flex-row">
                        <div className="flex-1 relative border-r border-smoke">
                            {/* Video A Placeholder */}
                            <div className="absolute inset-0 bg-ash flex items-center justify-center overflow-hidden">
                                <div className="text-[20rem] font-bebas text-smoke/10 pointer-events-none select-none">{artistA.avatar}</div>
                            </div>
                            <div className="absolute bottom-4 left-4 px-4 py-2 bg-char/80 backdrop-blur border border-smoke flex flex-col">
                                <span className="font-bebas text-2xl text-white-app tracking-wide">{artistA.name}</span>
                                <span className="font-barlow-condensed text-smoke text-sm uppercase tracking-widest">{artistA.record} &bull; {artistA.clout_score} CLOUT</span>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            {/* Video B Placeholder */}
                            <div className="absolute inset-0 bg-ash flex items-center justify-center overflow-hidden">
                                <div className="text-[20rem] font-bebas text-smoke/10 pointer-events-none select-none">{artistB.avatar}</div>
                            </div>
                            <div className="absolute bottom-4 right-4 text-right px-4 py-2 bg-char/80 backdrop-blur border border-smoke flex flex-col">
                                <span className="font-bebas text-2xl text-white-app tracking-wide">{artistB.name}</span>
                                <span className="font-barlow-condensed text-smoke text-sm uppercase tracking-widest">{artistB.record} &bull; {artistB.clout_score} CLOUT</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Chat */}
                <div className="w-full lg:w-80 border-l border-smoke bg-ash flex flex-col h-[50vh] lg:h-auto">
                    <div className="p-4 border-b border-smoke bg-char flex items-center justify-between">
                        <span className="font-bebas text-xl text-white-app tracking-wide">THE TRENCHES</span>
                        <span className="text-xs text-smoke font-barlow uppercase"><span className="text-ember">&bull;</span> Live Chat</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 font-barlow text-sm">
                        <div className="flex gap-2">
                            <span className="font-bold text-ember">nycBoy:</span>
                            <span className="text-smoke">mad mic bout to catch a body</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold text-heat">DetroitKing:</span>
                            <span className="text-smoke">flowking 3-0 easily</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold text-smoke">admin:</span>
                            <span className="text-ember font-bold">BATTLE STARTING IN 5 MINUTES.</span>
                        </div>
                    </div>
                    <div className="p-4 border-t border-smoke bg-char">
                        <div className="flex text-smoke font-barlow bg-ash border border-smoke relative">
                            <input
                                type="text"
                                disabled={state !== "live"}
                                placeholder={state !== "live" ? "Chat is locked" : "Send a message..."}
                                className="w-full bg-transparent p-3 outline-none focus:border-ember disabled:opacity-50"
                                maxLength={100}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
