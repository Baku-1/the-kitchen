"use client";

import {
    RoomAudioRenderer,
    useTracks,
    VideoTrack,
    isTrackReference
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

interface LiveStreamProps {
    battleId: string;
    artistAUsername: string;
    artistBUsername: string;
}

export default function LiveStream({ artistAUsername, artistBUsername }: LiveStreamProps) {
    // Find Camera tracks
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: false },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    // Identify tracks by participant identity (username)
    const trackA = tracks.find(t => t.participant.identity === artistAUsername);
    const trackB = tracks.find(t => t.participant.identity === artistBUsername);

    return (
        <>
        <div className="w-full h-full flex flex-col md:flex-row bg-black">
            {/* Artist A Side */}
            <div className="flex-1 relative border-b md:border-b-0 md:border-r border-smoke">
                {trackA && isTrackReference(trackA) ? (
                    <VideoTrack trackRef={trackA} className="object-cover w-full h-full" />
                ) : (
                    <div className="absolute inset-0 bg-ash flex items-center justify-center overflow-hidden">
                        <span className="text-sm font-barlow text-smoke tracking-widest uppercase">WAITING FOR {artistAUsername}</span>
                    </div>
                )}
            </div>

            {/* Artist B Side */}
            <div className="flex-1 relative">
                {trackB && isTrackReference(trackB) ? (
                    <VideoTrack trackRef={trackB} className="object-cover w-full h-full" />
                ) : (
                    <div className="absolute inset-0 bg-ash flex items-center justify-center overflow-hidden">
                        <span className="text-sm font-barlow text-smoke tracking-widest uppercase">WAITING FOR {artistBUsername}</span>
                    </div>
                )}
            </div>
        </div>
        <RoomAudioRenderer />
        </>
    );
}

