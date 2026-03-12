import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/actions/user";
import ProfileForm from "./ProfileForm";

export default async function ProfileSetupPage() {
    const user = await getUserProfile();

    if (!user || !user.tos_accepted_at) {
        redirect("/onboarding");
    }

    // If already set up, redirect home
    if (user.city && user.country) {
        redirect("/");
    }

    return <ProfileForm defaultUsername={user.username} />;
}
