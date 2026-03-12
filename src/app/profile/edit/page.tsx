import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileEditForm from "./ProfileEditForm";

export default async function ProfileEditPage() {
    const { userId: clerkId } = await auth();
    if (!clerkId) redirect("/auth");

    const supabase = createAdminClient();

    const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", clerkId)
        .single();

    if (error || !profile) {
        redirect("/onboarding/profile");
    }

    const initialData = {
        username: profile.username || "",
        display_name: profile.display_name || "",
        city: profile.city || "",
        country: profile.country || "",
        genre: profile.genre || "freestyle",
        bio: profile.bio || ""
    };

    return (
        <div className="flex-1 w-full bg-char min-h-screen py-20 px-4 flex flex-col items-center">
            <div className="w-full max-w-2xl mb-12 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-ember rounded-full shadow-[0_0_10px_rgba(255,69,0,0.8)]"></div>
                    <span className="text-xs font-black text-smoke uppercase tracking-[0.5em]">Identity Management</span>
                </div>
                <h1 className="text-7xl md:text-8xl font-bebas text-white-app tracking-tight uppercase">Your <span className="text-ember">Profile</span></h1>
            </div>

            <ProfileEditForm initialData={initialData} />

            <div className="mt-12 text-center max-w-lg">
                <p className="text-smoke/40 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                    Changes reflect immediately across the platform. Profile completeness affects your rank and likelihood of being featured in matchups.
                </p>
            </div>
        </div>
    );
}
