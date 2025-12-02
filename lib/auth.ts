import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "./env";

export function getSupabaseServerClient() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  return createClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: Boolean(refreshToken),
    },
    global: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
  });
}
