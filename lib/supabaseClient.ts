import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "./env";

const supabaseUrl = publicEnv.supabaseUrl;
const supabaseAnonKey = publicEnv.supabaseAnonKey;

export const createSupabaseBrowserClient = () =>
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true },
  });

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
