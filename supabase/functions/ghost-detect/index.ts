import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// CRON JOB: Runs every minute
// Detects battles where scheduled_at was 15+ minutes ago but status is still
// 'accepted' (neither artist moved it to 'live'). Marks as no_show so an
// admin can resolve blame — we do NOT auto-penalize without LiveKit evidence.
serve(async (_req) => {
    try {
        const limitDate = new Date(Date.now() - 15 * 60 * 1000).toISOString();

        const { data: stale, error } = await supabase
            .from('battles')
            .select('id, artist_a_id, artist_b_id')
            .eq('status', 'accepted')
            .lt('scheduled_at', limitDate);

        if (error) throw error;
        if (!stale || stale.length === 0) {
            return new Response(JSON.stringify({ checked: 0 }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        for (const battle of stale) {
            // Mark as no_show — admin resolves who ghosted via the admin portal.
            // When LiveKit webhooks are wired, this can check participant join
            // records to auto-determine ghost_a vs ghost_b.
            await supabase.from('battles').update({
                status: 'no_show',
            }).eq('id', battle.id);
        }

        return new Response(JSON.stringify({ checked: stale.length }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
