import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export function getSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerComponentClient({
    cookies: () => cookieStore,
  });
}
