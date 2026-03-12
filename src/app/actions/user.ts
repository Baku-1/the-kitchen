"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function acceptTOS() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const supabase = createAdminClient();

    const { error } = await supabase
        .from("users")
        .update({
            tos_accepted_at: new Date().toISOString(),
            tos_version: "1.0"
        })
        .eq("clerk_id", userId);

    if (error) throw new Error("Failed to accept TOS");

    revalidatePath("/onboarding");
    return { success: true };
}

export async function updateProfile(data: {
    username: string;
    display_name: string;
    city: string;
    country: string;
    genre: string;
    bio: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const supabase = createAdminClient();

    const { error } = await supabase
        .from("users")
        .update(data)
        .eq("clerk_id", userId);

    if (error) throw new Error("Failed to update profile: " + error.message);

    revalidatePath("/");
    return { success: true };
}

export async function getUserProfile() {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = createAdminClient();

    // 1. Try to get user from Supabase
    let { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", userId)
        .single();

    // 2. If user doesn't exist, sync from Clerk JIT (Just-In-Time)
    if (error && (error.code === 'PGRST116' || !profile)) {
        const clerkUser = await currentUser();
        if (!clerkUser) return null;

        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const initialUsername = clerkUser.username || email?.split('@')[0] || `user_${userId.slice(-6)}`;

        const { data: newProfile, error: insertError } = await supabase
            .from("users")
            .insert({
                clerk_id: userId,
                username: initialUsername,
                display_name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : initialUsername,
                avatar_url: clerkUser.imageUrl,
            })
            .select()
            .single();

        if (insertError) {
            console.error("Failed to sync user from Clerk:", insertError);
            return null;
        }
        return newProfile;
    }

    if (error) return null;
    return profile;
}
