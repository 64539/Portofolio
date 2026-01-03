import { createClient } from "@supabase/supabase-js";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

  // In build time or if envs missing, return a dummy client to prevent crash
  if (!url || !anonKey || url === "https://placeholder.supabase.co") {
     // Return a minimal mock client if needed, or just let it fail gracefully at runtime
     // But for build, we shouldn't throw if variables are missing in CI/CD
  }

  return createClient(url, anonKey);
}

