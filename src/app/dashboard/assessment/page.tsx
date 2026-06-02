import Link from "next/link";

import { SavedAssessmentSummary } from "@/components/dashboard/saved-assessment-summary";
import { getAssessmentSessionsForFamilyCase } from "@/lib/assessment/assessment-actions";
import { carePathwayLabels, urgencyLabels } from "@/lib/assessment/types";
import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";

export const dynamic = "force-dynamic";

export default async function DashboardAssessmentPage() {
  const { familyCase, errorMessage: familyCaseError } = await getActiveFamilyCase();

  if (!familyCase) {
    return (
      <EmptyAssessmentPage
        title="Create a family case before saving assessments."
        description={
          familyCaseError ??
          "KinHarbour needs a family case before it can attach assessment results to the person you are helping."
        }
        ctaHref="/dashboard"
        ctaLabel="Go to dashboard"
      />
    );
  }

  const { sessions, errorMessage } = await getAssessmentSessionsForFamilyCase(familyCase.id);
  const latestSession = sessions[0] ?? null;

  if (!latestSession) {
    return (
      <EmptyAssessmentPage
        title="No saved assessment yet."
        description={
          errorMessage ??
          "Complete the assessment while logged in to save the likely pathway and action-plan steps to this family case."
        }
        ctaHref="/assessment"
        ctaLabel="Start assessment"
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[#146c60]">Saved assessment</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
              Assessment history for {familyCase.care_recipient_name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone-700">
              Review saved KinHarbour assessment results. These are general pathway
              recommendations and do not determine eligibility or replace professional advice.
            </p>
          </div>
          <Link
            href="/assessment"
            className="rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            Retake assessment
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <SavedAssessmentSummary session={latestSession} />
      </section>

      <section className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">Assessment history</h2>
        <div className="mt-5 divide-y divide-stone-200">
          {sessions.map((session) => (
            <article key={session.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-semibold text-stone-950">
                  {carePathwayLabels[session.primary_pathway]}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {formatDate(session.created_at)} · {urgencyLabels[session.urgency_level]}
                </p>
              </div>
              <Link
                href="/dashboard/action-plan"
                className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
              >
                View latest plan
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function EmptyAssessmentPage({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Saved assessment</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-950">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">{description}</p>
        <Link
          href={ctaHref}
          className="mt-6 inline-flex rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          {ctaLabel}
        </Link>
      </section>
    </main>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
