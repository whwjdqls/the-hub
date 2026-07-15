import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function authenticatedClient() {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured.");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) throw new Error("Authentication required.");
  return { supabase, userId: String(userId) };
}
