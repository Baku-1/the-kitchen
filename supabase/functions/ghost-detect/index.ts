import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// CRON JOB: Runs every minute
serve(async (req) => {
    try {
        // Find battles that started over 15 mins ago but aren't 'live' or 'ghost'
        const limitDate = new Date(Date.now() - 15 * 60 * 1000).toISOString();

        // In a real scenario, we'd check LiveKit webhooks or participant records
        // to see if Artist A or B never joined. For this mock detect:
        const { data: ghosts, error } = await supabase
            .from('battles')
            .select('id, artist_a_id, artist_b_id')
            .eq('status', 'accepted')
            .lt('scheduled_at', limitDate);

        if (error) throw error;

        for (const battle of ghosts) {
            // Mock logic: randomly decide who ghosted, or default to artist_a
            // Real logic reads the LiveKit api to check active connect traces

            const ghostId = battle.artist_a_id;
            const winnerId = battle.artist_b_id;

            // Update battle status
            await supabase.from('battles').update({
                status: 'ghost_a',
                winner_id: winnerId
            }).eq('id', battle.id);

            // Industry reaction: The community keeps them honest.
            // Clout drops naturally from dodging
            await supabase.rpc('apply_credibility_drop', { user_id: ghostId });
            // Opponent gets the default W because they showed up
            await supabase.rpc('apply_default_win', { user_id: winnerId });
        }

        return new Response(JSON.stringify({ checked: ghosts.length }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
