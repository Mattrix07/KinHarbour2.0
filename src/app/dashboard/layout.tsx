import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  if (!hasSupabaseConfig()) {
    redirect("/login?error=supabase-not-configured");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login?next=/dashboard");
  }

  return children;
}
