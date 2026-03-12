"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendChallenge(data: {
    opponent_username: string;
    genre: string;
    title?: string;
}) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const supabase = createAdminClient();

    // 1. Get current user's DB ID
    const { data: currentUser, error: userError } = await supabase
        .from("users")
        .select("id, username")
        .eq("clerk_id", clerkId)
        .single();

    if (userError || !currentUser) throw new Error("Current user not found in database");

    // 2. Get opponent's DB ID
    const { data: opponent, error: oppError } = await supabase
        .from("users")
        .select("id")
        .eq("username", data.opponent_username)
        .single();

    if (oppError || !opponent) throw new Error("Opponent artist not found");

    if (currentUser.id === opponent.id) throw new Error("You cannot challenge yourself");

    // 3. Create the battle record
    // Status starts as 'pending'. scheduled_at is NULL (Chef sets it later)
    const { error: battleError } = await supabase
        .from("battles")
        .insert({
            artist_a_id: opponent.id, // Chef (Artist being challenged)
            artist_b_id: currentUser.id, // Challenger
            challenger_id: currentUser.id,
            genre: data.genre,
            title: data.title,
            status: "pending"
        });

    if (battleError) throw new Error("Failed to send challenge: " + battleError.message);

    // 4. Create notification for the Chef
    await supabase.from("notifications").insert({
        user_id: opponent.id,
        type: "challenge_received",
        title: "NEW CHALLENGE",
        body: `${currentUser.username} has challenged you to a battle in the kitchen!`,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/artists/${data.opponent_username}`);
    return { success: true };
}

export async function finalizeChallenge(data: {
    battleId: string;
    scheduledAt: string;
}) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const supabase = createAdminClient();

    // 1. Get current user's DB ID
    const { data: profile, error: userError } = await supabase
        .from("users")
        .select("id, username")
        .eq("clerk_id", clerkId)
        .single();

    if (userError || !profile) throw new Error("User not found");

    // 2. Fetch the battle to get the challenger's ID
    const { data: battle, error: battleFetchError } = await supabase
        .from("battles")
        .select("artist_b_id, title")
        .eq("id", data.battleId)
        .eq("artist_a_id", profile.id) // Must be the Chef
        .single();

    if (battleFetchError || !battle) throw new Error("Battle not found or you are not the Chef");

    // 3. Update the battle
    const { error: updateError } = await supabase
        .from("battles")
        .update({
            scheduled_at: data.scheduledAt,
            status: "accepted"
        })
        .eq("id", data.battleId);

    if (updateError) throw new Error("Failed to finalize battle: " + updateError.message);

    // 4. Notify the Challenger (artist_b)
    await supabase.from("notifications").insert({
        user_id: battle.artist_b_id,
        type: "battle_starting",
        title: "CHALLENGE ACCEPTED",
        body: `${profile.username} has set the time for your clash: ${new Date(data.scheduledAt).toLocaleString()}`,
        battle_id: data.battleId
    });

    revalidatePath("/dashboard");
    return { success: true };
}
