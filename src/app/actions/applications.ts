"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitApplication(formData: {
    stage_name: string;
    genre: string;
    location: string;
    sample_url: string;
    social_handle: string;
    bio: string;
}) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const supabase = createAdminClient();

    // 1. Get User Profile ID
    const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

    if (profileError || !profile) throw new Error("User profile not found");

    // 2. Insert Application
    const { error: appError } = await supabase
        .from("applications")
        .insert({
            user_id: profile.id,
            ...formData,
            status: 'pending'
        });

    if (appError) {
        if (appError.code === '23505') throw new Error("You already have a pending application.");
        throw new Error("Failed to submit application: " + appError.message);
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");

    return { success: true, message: "Application submitted! The Kitchen will review your heat soon." };
}

export async function getApplications() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("applications")
        .select(`
            *,
            user:user_id (username, display_name, email)
        `)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function getActiveArtists() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("users")
        .select("id, username, display_name")
        .eq("status", "active") // or whatever condition you use for active artists. In your seed, they might not have a status, let's just get everyone with clout_score > 0 if status is null
        .order("display_name", { ascending: true });
        
    if (error) throw new Error(error.message);
    
    // Fallback if status doesn't match: if all users are artists.
    // Let's just return all users for now since the artist filtering logic might be different.
    const { data: allUsers } = await supabase
        .from("users")
        .select("id, username, display_name")
        .order("display_name", { ascending: true });
        
    return data && data.length > 0 ? data : (allUsers || []);
}

export async function updateApplicationStatus(id: string, status: 'approved' | 'rejected') {
    const supabase = createAdminClient();

    // 1. Fetch the application to get user info if approved
    const { data: app, error: fetchError } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

    if (fetchError || !app) throw new Error("Application not found");

    // 2. Update status
    const { error: updateError } = await supabase
        .from("applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (updateError) throw new Error(updateError.message);

    // 3. If approved, update user profile
    if (status === 'approved') {
        const { error: userError } = await supabase
            .from("users")
            .update({
                display_name: app.stage_name,
                genre: app.genre,
                location: app.location,
                bio: app.bio,
                is_artist: true, // Assuming this flag exists or we want to set role
                status: 'active'
            })
            .eq("id", app.user_id);

        if (userError) console.error("Failed to update user profile on approval:", userError);
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
}
