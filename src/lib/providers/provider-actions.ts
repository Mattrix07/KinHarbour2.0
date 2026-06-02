"use server";

import { revalidatePath } from "next/cache";

import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";
import { providerExistsForPublicShortlist } from "@/lib/admin/provider-admin-actions";
import {
  type ShortlistActionResult,
  type ShortlistedProvider,
  type ShortlistEditActionState,
  type ShortlistMode,
  type ShortlistStatus,
  shortlistStatusOptions,
} from "@/lib/providers/types";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

const shortlistSelect = `
  id,
  created_at,
  updated_at,
  family_case_id,
  user_id,
  provider_id,
  notes,
  status
`;

export async function getShortlistContext(): Promise<{
  mode: ShortlistMode;
  familyCaseId?: string;
  shortlistedProviders: ShortlistedProvider[];
  message?: string;
}> {
  if (!hasSupabaseConfig()) {
    return {
      mode: "not_configured",
      shortlistedProviders: [],
      message: "Supabase is not configured yet. Anonymous local shortlist behaviour is still available.",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    return {
      mode: "logged_out",
      shortlistedProviders: [],
      message: "Create a free account to save your shortlist.",
    };
  }

  const { familyCase, errorMessage } = await getActiveFamilyCase();

  if (!familyCase) {
    return {
      mode: errorMessage ? "error" : "no_family_case",
      shortlistedProviders: [],
      message: errorMessage ?? "Create a family case to save providers.",
    };
  }

  const { shortlistedProviders, errorMessage: shortlistError } =
    await getShortlistedProvidersForFamilyCase(familyCase.id);

  return {
    mode: shortlistError ? "error" : "family_case",
    familyCaseId: familyCase.id,
    shortlistedProviders,
    message: shortlistError,
  };
}

export async function getShortlistedProvidersForFamilyCase(
  familyCaseId: string,
): Promise<{ shortlistedProviders: ShortlistedProvider[]; errorMessage?: string }> {
  if (!hasSupabaseConfig()) {
    return {
      shortlistedProviders: [],
      errorMessage: "Supabase is not configured yet.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shortlisted_providers")
    .select(shortlistSelect)
    .eq("family_case_id", familyCaseId)
    .order("updated_at", { ascending: false });

  if (error) {
    return {
      shortlistedProviders: [],
      errorMessage:
        "Saved provider shortlists are not ready yet. Run the Supabase SQL for shortlisted providers, then refresh this page.",
    };
  }

  return {
    shortlistedProviders: (data ?? []).map((item) => item as ShortlistedProvider),
  };
}

export async function addProviderToShortlist(providerId: string): Promise<ShortlistActionResult> {
  if (!hasSupabaseConfig()) {
    return {
      status: "not_configured",
      message: "Saved locally for now. Supabase is not configured yet.",
    };
  }

  if (!(await providerExistsForPublicShortlist(providerId))) {
    return {
      status: "error",
      message: "This provider could not be found.",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) {
    return {
      status: "logged_out",
      message: "Saved locally. Create a free account to save your shortlist.",
    };
  }

  const { familyCase, errorMessage } = await getActiveFamilyCase();

  if (!familyCase) {
    return {
      status: errorMessage ? "error" : "no_family_case",
      message: errorMessage ?? "Create a family case to save providers.",
    };
  }

  const { data: existing, error: existingError } = await supabase
    .from("shortlisted_providers")
    .select("id")
    .eq("family_case_id", familyCase.id)
    .eq("provider_id", providerId)
    .maybeSingle();

  if (existingError) {
    return {
      status: "error",
      message: "We could not check this shortlist yet. Confirm the Supabase shortlist table is ready.",
    };
  }

  if (existing) {
    return {
      status: "already_saved",
      message: "This provider is already in your family shortlist.",
    };
  }

  const { error } = await supabase.from("shortlisted_providers").insert({
    family_case_id: familyCase.id,
    user_id: userId,
    provider_id: providerId,
    status: "considering",
    notes: null,
  });

  if (error) {
    return {
      status: "error",
      message: "We could not save this provider yet. Check the shortlist table and RLS policies.",
    };
  }

  revalidateShortlistPaths();

  return {
    status: "saved",
    message: "Saved to your family shortlist.",
  };
}

export async function removeProviderFromShortlist(providerId: string): Promise<ShortlistActionResult> {
  if (!hasSupabaseConfig()) {
    return {
      status: "not_configured",
      message: "Removed locally for now. Supabase is not configured yet.",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    return {
      status: "logged_out",
      message: "Removed from your local shortlist.",
    };
  }

  const { familyCase, errorMessage } = await getActiveFamilyCase();

  if (!familyCase) {
    return {
      status: errorMessage ? "error" : "no_family_case",
      message: errorMessage ?? "Create a family case to save providers.",
    };
  }

  const { error } = await supabase
    .from("shortlisted_providers")
    .delete()
    .eq("family_case_id", familyCase.id)
    .eq("provider_id", providerId);

  if (error) {
    return {
      status: "error",
      message: "We could not remove this provider yet. Check that you still have access.",
    };
  }

  revalidateShortlistPaths();

  return {
    status: "removed",
    message: "Removed from your family shortlist.",
  };
}

export async function updateShortlistedProvider(
  shortlistId: string,
  _previousState: ShortlistEditActionState,
  formData: FormData,
): Promise<ShortlistEditActionState> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "Supabase is not configured yet.",
    };
  }

  const notes = getString(formData, "notes");
  const status = getString(formData, "status");

  if (notes.length > 1200) {
    return {
      status: "error",
      message: "Use 1200 characters or fewer for notes.",
    };
  }

  if (!isShortlistStatus(status)) {
    return {
      status: "error",
      message: "Choose a valid shortlist status.",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    return {
      status: "error",
      message: "Log in again to update this shortlist item.",
    };
  }

  const { error } = await supabase
    .from("shortlisted_providers")
    .update({
      notes: notes || null,
      status,
    })
    .eq("id", shortlistId)
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      message: "We could not update this shortlist item. Check that you still have access.",
    };
  }

  revalidateShortlistPaths();

  return {
    status: "success",
    message: "Shortlist notes saved.",
  };
}

function revalidateShortlistPaths() {
  revalidatePath("/providers");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/shortlist");
  revalidatePath("/dashboard/compare");
}

function getString(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function isShortlistStatus(value: string): value is ShortlistStatus {
  return shortlistStatusOptions.some((option) => option.value === value);
}
