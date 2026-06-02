import Link from "next/link";

import { ActionPlanCard } from "@/components/dashboard/action-plan-card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { NoteTypeBadge } from "@/components/dashboard/note-type-badge";
import { ShortlistCard } from "@/components/dashboard/shortlist-card";
import { TaskStatusBadge } from "@/components/dashboard/task-status-badge";
import {
  carePathwayLabels,
  type AssessmentSession,
  urgencyLabels,
} from "@/lib/assessment/types";
import {
  currentStatusLabels,
  type FamilyCase,
  type FamilyMember,
  type FamilyNote,
  type FamilyTask,
  livingSituationLabels,
  relationshipLabels,
  taskCategoryLabels,
} from "@/lib/dashboard/types";
import type { ShortlistedProviderWithDetails } from "@/lib/providers/types";

type FamilyCaseOverviewProps = {
  familyCase: FamilyCase;
  latestAssessmentSession: AssessmentSession | null;
  shortlistedProviders: ShortlistedProviderWithDetails[];
  familyMembers: FamilyMember[];
  tasks: FamilyTask[];
  notes: FamilyNote[];
};

export function FamilyCaseOverview({
  familyCase,
  latestAssessmentSession,
  shortlistedProviders,
  familyMembers,
  tasks,
  notes,
}: FamilyCaseOverviewProps) {
  const location = [familyCase.care_recipient_suburb, familyCase.care_recipient_state]
    .filter(Boolean)
    .join(", ");
  const primaryPathwayLabel = latestAssessmentSession
    ? carePathwayLabels[latestAssessmentSession.primary_pathway]
    : formatStoredPathway(familyCase.primary_pathway);
  const urgencyLabel = latestAssessmentSession
    ? urgencyLabels[latestAssessmentSession.urgency_level]
    : formatStoredUrgency(familyCase.urgency_level);
  const openTasks = tasks.filter((task) => task.status !== "done").slice(0, 3);
  const recentNotes = notes.slice(0, 3);

  return (
    <>
      <section className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-[#146c60]">Care recipient</p>
              <h2 className="mt-3 text-3xl font-semibold text-stone-950">
                {familyCase.care_recipient_name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                KinHarbour is organising this aged care journey around the practical
                next steps for your {relationshipLabels[familyCase.relationship_to_user].toLowerCase()}.
              </p>
            </div>
            <Link
              href="/dashboard/settings"
              className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
            >
              Edit details
            </Link>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <SummaryItem label="Location" value={location || "Not added yet"} />
            <SummaryItem
              label="Living situation"
              value={livingSituationLabels[familyCase.current_living_situation]}
            />
            <SummaryItem label="Current status" value={currentStatusLabels[familyCase.current_status]} />
            <SummaryItem label="Primary pathway" value={primaryPathwayLabel} />
            <SummaryItem label="Urgency" value={urgencyLabel} />
          </dl>
        </article>

        <ActionPlanCard session={latestAssessmentSession} />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          eyebrow="Pathway"
          title="Assessment and action plan"
          body="Review the saved assessment outcome and use it to organise a plain-English action plan."
          href="/assessment"
          cta="Start or continue"
        />
        <ShortlistCard shortlistedProviders={shortlistedProviders} />
        <DashboardCard
          eyebrow="Decision"
          title="Compare homes"
          body="Compare up to five saved homes from the family shortlist side by side."
          href="/dashboard/compare"
          cta="Open compare"
        />
        <DashboardCard
          eyebrow="Family"
          title="Family collaboration"
          body={`${familyMembers.length} family member${familyMembers.length === 1 ? "" : "s"} can coordinate this journey. Invite siblings, spouses, relatives, or carers helping with practical follow-up.`}
          href="/dashboard/family"
          cta="View family"
        />
        <DashboardCard
          eyebrow="Tasks"
          title="Open tasks"
          body={
            openTasks.length === 0
              ? "No open tasks yet. Add shared follow-ups for calls, documents, tours, costs, or family decisions."
              : `${openTasks.length} open task${openTasks.length === 1 ? "" : "s"} need family follow-up.`
          }
          href="/dashboard/tasks"
          cta="View tasks"
        >
          {openTasks.length > 0 ? (
            <ul className="space-y-3">
              {openTasks.map((task) => (
                <li key={task.id} className="rounded-md bg-[#f8f5ef] p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <TaskStatusBadge status={task.status} />
                    {task.category ? (
                      <span className="text-xs font-semibold text-stone-500">
                        {taskCategoryLabels[task.category]}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-stone-950">{task.title}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </DashboardCard>
        <DashboardCard
          eyebrow="Notes"
          title="Recent notes"
          body={
            recentNotes.length === 0
              ? "No shared notes yet. Capture provider calls, family discussions, tour impressions, and questions to verify."
              : `${recentNotes.length} recent note${recentNotes.length === 1 ? "" : "s"} added to the family case.`
          }
          href="/dashboard/notes"
          cta="View notes"
        >
          {recentNotes.length > 0 ? (
            <ul className="space-y-3">
              {recentNotes.map((note) => (
                <li key={note.id} className="rounded-md bg-[#f8f5ef] p-3">
                  <NoteTypeBadge noteType={note.note_type} />
                  <p className="mt-2 text-sm font-semibold text-stone-950">
                    {note.title || "Untitled note"}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </DashboardCard>
        <DashboardCard
          eyebrow="Costs"
          title="Cost planning"
          body="Use the public RAD/DAP modeller for indicative accommodation payment planning."
          href="/costs"
          cta="Estimate costs"
        />
      </section>
    </>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-normal text-stone-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-stone-900">{value}</dd>
    </div>
  );
}

function formatStoredPathway(pathway: string | null) {
  if (!pathway) {
    return "Not set yet";
  }

  return carePathwayLabels[pathway as keyof typeof carePathwayLabels] ?? "Not set yet";
}

function formatStoredUrgency(urgency: string | null) {
  if (!urgency) {
    return "Not set yet";
  }

  return urgencyLabels[urgency as keyof typeof urgencyLabels] ?? "Not set yet";
}
