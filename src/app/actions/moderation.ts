"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { RoomServiceClient } from "livekit-server-sdk";
import { revalidatePath } from "next/cache";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS || "").split(",").map(s => s.trim()).filter(Boolean);

async function requireAdmin(): Promise<string> {
    const { userId } = await auth();
    if (!userId || !ADMIN_IDS.includes(userId)) {
        throw new Error("Unauthorized: admin access required");
    }
    return userId;
}

function getLiveKitClient(): RoomServiceClient {
    const url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    const key = process.env.LIVEKIT_API_KEY;
    const secret = process.env.LIVEKIT_API_SECRET;
    if (!url || !key || !secret) throw new Error("LiveKit credentials not configured");
    // RoomServiceClient wants an HTTP URL, not WSS
    const httpUrl = url.replace("wss://", "https://").replace("ws://", "http://");
    return new RoomServiceClient(httpUrl, key, secret);
}

// ─── Battle Status ───────────────────────────────────────────────

export async function setBattleStatus(battleId: string, status: string) {
    await requireAdmin();
    const supabase = createAdminClient();

    const validStatuses = ["pending", "accepted", "live", "voting", "completed", "cancelled"];
    if (!validStatuses.includes(status)) throw new Error(`Invalid status: ${status}`);

    const update: Record<string, any> = { status };
    // When going live, set the livekit_room_name to the battle ID
    if (status === "live") {
        update.livekit_room_name = battleId;
    }
    // When entering voting, set the voting window
    if (status === "voting") {
        update.voting_closes_at = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    }

    const { error } = await supabase
        .from("battles")
        .update(update)
        .eq("id", battleId);

    if (error) throw new Error("Failed to update battle status: " + error.message);

    revalidatePath(`/battles/${battleId}`);
    revalidatePath("/");
    return { success: true };
}

// ─── Artist Mute/Unmute ──────────────────────────────────────────

export async function muteArtist(battleId: string, username: string, muted: boolean) {
    await requireAdmin();
    const client = getLiveKitClient();

    const participants = await client.listParticipants(battleId);
    const target = participants.find(p => p.identity === username);
    if (!target) throw new Error(`Participant ${username} not found in room`);

    // Mute all audio tracks
    for (const track of target.tracks) {
        if (track.source === 1 /* MICROPHONE */ || track.source === 3 /* SCREEN_SHARE_AUDIO */) {
            await client.mutePublishedTrack(battleId, target.identity, track.sid, muted);
        }
    }

    return { success: true, muted };
}

// ─── Remove Artist from Room ─────────────────────────────────────

export async function removeArtistFromRoom(battleId: string, username: string) {
    await requireAdmin();
    const client = getLiveKitClient();
    await client.removeParticipant(battleId, username);
    return { success: true };
}

// ─── Chat Moderation ─────────────────────────────────────────────

export async function deleteChatMessage(messageId: string) {
    await requireAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("chat_messages")
        .update({ is_flagged: true })
        .eq("id", messageId);

    if (error) throw new Error("Failed to flag message: " + error.message);
    return { success: true };
}

export async function banUserFromChat(battleId: string, targetUserId: string, reason: string) {
    const clerkId = await requireAdmin();
    const supabase = createAdminClient();

    // Get admin's supabase ID for the banned_by column
    const { data: adminProfile } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

    const { error } = await supabase
        .from("chat_bans")
        .insert({
            battle_id: battleId,
            user_id: targetUserId,
            reason,
            banned_by: adminProfile?.id,
        });

    if (error) {
        if (error.code === "23505") return { success: true, message: "Already banned" };
        throw new Error("Failed to ban user: " + error.message);
    }

    return { success: true };
}

export async function unbanUserFromChat(battleId: string, targetUserId: string) {
    await requireAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("chat_bans")
        .delete()
        .eq("battle_id", battleId)
        .eq("user_id", targetUserId);

    if (error) throw new Error("Failed to unban user: " + error.message);
    return { success: true };
}
