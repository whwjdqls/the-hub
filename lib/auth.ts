import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string;
  name: string;
  email: string;
};

export async function getViewer(): Promise<Viewer | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;

  const claims = data.claims as Record<string, unknown>;
  const metadata = (claims.user_metadata ?? {}) as Record<string, unknown>;
  const email = typeof claims.email === "string" ? claims.email : "";
  const fallbackName = email.split("@")[0] || "Member";

  return {
    id: String(claims.sub),
    email,
    name: typeof metadata.display_name === "string" ? metadata.display_name : fallbackName,
  };
}
