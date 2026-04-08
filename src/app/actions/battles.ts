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

export async function acceptAdminBattle(battleId: string) {
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

    // 2. Fetch the battle
    const { data: battle, error: battleFetchError } = await supabase
        .from("battles")
        .select("*")
        .eq("id", battleId)
        .single();

    if (battleFetchError || !battle) throw new Error("Battle not found");
    if (!battle.is_admin_scheduled) throw new Error("This is not an admin scheduled battle");

    const isArtistA = battle.artist_a_id === profile.id;
    const isArtistB = battle.artist_b_id === profile.id;

    if (!isArtistA && !isArtistB) throw new Error("You are not participating in this battle");

    // 3. Mark the user as having accepted
    const updateData: Record<string, any> = {};
    if (isArtistA) updateData.artist_a_accepted = true;
    if (isArtistB) updateData.artist_b_accepted = true;

    // Check if both have now accepted
    const bothAccepted = 
        (isArtistA || battle.artist_a_accepted) && 
        (isArtistB || battle.artist_b_accepted);

    if (bothAccepted) {
        updateData.status = "accepted";
    }

    const { error: updateError } = await supabase
        .from("battles")
        .update(updateData)
        .eq("id", battleId);

    if (updateError) throw new Error("Failed to accept battle: " + updateError.message);

    // 4. Mark "admin_booking" notification for this battle as read
    await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", profile.id)
        .eq("battle_id", battleId)
        .eq("type", "admin_booking");

    revalidatePath("/dashboard");
    revalidatePath("/");
    
    return { success: true, bothAccepted };
}

export async function castVote(battleId: string, artistId: string) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Log in to vote 🔥");

    const supabase = createAdminClient();

    // 1. Get current user's DB ID
    const { data: profile, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

    if (userError || !profile) throw new Error("Profile not found");

    // 2. Insert the vote
    // The UNIQUE(battle_id, voter_id) constraint in DB handles double voting
    const { error: voteError } = await supabase
        .from("votes")
        .insert({
            battle_id: battleId,
            voter_id: profile.id,
            voted_for_id: artistId
        });

    if (voteError) {
        if (voteError.code === '23505') throw new Error("You already voted on this battle.");
        throw new Error("Failed to cast vote: " + voteError.message);
    }

    revalidatePath(`/battles/${battleId}`);
    return { success: true };
}

export async function sendChatMessage(battleId: string, message: string) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Log in to join the trenches 🔥");

    const supabase = createAdminClient();

    const { data: profile, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

    if (userError || !profile) throw new Error("Profile not found");

    // Check if user is banned from this battle's chat
    const { data: ban } = await supabase
        .from("chat_bans")
        .select("id")
        .eq("battle_id", battleId)
        .eq("user_id", profile.id)
        .single();

    if (ban) throw new Error("You have been banned from this chat by a moderator.");

    const { error } = await supabase
        .from("chat_messages")
        .insert({
            battle_id: battleId,
            user_id: profile.id,
            message: message.trim()
        });

    if (error) throw new Error("Failed to send heat: " + error.message);

    revalidatePath(`/battles/${battleId}`);
    return { success: true };
}

export async function finishVoting(battleId: string) {
    const supabase = createAdminClient();
    await supabase.from("battles").update({ status: "completed" }).eq("id", battleId);
    return declareWinner(battleId);
}

export async function declareWinner(battleId: string) {
    const supabase = createAdminClient();

    // 1. Fetch battle and vote counts
    const { data: battle, error: battleError } = await supabase
        .from("battles")
        .select("*, artist_a:artist_a_id(*), artist_b:artist_b_id(*)")
        .eq("id", battleId)
        .single();

    if (battleError || !battle) throw new Error("Battle not found");

    // 2. Tally votes from the votes table
    const { count: countA } = await supabase
        .from("votes")
        .select("*", { count: 'exact', head: true })
        .eq("battle_id", battleId)
        .eq("voted_for_id", battle.artist_a_id);

    const { count: countB } = await supabase
        .from("votes")
        .select("*", { count: 'exact', head: true })
        .eq("battle_id", battleId)
        .eq("voted_for_id", battle.artist_b_id);

    const finalCountA = countA || 0;
    const finalCountB = countB || 0;

    let winnerId = null;
    let loserId = null;

    if (finalCountA > finalCountB) {
        winnerId = battle.artist_a_id;
        loserId = battle.artist_b_id;
    } else if (finalCountB > finalCountA) {
        winnerId = battle.artist_b_id;
        loserId = battle.artist_a_id;
    }

    // 3. Update Battle
    await supabase
        .from("battles")
        .update({
            status: "completed",
            winner_id: winnerId,
            vote_count_a: finalCountA,
            vote_count_b: finalCountB
        })
        .eq("id", battleId);

    // 4. Update Users Stats & Clout
    if (winnerId && loserId) {
        const winner = battle.artist_a_id === winnerId ? battle.artist_a : battle.artist_b;
        const loser = battle.artist_a_id === loserId ? battle.artist_a : battle.artist_b;

        // Winner +50 Clout
        await supabase.from("users").update({
            wins: (winner.wins || 0) + 1,
            clout_score: (winner.clout_score || 0) + 50
        }).eq("id", winnerId);

        // Loser -20 Clout
        await supabase.from("users").update({
            losses: (loser.losses || 0) + 1,
            clout_score: Math.max((loser.clout_score || 0) - 20, 0)
        }).eq("id", loserId);

        // Add history
        await supabase.from("clout_history").insert([
            { user_id: winnerId, delta: 50, reason: 'win', battle_id: battleId },
            { user_id: loserId, delta: -20, reason: 'loss', battle_id: battleId }
        ]);
    }

    revalidatePath(`/battles/${battleId}`);
    revalidatePath("/leaderboard");
    revalidatePath("/dashboard");
    return { success: true, winnerId };
}
