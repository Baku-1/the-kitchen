import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/actions/user";
import TOSContent from "./TOSContent";

export default async function OnboardingPage() {
    const user = await getUserProfile();

    if (!user) {
        // Wait for webhook to sync if they just signed up
        // In a real app we might poll or show a loading state
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-ember border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-smoke">Locking in your profile...</p>
                </div>
            </div>
        );
    }

    // If already accepted TOS, check if profile is set up
    if (user.tos_accepted_at) {
        if (!user.country || !user.city) {
            redirect("/onboarding/profile");
        } else {
            redirect("/");
        }
    }

    return <TOSContent />;
}
