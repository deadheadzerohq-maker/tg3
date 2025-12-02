import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "./env";

const supabaseUrl = publicEnv.supabaseUrl;
const serviceKey = serverEnv.supabaseServiceRoleKey;

export const supabaseAdminClient = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
