"use server";

import { revalidatePath } from "next/cache";

import {
  type AssessmentResult,
  type AssessmentSaveResult,
  type AssessmentSession,
  type AssessmentSessionLoadResult,
} from "@/lib/assessment/types";
import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

const assessmentSessionSelect = `
  id,
  created_at,
  family_case_id,
  user_id,
  answers,
  result,
  primary_pathway,
  secondary_pathways,
  urgency_level,
  risk_flags,
  recommended_next_steps,
  consent_given
`;

export async function saveAssessmentResult(
  result: AssessmentResult,
): Promise<AssessmentSaveResult> {
  if (!hasSupabaseConfig()) {
    return {
      status: "not_configured",
      message: "Your result is shown below, but dashboard saving is not configured yet.",
    };
  }

  if (!isSaveableAssessmentResult(result)) {
    return {
      status: "save_failed",
      message: "Your result is shown below, but we could not save it to your dashboard.",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) {
    return {
      status: "logged_out",
      message: "Create an account to save this action plan.",
    };
  }

  const { familyCase, errorMessage } = await getActiveFamilyCase();

  if (!familyCase) {
    return {
      status: errorMessage ? "save_failed" : "no_family_case",
      message: errorMessage ?? "Create a family case to save this action plan.",
    };
  }

  const recommendedNextSteps = result.actionPlanSteps.map((step) => step.title);
  const riskFlags = result.riskFlags ?? [];

  const { data, error } = await supabase
    .from("assessment_sessions")
    .insert({
      family_case_id: familyCase.id,
      user_id: userId,
      answers: result.answers,
      result: {
        ...result,
        riskFlags,
      },
      primary_pathway: result.primaryPathway,
      secondary_pathways: result.secondaryPathways,
      urgency_level: result.urgencyLevel,
      risk_flags: riskFlags,
      recommended_next_steps: recommendedNextSteps,
      consent_given: false,
    })
    .select("id")
    .single();

  if (error) {
    return {
      status: "save_failed",
      message: "Your result is shown below, but we could not save it to your dashboard.",
    };
  }

  await supabase
    .from("family_cases")
    .update({
      primary_pathway: result.primaryPathway,
      urgency_level: result.urgencyLevel,
    })
    .eq("id", familyCase.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/action-plan");
  revalidatePath("/dashboard/assessment");

  return {
    status: "saved",
    message: "Your action plan has been saved to your KinHarbour dashboard.",
    sessionId: data.id as string,
  };
}

export async function getAssessmentSessionsForFamilyCase(
  familyCaseId: string,
  limit = 20,
): Promise<AssessmentSessionLoadResult> {
  if (!hasSupabaseConfig()) {
    return {
      sessions: [],
      errorMessage: "Supabase is not configured yet. Add your environment variables first.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assessment_sessions")
    .select(assessmentSessionSelect)
    .eq("family_case_id", familyCaseId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      sessions: [],
      errorMessage:
        "Saved assessments are not ready yet. Run the Supabase SQL for assessment sessions, then refresh this page.",
    };
  }

  return {
    sessions: (data ?? []).map((session) => session as AssessmentSession),
  };
}

export async function getLatestAssessmentSessionForFamilyCase(
  familyCaseId: string,
): Promise<{ session: AssessmentSession | null; errorMessage?: string }> {
  const { sessions, errorMessage } = await getAssessmentSessionsForFamilyCase(familyCaseId, 1);

  return {
    session: sessions[0] ?? null,
    errorMessage,
  };
}

function isSaveableAssessmentResult(result: AssessmentResult) {
  return Boolean(
    result &&
      result.primaryPathway &&
      result.urgencyLevel &&
      Array.isArray(result.answers) &&
      Array.isArray(result.actionPlanSteps) &&
      result.completedAt,
  );
}
