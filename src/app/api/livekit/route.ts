import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const room = req.nextUrl.searchParams.get("room");
        if (!room) {
            return NextResponse.json({ error: "Missing room parameter" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Get user details
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("username, display_name")
            .eq("clerk_id", userId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify battle exists and user is either a participant or viewer
        const { data: battle, error: battleError } = await (supabase
            .from("battles")
            .select("id, artist_a_id, artist_b_id, status")
            .eq("id", room)
            .single() as any);

        if (battleError || !battle) {
            return NextResponse.json({ error: "Battle not found" }, { status: 404 });
        }

        // Determine participant permissions — compare Supabase UUIDs, not Clerk IDs
        const { data: profile } = await supabase
            .from("users")
            .select("id")
            .eq("clerk_id", userId)
            .single();

        const supabaseUserId = profile?.id;
        const isArtistA = battle.artist_a_id === supabaseUserId;
        const isArtistB = battle.artist_b_id === supabaseUserId;
        const isParticipant = isArtistA || isArtistB;

        // If not participant and not live, don't allow viewing
        if (!isParticipant && battle.status !== "live") {
            return NextResponse.json({ error: "Battle is not live yet" }, { status: 403 });
        }

        const API_KEY = process.env.LIVEKIT_API_KEY;
        const API_SECRET = process.env.LIVEKIT_API_SECRET;

        if (!API_KEY || !API_SECRET) {
            throw new Error("LiveKit API credentials missing");
        }

        const at = new AccessToken(API_KEY, API_SECRET, {
            identity: user.username,
            name: user.display_name,
        });

        at.addGrant({
            roomJoin: true,
            room,
            canPublish: isParticipant, // Only battling artists can publish audio/video
            canPublishData: true,      // Allow chat messages over data channel
            canSubscribe: true,        // Everyone can watch
        });

        return NextResponse.json({ token: await at.toJwt() });
    } catch (error: any) {
        console.error("Error generating LiveKit token:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
