import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("URL:", supabaseUrl);
    console.log("Key defined:", !!supabaseKey);

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing environment variables");
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Fetching artists...");
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
        console.error("Fetch error:", error);
    } else {
        console.log("Success! Found artists:", data?.length);
        if (data && data.length > 0) {
            console.log("Sample artist:", data[0].username);
        }
    }
}

testSupabase();
