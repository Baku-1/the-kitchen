"use server";

import { auth } from "@clerk/nextjs/server";
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

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", userId)
        .single();

    if (error) return null;
    return data;
}
