// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// Main client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Alias so older code can also import { supabaseClient }
export const supabaseClient = supabase;

// Default export so any default imports keep working too
export default supabase;
