import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { publicEnv } from "./env";

export function getSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerComponentClient({
    cookies: () => cookieStore,
    supabaseUrl: publicEnv.supabaseUrl,
    supabaseKey: publicEnv.supabaseAnonKey,
  });
}
