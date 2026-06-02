"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminResourceArticle } from "@/lib/admin/types";
import { resourceArticles as localResourceArticles } from "@/lib/resources/resource-data";
import {
  type ResourceArticle,
  type ResourceCategory,
  type ResourceContentSection,
  type ResourceRelatedLink,
} from "@/lib/resources/types";
import { getResourceBySlug, resourceCategories } from "@/lib/resources/resource-utils";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

const resourceSelect = `
  id,
  created_at,
  updated_at,
  title,
  slug,
  category,
  summary,
  reading_time_minutes,
  audience,
  last_reviewed_at,
  content_sections,
  related_links,
  disclaimer,
  is_published
`;

export async function getAdminResources() {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resource_articles")
    .select(resourceSelect)
    .order("updated_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []).map(mapResourceRow);
}

export async function getAdminResourceById(id: string) {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resource_articles")
    .select(resourceSelect)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapResourceRow(data);
}

export async function getPublishedResources() {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resource_articles")
    .select(resourceSelect)
    .eq("is_published", true)
    .order("title", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []).map(mapResourceRow);
}

export async function getPublishedResourcesWithFallback() {
  const adminResources = await getPublishedResources();

  if (adminResources.length > 0) {
    return {
      articles: adminResources.map(toPublicResource),
      isFallback: false,
    };
  }

  return {
    articles: localResourceArticles,
    isFallback: true,
  };
}

export async function getPublicResourceBySlugWithFallback(slug: string) {
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resource_articles")
      .select(resourceSelect)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (!error && data) {
      return {
        article: toPublicResource(mapResourceRow(data)),
        isFallback: false,
      };
    }
  }

  return {
    article: getResourceBySlug(slug),
    isFallback: true,
  };
}

export async function createResource(formData: FormData) {
  await assertAdmin();
  const parsed = parseResourceForm(formData);

  if (!parsed.ok) {
    redirect(`/admin/resources/new?error=${encodeURIComponent(parsed.message)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("resource_articles").insert(parsed.value);

  if (error) {
    redirect(`/admin/resources/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateResourcePaths();
  redirect("/admin/resources");
}

export async function updateResource(id: string, formData: FormData) {
  await assertAdmin();
  const parsed = parseResourceForm(formData);

  if (!parsed.ok) {
    redirect(`/admin/resources/${id}/edit?error=${encodeURIComponent(parsed.message)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("resource_articles").update(parsed.value).eq("id", id);

  if (error) {
    redirect(`/admin/resources/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidateResourcePaths();
  redirect("/admin/resources");
}

export async function toggleResourcePublished(id: string, isPublished: boolean) {
  await assertAdmin();
  const supabase = await createClient();
  await supabase.from("resource_articles").update({ is_published: isPublished }).eq("id", id);
  revalidateResourcePaths();
}

export async function deleteResource(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  await supabase.from("resource_articles").delete().eq("id", id);
  revalidateResourcePaths();
}

function mapResourceRow(row: Record<string, unknown>): AdminResourceArticle {
  return {
    id: String(row.id),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    category: toResourceCategory(row.category),
    summary: String(row.summary ?? ""),
    readingTimeMinutes: toInteger(row.reading_time_minutes),
    audience: String(row.audience ?? ""),
    lastReviewedAt: String(row.last_reviewed_at ?? ""),
    contentSections: toContentSections(row.content_sections),
    relatedLinks: toRelatedLinks(row.related_links),
    disclaimer:
      String(row.disclaimer ?? "") ||
      "KinHarbour resources provide general navigation support only and do not replace professional advice.",
    isPublished: Boolean(row.is_published),
  };
}

function toPublicResource(resource: AdminResourceArticle): ResourceArticle {
  return {
    id: resource.id,
    title: resource.title,
    slug: resource.slug,
    category: resource.category,
    summary: resource.summary,
    readingTimeMinutes: resource.readingTimeMinutes,
    audience: resource.audience,
    lastReviewedAt: resource.lastReviewedAt,
    contentSections: resource.contentSections,
    relatedLinks: resource.relatedLinks,
    disclaimer: resource.disclaimer,
  };
}

function parseResourceForm(formData: FormData):
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; message: string } {
  const errors: string[] = [];
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);
  const category = getString(formData, "category") || "getting_started";
  const readingTimeMinutes = toInteger(getString(formData, "reading_time_minutes")) || 1;
  const contentSections = parseJsonArrayField<ResourceContentSection[]>(
    getString(formData, "content_sections"),
    "Content sections JSON",
    errors,
  );
  const relatedLinks = parseJsonArrayField<ResourceRelatedLink[]>(
    getString(formData, "related_links"),
    "Related links JSON",
    errors,
  );

  if (!title) {
    errors.push("Resource title is required.");
  }

  if (!slug) {
    errors.push("Resource slug is required.");
  }

  if (!resourceCategories.includes(category as ResourceCategory)) {
    errors.push("Choose a valid resource category.");
  }

  if (readingTimeMinutes < 1) {
    errors.push("Reading time must be at least 1 minute.");
  }

  if (errors.length > 0) {
    return {
      ok: false,
      message: errors.join(" "),
    };
  }

  return {
    ok: true,
    value: {
      title,
      slug,
      category,
      summary: getString(formData, "summary"),
      reading_time_minutes: readingTimeMinutes,
      audience: getString(formData, "audience"),
      last_reviewed_at: getString(formData, "last_reviewed_at") || null,
      content_sections: contentSections,
      related_links: relatedLinks,
      disclaimer: getString(formData, "disclaimer"),
      is_published: formData.get("is_published") === "on",
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

function revalidateResourcePaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
}

function getString(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function toResourceCategory(value: unknown): ResourceCategory {
  const candidate = String(value ?? "");
  return resourceCategories.includes(candidate as ResourceCategory)
    ? (candidate as ResourceCategory)
    : "getting_started";
}

function toInteger(value: unknown) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toContentSections(value: unknown): ResourceContentSection[] {
  return Array.isArray(value) ? (value as ResourceContentSection[]) : [];
}

function toRelatedLinks(value: unknown): ResourceRelatedLink[] {
  return Array.isArray(value) ? (value as ResourceRelatedLink[]) : [];
}

function parseJsonArrayField<T extends unknown[]>(
  value: string,
  label: string,
  errors: string[],
): T {
  if (!value) {
    return [] as unknown as T;
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      errors.push(`${label} must be a JSON array.`);
      return [] as unknown as T;
    }

    return parsed as T;
  } catch {
    errors.push(`${label} is not valid JSON.`);
    return [] as unknown as T;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
