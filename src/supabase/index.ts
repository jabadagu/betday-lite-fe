import { createClient } from "@supabase/supabase-js";
import { ENV } from "@betday/config/env";

const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  ENV.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = ENV.SUPABASE_SERVICE_ROLE_KEY;

export function createSupabaseServerClient() {
  if (!supabaseUrl) {
    throw new Error("Missing Supabase server environment variables");
  }

  // Prefer service role on server; fall back to anon key for local setups.
  const serverKey = supabaseServiceRoleKey || supabaseAnonKey;
  if (!serverKey) {
    throw new Error("Missing Supabase server environment variables");
  }

  return createClient(supabaseUrl, serverKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
