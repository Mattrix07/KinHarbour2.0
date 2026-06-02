"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminProvider } from "@/lib/admin/types";
import { providers as localProviders } from "@/lib/providers/provider-data";
import {
  type CareType,
  type Provider,
  type RoomType,
} from "@/lib/providers/types";
import { getProviderById } from "@/lib/providers/provider-utils";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

const providerSelect = `
  id,
  created_at,
  updated_at,
  name,
  suburb,
  state,
  postcode,
  care_types,
  room_types,
  dementia_support,
  respite_available,
  palliative_care,
  couples_accommodation,
  star_rating,
  compliance_rating,
  staffing_rating,
  resident_experience_rating,
  quality_measures_rating,
  estimated_rad,
  estimated_dap,
  description,
  features,
  contact_phone,
  website,
  last_verified_at,
  data_source_note,
  is_published,
  is_demo_data
`;

export async function getAdminProviders() {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("providers")
    .select(providerSelect)
    .order("updated_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []).map(mapProviderRow);
}

export async function getAdminProviderById(id: string) {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("providers")
    .select(providerSelect)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProviderRow(data);
}

export async function getPublishedProviders() {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("providers")
    .select(providerSelect)
    .eq("is_published", true)
    .order("name", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []).map(mapProviderRow);
}

export async function getPublishedProvidersWithFallback() {
  const adminProviders = await getPublishedProviders();

  if (adminProviders.length > 0) {
    return {
      providers: adminProviders.map(toPublicProvider),
      isFallback: false,
    };
  }

  return {
    providers: localProviders,
    isFallback: true,
  };
}

export async function getPublicProviderByIdWithFallback(id: string) {
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("providers")
      .select(providerSelect)
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();

    if (!error && data) {
      return {
        provider: toPublicProvider(mapProviderRow(data)),
        isFallback: false,
      };
    }
  }

  return {
    provider: getProviderById(id),
    isFallback: true,
  };
}

export async function providerExistsForPublicShortlist(providerId: string) {
  if (getProviderById(providerId)) {
    return true;
  }

  if (!hasSupabaseConfig()) {
    return false;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("providers")
    .select("id")
    .eq("id", providerId)
    .eq("is_published", true)
    .maybeSingle();

  return !error && Boolean(data);
}

export async function createProvider(formData: FormData) {
  await assertAdmin();
  const parsed = parseProviderForm(formData);

  if (!parsed.ok) {
    redirect(`/admin/providers/new?error=${encodeURIComponent(parsed.message)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("providers").insert(parsed.value);

  if (error) {
    redirect(`/admin/providers/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateProviderPaths();
  redirect("/admin/providers");
}

export async function updateProvider(id: string, formData: FormData) {
  await assertAdmin();
  const parsed = parseProviderForm(formData);

  if (!parsed.ok) {
    redirect(`/admin/providers/${id}/edit?error=${encodeURIComponent(parsed.message)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("providers").update(parsed.value).eq("id", id);

  if (error) {
    redirect(`/admin/providers/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidateProviderPaths();
  redirect("/admin/providers");
}

export async function toggleProviderPublished(id: string, isPublished: boolean) {
  await assertAdmin();
  const supabase = await createClient();
  await supabase.from("providers").update({ is_published: isPublished }).eq("id", id);
  revalidateProviderPaths();
}

export async function deleteProvider(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  await supabase.from("providers").delete().eq("id", id);
  revalidateProviderPaths();
}

function mapProviderRow(row: Record<string, unknown>): AdminProvider {
  return {
    id: String(row.id),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
    name: String(row.name ?? ""),
    suburb: String(row.suburb ?? ""),
    state: String(row.state ?? "NSW"),
    postcode: String(row.postcode ?? ""),
    careTypes: toStringArray(row.care_types) as CareType[],
    roomTypes: toStringArray(row.room_types) as RoomType[],
    dementiaSupport: Boolean(row.dementia_support),
    respiteAvailable: Boolean(row.respite_available),
    palliativeCare: Boolean(row.palliative_care),
    couplesAccommodation: Boolean(row.couples_accommodation),
    starRating: toNumber(row.star_rating),
    complianceRating: toNumber(row.compliance_rating),
    staffingRating: toNumber(row.staffing_rating),
    residentExperienceRating: toNumber(row.resident_experience_rating),
    qualityMeasuresRating: toNumber(row.quality_measures_rating),
    estimatedRAD: toNumber(row.estimated_rad),
    estimatedDAP: toNumber(row.estimated_dap),
    description: String(row.description ?? ""),
    features: toStringArray(row.features),
    contactPhone: String(row.contact_phone ?? ""),
    website: String(row.website ?? ""),
    lastVerifiedAt: String(row.last_verified_at ?? ""),
    dataSourceNote:
      String(row.data_source_note ?? "") ||
      "Admin-managed provider record. Families should verify details directly.",
    isPublished: Boolean(row.is_published),
    isDemoData: row.is_demo_data === null ? true : Boolean(row.is_demo_data),
  };
}

function toPublicProvider(provider: AdminProvider): Provider {
  return {
    id: provider.id,
    name: provider.name,
    suburb: provider.suburb,
    state: provider.state,
    postcode: provider.postcode,
    careTypes: provider.careTypes,
    roomTypes: provider.roomTypes,
    dementiaSupport: provider.dementiaSupport,
    respiteAvailable: provider.respiteAvailable,
    palliativeCare: provider.palliativeCare,
    couplesAccommodation: provider.couplesAccommodation,
    starRating: provider.starRating,
    complianceRating: provider.complianceRating,
    staffingRating: provider.staffingRating,
    residentExperienceRating: provider.residentExperienceRating,
    qualityMeasuresRating: provider.qualityMeasuresRating,
    estimatedRAD: provider.estimatedRAD,
    estimatedDAP: provider.estimatedDAP,
    description: provider.description,
    features: provider.features,
    contactPhone: provider.contactPhone,
    website: provider.website,
    lastVerifiedAt: provider.lastVerifiedAt,
    dataSourceNote: provider.dataSourceNote,
    isDemoData: provider.isDemoData,
  };
}

function parseProviderForm(formData: FormData):
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; message: string } {
  const errors: string[] = [];
  const name = getString(formData, "name");

  if (!name) {
    errors.push("Provider name is required.");
  }

  const starRating = parseNumberField(formData, "star_rating", "Star rating", errors, {
    min: 0,
    max: 5,
  });
  const estimatedRad = parseNumberField(formData, "estimated_rad", "Estimated RAD", errors, {
    min: 0,
  });
  const estimatedDap = parseNumberField(formData, "estimated_dap", "Estimated DAP", errors, {
    min: 0,
  });
  const complianceRating = parseRatingTextField(formData, "compliance_rating", "Compliance rating", errors);
  const staffingRating = parseRatingTextField(formData, "staffing_rating", "Staffing rating", errors);
  const residentExperienceRating = parseRatingTextField(
    formData,
    "resident_experience_rating",
    "Resident experience rating",
    errors,
  );
  const qualityMeasuresRating = parseRatingTextField(
    formData,
    "quality_measures_rating",
    "Quality measures rating",
    errors,
  );

  if (errors.length > 0) {
    return {
      ok: false,
      message: errors.join(" "),
    };
  }

  return {
    ok: true,
    value: {
      name,
      suburb: getString(formData, "suburb"),
      state: getString(formData, "state") || "NSW",
      postcode: getString(formData, "postcode"),
      care_types: splitList(getString(formData, "care_types")),
      room_types: splitList(getString(formData, "room_types")),
      dementia_support: formData.get("dementia_support") === "on",
      respite_available: formData.get("respite_available") === "on",
      palliative_care: formData.get("palliative_care") === "on",
      couples_accommodation: formData.get("couples_accommodation") === "on",
      star_rating: starRating,
      compliance_rating: complianceRating,
      staffing_rating: staffingRating,
      resident_experience_rating: residentExperienceRating,
      quality_measures_rating: qualityMeasuresRating,
      estimated_rad: estimatedRad,
      estimated_dap: estimatedDap,
      description: getString(formData, "description"),
      features: splitList(getString(formData, "features")),
      contact_phone: getString(formData, "contact_phone"),
      website: getString(formData, "website"),
      last_verified_at: getString(formData, "last_verified_at") || null,
      data_source_note: getString(formData, "data_source_note"),
      is_published: formData.get("is_published") === "on",
      is_demo_data: formData.get("is_demo_data") === "on",
    },
  };
}

async function assertAdmin() {
  if (!hasSupabaseConfig()) {
    redirect("/login?error=supabase-not-configured");
  }

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (!userId) {
    redirect("/login?next=/admin");
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (data?.role !== "admin") {
    redirect("/dashboard");
  }
}

function revalidateProviderPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/providers");
  revalidatePath("/providers");
  revalidatePath("/compare");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/shortlist");
  revalidatePath("/dashboard/compare");
}

function getString(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function splitList(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNumberField(
  formData: FormData,
  fieldName: string,
  label: string,
  errors: string[],
  options: { min?: number; max?: number } = {},
) {
  const value = getString(formData, fieldName);

  if (!value) {
    return 0;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    errors.push(`${label} must be a valid number.`);
    return 0;
  }

  if (options.min !== undefined && parsed < options.min) {
    errors.push(`${label} cannot be below ${options.min}.`);
  }

  if (options.max !== undefined && parsed > options.max) {
    errors.push(`${label} cannot be above ${options.max}.`);
  }

  return parsed;
}

function parseRatingTextField(
  formData: FormData,
  fieldName: string,
  label: string,
  errors: string[],
) {
  const value = getString(formData, fieldName);

  if (!value) {
    return "";
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 5) {
    errors.push(`${label} must be a number from 0 to 5.`);
  }

  return value;
}

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
