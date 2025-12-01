import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Lazily create the admin client so the module doesn't throw at import time
// when environment variables are missing (e.g., in CI/preview builds).
let cachedAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cachedAdmin) return cachedAdmin;
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  cachedAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  return cachedAdmin;
}

export const supabaseAdmin = getSupabaseAdmin();
