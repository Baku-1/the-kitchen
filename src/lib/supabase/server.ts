import { createClient } from "@supabase/supabase-js";

// This is a privileged client that bypasses RLS.
// It should ONLY be used in secure server environments like webhooks.
export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
