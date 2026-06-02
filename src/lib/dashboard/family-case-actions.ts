"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  australianStateOptions,
  currentStatusOptions,
  type CurrentLivingSituation,
  type CurrentStatus,
  type FamilyCase,
  type FamilyCaseActionState,
  type FamilyCaseFieldName,
  type FamilyCaseLoadResult,
  livingSituationOptions,
  type RelationshipToUser,
  relationshipOptions,
} from "@/lib/dashboard/types";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

const familyCaseSelect = `
  id,
  created_at,
  updated_at,
  created_by,
  care_recipient_name,
  relationship_to_user,
  care_recipient_suburb,
  care_recipient_state,
  current_living_situation,
  current_status,
  primary_pathway,
  urgency_level
`;

type FamilyCaseInput = {
  care_recipient_name: string;
  relationship_to_user: RelationshipToUser;
  care_recipient_suburb: string | null;
  care_recipient_state: string;
  current_living_situation: CurrentLivingSituation;
  current_status: CurrentStatus;
};

export async function getActiveFamilyCase(): Promise<FamilyCaseLoadResult> {
  if (!hasSupabaseConfig()) {
    return {
      familyCase: null,
      errorMessage: "Supabase is not configured yet. Add your environment variables first.",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    return {
      familyCase: null,
      errorMessage: "Log in again to load your KinHarbour dashboard.",
    };
  }

  const { data, error } = await supabase
    .from("family_cases")
    .select(familyCaseSelect)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      familyCase: null,
      errorMessage:
        "Family case storage is not ready yet. Run the Supabase SQL for family cases, then refresh this page.",
    };
  }

  return {
    familyCase: data ? (data as FamilyCase) : null,
  };
}

export async function createFamilyCase(
  _previousState: FamilyCaseActionState,
  formData: FormData,
): Promise<FamilyCaseActionState> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add your environment variables first.",
    };
  }

  const parsed = parseFamilyCaseForm(formData);

  if (!parsed.ok) {
    return {
      status: "error",
      message: "Check the highlighted fields before creating the family case.",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) {
    redirect("/login?next=/dashboard");
  }

  const existingCase = await getActiveFamilyCase();

  if (existingCase.familyCase) {
    redirect("/dashboard");
  }

  const { error } = await supabase.from("family_cases").insert({
    ...parsed.value,
    created_by: userId,
    primary_pathway: null,
    urgency_level: null,
  });

  if (error) {
    return {
      status: "error",
      message:
        "We could not create the family case yet. Check that the Supabase family case tables and policies have been created.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateFamilyCase(
  familyCaseId: string,
  _previousState: FamilyCaseActionState,
  formData: FormData,
): Promise<FamilyCaseActionState> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add your environment variables first.",
    };
  }

  const parsed = parseFamilyCaseForm(formData);

  if (!parsed.ok) {
    return {
      status: "error",
      message: "Check the highlighted fields before saving the family case.",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    redirect("/login?next=/dashboard/settings");
  }

  const { error } = await supabase
    .from("family_cases")
    .update(parsed.value)
    .eq("id", familyCaseId)
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      message:
        "We could not update this family case. Check that you are logged in and still have access.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?updated=true");
}

function parseFamilyCaseForm(formData: FormData):
  | { ok: true; value: FamilyCaseInput }
  | { ok: false; fieldErrors: Partial<Record<FamilyCaseFieldName, string>> } {
  const fieldErrors: Partial<Record<FamilyCaseFieldName, string>> = {};

  const careRecipientName = getString(formData, "care_recipient_name");
  const relationshipToUser = getString(formData, "relationship_to_user");
  const suburb = getString(formData, "care_recipient_suburb");
  const state = getString(formData, "care_recipient_state").toUpperCase();
  const livingSituation = getString(formData, "current_living_situation");
  const currentStatus = getString(formData, "current_status");

  if (!careRecipientName) {
    fieldErrors.care_recipient_name = "Enter a first name or nickname.";
  } else if (careRecipientName.length > 80) {
    fieldErrors.care_recipient_name = "Use 80 characters or fewer.";
  }

  if (!isRelationshipToUser(relationshipToUser)) {
    fieldErrors.relationship_to_user = "Choose your relationship.";
  }

  if (suburb.length > 80) {
    fieldErrors.care_recipient_suburb = "Use 80 characters or fewer.";
  }

  if (!isAustralianState(state)) {
    fieldErrors.care_recipient_state = "Choose an Australian state or territory.";
  }

  if (!isCurrentLivingSituation(livingSituation)) {
    fieldErrors.current_living_situation = "Choose the current living situation.";
  }

  if (!isCurrentStatus(currentStatus)) {
    fieldErrors.current_status = "Choose the current status.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      care_recipient_name: careRecipientName,
      relationship_to_user: relationshipToUser as RelationshipToUser,
      care_recipient_suburb: suburb || null,
      care_recipient_state: state,
      current_living_situation: livingSituation as CurrentLivingSituation,
      current_status: currentStatus as CurrentStatus,
    },
  };
}

function getString(formData: FormData, fieldName: FamilyCaseFieldName) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function isRelationshipToUser(value: string): value is RelationshipToUser {
  return relationshipOptions.some((option) => option.value === value);
}

function isCurrentLivingSituation(value: string): value is CurrentLivingSituation {
  return livingSituationOptions.some((option) => option.value === value);
}

function isCurrentStatus(value: string): value is CurrentStatus {
  return currentStatusOptions.some((option) => option.value === value);
}

function isAustralianState(value: string) {
  return australianStateOptions.some((state) => state === value);
}
