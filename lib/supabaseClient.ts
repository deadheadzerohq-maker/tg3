import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Client-side Supabase instance for App Router components. Relies on the
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY environment
// variables provided at runtime by Vercel.
export const supabase = createClientComponentClient();
export const supabaseClient = supabase;
export default supabase;
