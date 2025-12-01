// lib/supabaseClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  cachedClient = createClient(supabaseUrl, supabaseAnonKey);
  return cachedClient;
}

// Main client instance (may be null if env vars are missing)
export const supabase = getSupabaseClient();

// Alias so older code can also import { supabaseClient }
export const supabaseClient = supabase;

// Default export so any default imports keep working too
export default supabase;
