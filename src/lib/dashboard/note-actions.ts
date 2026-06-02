"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";
import {
  type DashboardActionState,
  type FamilyNote,
  type NoteType,
  noteTypeOptions,
  type ProfileSummary,
} from "@/lib/dashboard/types";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

const noteSelect = `
  id,
  created_at,
  updated_at,
  family_case_id,
  created_by,
  title,
  body,
  note_type
`;

export async function getNotesForFamilyCase(
  familyCaseId: string,
  limit = 100,
): Promise<{ notes: FamilyNote[]; errorMessage?: string }> {
  if (!hasSupabaseConfig()) {
    return {
      notes: [],
      errorMessage: "Supabase is not configured yet.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_notes")
    .select(noteSelect)
    .eq("family_case_id", familyCaseId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      notes: [],
      errorMessage:
        "Family notes are not ready yet. Run the Supabase SQL for collaboration, then refresh this page.",
    };
  }

  const profileMap = await getProfilesById((data ?? []).map((note) => note.created_by as string));

  return {
    notes: (data ?? []).map((note) => ({
      id: note.id as string,
      created_at: note.created_at as string,
      updated_at: note.updated_at as string,
      family_case_id: note.family_case_id as string,
      created_by: note.created_by as string,
      title: (note.title as string | null) ?? null,
      body: note.body as string,
      note_type: note.note_type as NoteType,
      createdByProfile: profileMap.get(note.created_by as string) ?? null,
    })),
  };
}

export async function createFamilyNote(
  _previousState: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "Supabase is not configured yet.",
    };
  }

  const title = getString(formData, "title");
  const body = getString(formData, "body");
  const noteType = getString(formData, "note_type") || "general";

  if (title.length > 120) {
    return {
      status: "error",
      message: "Use 120 characters or fewer for the note title.",
    };
  }

  if (!body) {
    return {
      status: "error",
      message: "Enter a note before saving.",
    };
  }

  if (body.length > 3000) {
    return {
      status: "error",
      message: "Use 3000 characters or fewer for the note body.",
    };
  }

  if (!isNoteType(noteType)) {
    return {
      status: "error",
      message: "Choose a valid note type.",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) {
    redirect("/login?next=/dashboard/notes");
  }

  const { familyCase, errorMessage } = await getActiveFamilyCase();

  if (!familyCase) {
    return {
      status: "error",
      message: errorMessage ?? "Create a family case before adding notes.",
    };
  }

  const { error } = await supabase.from("family_notes").insert({
    family_case_id: familyCase.id,
    created_by: userId,
    title: title || null,
    body,
    note_type: noteType,
  });

  if (error) {
    return {
      status: "error",
      message: "We could not create this note yet. Check the family_notes table and RLS policies.",
    };
  }

  revalidateNotePaths();

  return {
    status: "success",
    message: "Note added.",
  };
}

export async function deleteFamilyNote(noteId: string) {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "Supabase is not configured yet.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("family_notes").delete().eq("id", noteId);

  if (error) {
    return {
      status: "error",
      message: "We could not delete this note. Check that you still have access.",
    };
  }

  revalidateNotePaths();

  return {
    status: "success",
    message: "Note deleted.",
  };
}

function revalidateNotePaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/notes");
}

async function getProfilesById(userIds: string[]) {
  const uniqueIds = Array.from(new Set(userIds)).filter(Boolean);
  const profileMap = new Map<string, ProfileSummary>();

  if (uniqueIds.length === 0) {
    return profileMap;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", uniqueIds);

  for (const profile of data ?? []) {
    profileMap.set(profile.id as string, {
      id: profile.id as string,
      email: (profile.email as string | null) ?? null,
      full_name: (profile.full_name as string | null) ?? null,
    });
  }

  return profileMap;
}

function getString(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function isNoteType(value: string): value is NoteType {
  return noteTypeOptions.some((option) => option.value === value);
}
