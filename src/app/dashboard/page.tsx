import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getLatestAssessmentSessionForFamilyCase } from "@/lib/assessment/assessment-actions";
import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";
import { getFamilyMembersForCase } from "@/lib/dashboard/family-actions";
import { getNotesForFamilyCase } from "@/lib/dashboard/note-actions";
import { getTasksForFamilyCase } from "@/lib/dashboard/task-actions";
import { getPublishedProvidersWithFallback } from "@/lib/admin/provider-admin-actions";
import { getShortlistedProvidersForFamilyCase } from "@/lib/providers/provider-actions";
import { attachProviderDetails } from "@/lib/providers/provider-utils";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) {
    redirect("/login?error=supabase-not-configured");
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userMetadata = claims?.user_metadata as
    | {
        full_name?: string | null;
      }
    | undefined;
  const { familyCase, errorMessage } = await getActiveFamilyCase();
  const { session: latestAssessmentSession, errorMessage: assessmentErrorMessage } = familyCase
    ? await getLatestAssessmentSessionForFamilyCase(familyCase.id)
    : { session: null, errorMessage: undefined };
  const { shortlistedProviders, errorMessage: shortlistErrorMessage } = familyCase
    ? await getShortlistedProvidersForFamilyCase(familyCase.id)
    : { shortlistedProviders: [], errorMessage: undefined };
  const { members: familyMembers, errorMessage: familyMembersErrorMessage } = familyCase
    ? await getFamilyMembersForCase(familyCase.id)
    : { members: [], errorMessage: undefined };
  const { tasks, errorMessage: tasksErrorMessage } = familyCase
    ? await getTasksForFamilyCase(familyCase.id, 10)
    : { tasks: [], errorMessage: undefined };
  const { notes, errorMessage: notesErrorMessage } = familyCase
    ? await getNotesForFamilyCase(familyCase.id, 10)
    : { notes: [], errorMessage: undefined };
  const providerContent = await getPublishedProvidersWithFallback();

  return (
    <DashboardShell
      email={claims?.email}
      fullName={userMetadata?.full_name ?? undefined}
      familyCase={familyCase}
      latestAssessmentSession={latestAssessmentSession}
      shortlistedProviders={attachProviderDetails(shortlistedProviders, providerContent.providers)}
      familyMembers={familyMembers}
      tasks={tasks}
      notes={notes}
      loadError={
        errorMessage ??
        assessmentErrorMessage ??
        shortlistErrorMessage ??
        familyMembersErrorMessage ??
        tasksErrorMessage ??
        notesErrorMessage
      }
    />
  );
}
