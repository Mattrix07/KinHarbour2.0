"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig, hasSupabaseConfig } from "./config";

export { hasSupabaseConfig };

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
