import Link from "next/link";

import { DisclaimerBox } from "@/components/disclaimer-box";
import { getLatestAssessmentSessionForFamilyCase } from "@/lib/assessment/assessment-actions";
import {
  assessmentDisclaimer,
  carePathwayLabels,
  type AssessmentFlag,
  urgencyLabels,
} from "@/lib/assessment/types";
import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";

export const dynamic = "force-dynamic";

const riskFlagLabels: Record<AssessmentFlag, string> = {
  immediate_safety_risk: "Immediate safety may need attention",
  recent_hospital_or_decline: "Recent hospital stay or decline",
  hospital_discharge_now: "Hospital discharge timing",
  high_personal_care_need: "Higher personal care needs",
  cognitive_safety_concern: "Memory or confusion safety concern",
  carer_strain: "Family or carer strain",
  my_aged_care_needed: "My Aged Care status to confirm",
  cost_concern: "Cost questions to clarify",
  location_unclear: "Location or coordination complexity",
};

export default async function DashboardActionPlanPage() {
  const { familyCase, errorMessage: familyCaseError } = await getActiveFamilyCase();

  if (!familyCase) {
    return (
      <EmptyActionPlanPage
        title="Create a family case before saving an action plan."
        description={
          familyCaseError ??
          "KinHarbour needs a family case so the assessment result can be attached to the aged care journey you are organising."
        }
        ctaHref="/dashboard"
        ctaLabel="Go to dashboard"
      />
    );
  }

  const { session, errorMessage } = await getLatestAssessmentSessionForFamilyCase(familyCase.id);

  if (!session) {
    return (
      <EmptyActionPlanPage
        title="No saved action plan yet."
        description={
          errorMessage ??
          "Complete the assessment while logged in to save the likely pathway and next steps to this family case."
        }
        ctaHref="/assessment"
        ctaLabel="Start assessment"
      />
    );
  }

  const result = session.result;

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[#146c60]">Dashboard action plan</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
              Action plan for {familyCase.care_recipient_name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone-700">
              This plan is based on the latest saved KinHarbour assessment. It is a
              practical guide for organising next steps, not a formal decision about care.
            </p>
          </div>
          <Link
            href="/assessment"
            className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
          >
            Retake assessment
          </Link>
        </div>

        <dl className="mt-8 grid gap-3 md:grid-cols-3">
          <SummaryItem label="Latest assessment" value={formatDate(session.created_at)} />
          <SummaryItem label="Likely pathway" value={carePathwayLabels[session.primary_pathway]} />
          <SummaryItem label="Urgency" value={urgencyLabels[session.urgency_level]} />
        </dl>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-[#146c60]">Explanation</p>
          <h2 className="mt-3 text-2xl font-semibold text-stone-950">{result.headline}</h2>
          <p className="mt-4 text-base leading-7 text-stone-700">{result.summary}</p>
        </article>

        <article className="rounded-lg border border-stone-200 bg-[#f1eadf] p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-[#146c60]">Risk flags</p>
          {session.risk_flags.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {session.risk_flags.map((flag) => (
                <li key={flag} className="rounded-md bg-white px-3 py-2 text-sm font-medium text-stone-800">
                  {riskFlagLabels[flag] ?? flag}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm leading-6 text-stone-700">
              No specific risk flags were saved from this assessment. Keep checking timing,
              safety, and professional guidance as circumstances change.
            </p>
          )}
        </article>
      </section>

      <section className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Recommended next steps</p>
        <div className="mt-5 space-y-3">
          {result.actionPlanSteps.map((step, index) => (
            <article key={step.id} className="rounded-lg bg-[#f8f5ef] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#d8eee7] text-sm font-semibold text-[#146c60]">
                  {index + 1}
                </span>
                <h2 className="text-base font-semibold text-stone-950">{step.title}</h2>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold uppercase text-stone-500">
                  {step.priority}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-700">{step.description}</p>
              {step.href ? (
                <Link
                  href={step.href}
                  className="mt-3 inline-flex text-sm font-semibold text-[#146c60] hover:text-[#0f5148]"
                >
                  Open related page
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Secondary pathways</p>
        {session.secondary_pathways.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {session.secondary_pathways.map((pathway) => (
              <span key={pathway} className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-stone-800">
                {carePathwayLabels[pathway]}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-stone-700">
            No strong secondary pathway was saved for this assessment.
          </p>
        )}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <ActionLink href="/providers" label="Browse providers" />
        <ActionLink href="/compare" label="Compare homes" />
        <ActionLink href="/costs" label="View costs" />
      </section>

      <div className="mt-8">
        <DisclaimerBox>
          <p>
            {assessmentDisclaimer} This action plan is general navigation support. Verify
            important details with My Aged Care, providers, Services Australia, and relevant
            medical, legal, or financial professionals.
          </p>
        </DisclaimerBox>
      </div>
    </main>
  );
}

function EmptyActionPlanPage({
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
        <p className="text-sm font-semibold uppercase text-[#146c60]">Dashboard action plan</p>
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

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-normal text-stone-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-stone-950">{value}</dd>
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-stone-200 bg-white p-5 text-base font-semibold text-stone-950 shadow-sm transition hover:-translate-y-0.5 hover:border-[#146c60] hover:text-[#146c60] hover:shadow-md"
    >
      {label}
    </Link>
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
