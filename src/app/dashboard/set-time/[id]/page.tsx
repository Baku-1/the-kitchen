import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Swords, Info } from "lucide-react";
import SetTimeForm from "./SetTimeForm";

export default async function SetTimePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const supabase = createAdminClient();

    // 1. Fetch User Profile
    const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

    if (!profile) redirect("/onboarding");

    // 2. Fetch Battle & ensure caller is the Chef (artist_a)
    const { data: battle, error } = await supabase
        .from("battles")
        .select(`
            *,
            challenger:artist_b_id (username, display_name, clout_score)
        `)
        .eq("id", id)
        .eq("artist_a_id", profile.id)
        .eq("status", "pending")
        .single();

    if (error || !battle) {
        return (
            <div className="flex-1 w-full flex items-center justify-center p-4 bg-char text-center">
                <div>
                    <h2 className="text-4xl font-bebas text-white-app mb-4 uppercase">Battle Not Found</h2>
                    <p className="text-smoke font-barlow mb-8">This challenge may have been already scheduled or cancelled.</p>
                    <Link href="/dashboard" className="text-ember font-bebas tracking-widest hover:underline">BACK TO DASHBOARD</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 w-full">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-smoke hover:text-ember transition-colors mb-8 font-barlow uppercase text-xs tracking-[0.2em]">
                <ArrowLeft className="w-4 h-4" /> CANCEL & EXIT
            </Link>

            <div className="mb-12">
                <h1 className="text-6xl font-bebas text-white-app tracking-wide mb-2 uppercase">Scheduling the <span className="text-ember">Smoke</span></h1>
                <p className="text-lg text-smoke font-barlow tracking-widest uppercase">Contract with @{battle.challenger.username}</p>
            </div>

            <div className="bg-ash border border-smoke p-8 clip-angled relative shadow-2xl overflow-hidden mb-12">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember to-heat"></div>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 border-b border-smoke/30 pb-6">
                        <Swords className="w-8 h-8 text-ember" />
                        <div>
                            <div className="text-white-app font-bebas text-2xl tracking-wide uppercase">Challenge Details</div>
                            <div className="text-smoke text-sm uppercase tracking-widest font-barlow">Genre: {battle.genre} | {battle.title || "Standard Clash"}</div>
                        </div>
                    </div>

                    <SetTimeForm battleId={battle.id} />
                </div>
            </div>

            <div className="p-6 bg-ember/5 border border-ember/20 flex gap-4">
                <Info className="w-6 h-6 text-ember shrink-0" />
                <div className="text-sm text-smoke leading-relaxed uppercase tracking-tight">
                    <p className="font-bold text-white-app mb-1 underline">CHEF'S PREROGATIVE:</p>
                    As the one being challenged, you hold the power to set the time. Once you LOCK IT IN, the battle is sanctioned. No-shows (from either side) will result in automated clout forfeiture and a permanent mark on your kitchen record.
                </div>
            </div>
        </div>
    );
}
