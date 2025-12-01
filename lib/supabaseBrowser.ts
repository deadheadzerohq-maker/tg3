"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useMemo } from "react";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}

export function useSupabaseBrowser() {
  return useMemo(() => createSupabaseBrowserClient(), []);
}
