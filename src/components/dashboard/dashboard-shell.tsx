import { LogoutButton } from "@/components/auth/logout-button";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { FamilyCaseOverview } from "@/components/dashboard/family-case-overview";
import type { AssessmentSession } from "@/lib/assessment/types";
import type { FamilyCase, FamilyMember, FamilyNote, FamilyTask } from "@/lib/dashboard/types";
import type { ShortlistedProviderWithDetails } from "@/lib/providers/types";

type DashboardShellProps = {
  email?: string;
  fullName?: string;
  familyCase: FamilyCase | null;
  latestAssessmentSession: AssessmentSession | null;
  shortlistedProviders: ShortlistedProviderWithDetails[];
  familyMembers: FamilyMember[];
  tasks: FamilyTask[];
  notes: FamilyNote[];
  loadError?: string;
};

export function DashboardShell({
  email,
  fullName,
  familyCase,
  latestAssessmentSession,
  shortlistedProviders,
  familyMembers,
  tasks,
  notes,
  loadError,
}: DashboardShellProps) {
  const displayName = fullName || email || "there";

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-[#146c60]">Protected dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
              Your KinHarbour dashboard
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone-700">
              Welcome, {displayName}. This protected space helps organise the aged care
              journey for the person your family is supporting.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-8 rounded-lg bg-[#f1eadf] p-5 text-sm leading-6 text-stone-700">
          Family case details, saved assessments, action plans, provider shortlists,
          family members, tasks, and notes are saved with Supabase. KinHarbour helps
          organise decisions; it does not determine eligibility.
        </div>
      </section>

      {familyCase ? (
        <FamilyCaseOverview
          familyCase={familyCase}
          latestAssessmentSession={latestAssessmentSession}
          shortlistedProviders={shortlistedProviders}
          familyMembers={familyMembers}
          tasks={tasks}
          notes={notes}
        />
      ) : (
        <DashboardEmptyState errorMessage={loadError} />
      )}
    </main>
  );
}
