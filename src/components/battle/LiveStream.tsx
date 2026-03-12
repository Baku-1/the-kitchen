"use client";

import { useEffect, useState } from "react";
import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    useTracks,
    VideoTrack,
    isTrackReference
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { cn } from "@/lib/utils";

interface LiveStreamProps {
    battleId: string;
    artistAUsername: string;
    artistBUsername: string;
}

export default function LiveStream({ battleId, artistAUsername, artistBUsername }: LiveStreamProps) {
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

    if (token === "") {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-char text-smoke font-barlow">
                <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin mb-4" />
                Connecting to the arena...
            </div>
        );
    }

    return (
        <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
            style={{ height: '100%', width: '100%', display: 'flex' }}
        >
            <SplitScreenLayout artistA={artistAUsername} artistB={artistBUsername} />
            <RoomAudioRenderer />
        </LiveKitRoom>
    );
}

function SplitScreenLayout({ artistA, artistB }: { artistA: string, artistB: string }) {
    // Find Camera tracks
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: false },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    // Identify tracks by participant identity (username)
    const trackA = tracks.find(t => t.participant.identity === artistA);
    const trackB = tracks.find(t => t.participant.identity === artistB);

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-black">
            {/* Artist A Side */}
            <div className="flex-1 relative border-b md:border-b-0 md:border-r border-smoke">
                {trackA && isTrackReference(trackA) ? (
                    <VideoTrack trackRef={trackA} className="object-cover w-full h-full" />
                ) : (
                    <div className="absolute inset-0 bg-ash flex items-center justify-center overflow-hidden">
                        <span className="text-sm font-barlow text-smoke tracking-widest uppercase">WAITING FOR {artistA}</span>
                    </div>
                )}
            </div>

            {/* Artist B Side */}
            <div className="flex-1 relative">
                {trackB && isTrackReference(trackB) ? (
                    <VideoTrack trackRef={trackB} className="object-cover w-full h-full" />
                ) : (
                    <div className="absolute inset-0 bg-ash flex items-center justify-center overflow-hidden">
                        <span className="text-sm font-barlow text-smoke tracking-widest uppercase">WAITING FOR {artistB}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
