"use server";

import { redirect } from "next/navigation";

import type { AdminOverview, AdminProfile } from "@/lib/admin/types";
import { getAdminProviders } from "@/lib/admin/provider-admin-actions";
import { getAdminResources } from "@/lib/admin/resource-admin-actions";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id as string,
    email: (data.email as string | null) ?? null,
    full_name: (data.full_name as string | null) ?? null,
    role: (data.role as string | null) ?? "family_user",
  };
}

export async function requireAdminProfile(nextPath = "/admin") {
  if (!hasSupabaseConfig()) {
    redirect("/login?error=supabase-not-configured");
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const profile = await getCurrentAdminProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return profile;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  await requireAdminProfile();

  const [providers, resources] = await Promise.all([
    getAdminProviders(),
    getAdminResources(),
  ]);

  return {
    totalProviders: providers.length,
    publishedProviders: providers.filter((provider) => provider.isPublished).length,
    draftProviders: providers.filter((provider) => !provider.isPublished).length,
    totalResources: resources.length,
    publishedResources: resources.filter((resource) => resource.isPublished).length,
    draftResources: resources.filter((resource) => !resource.isPublished).length,
    recentProviders: providers.slice(0, 5),
    recentResources: resources.slice(0, 5),
  };
}
