import Link from "next/link";

import {
  carePathwayLabels,
  type AssessmentResult,
  type AssessmentSaveStatus,
  type CarePathway,
  type UrgencyLevel,
  urgencyLabels,
} from "@/lib/assessment/types";

const pathwayDescriptions: Record<CarePathway, string> = {
  support_at_home: "Explore practical support that may help them remain safely at home.",
  residential_care: "Explore whether a residential aged care pathway may fit their needs.",
  respite_care: "Consider short-term care to support the older person and give carers relief.",
  urgent_hospital_discharge: "Focus on a safe transition plan and time-sensitive support.",
  my_aged_care_assessment: "Confirm official assessment status and what services may be available.",
  financial_planning: "Understand cost concepts and when independent financial advice may help.",
  family_coordination: "Clarify family roles, shared tasks, notes, and follow-ups.",
};

const urgencyStyles: Record<UrgencyLevel, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-900",
  medium: "border-amber-200 bg-amber-50 text-amber-900",
  high: "border-rose-200 bg-rose-50 text-rose-900",
};

type ResultsSummaryProps = {
  result: AssessmentResult;
  saveStatus?: AssessmentSaveStatus;
  saveMessage?: string;
};

export function ResultsSummary({ result, saveStatus = "idle", saveMessage }: ResultsSummaryProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <SaveNotice status={saveStatus} message={saveMessage} />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[#146c60]">Assessment results</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-stone-950 sm:text-5xl">
              {result.headline}
            </h1>
          </div>
          <span
            className={`rounded-md border px-3 py-2 text-sm font-semibold ${urgencyStyles[result.urgencyLevel]}`}
          >
            {urgencyLabels[result.urgencyLevel]}
          </span>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-lg border border-stone-200 bg-[#fbf8f2] p-5">
            <p className="text-sm font-semibold uppercase text-stone-500">
              Recommended primary pathway
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-stone-950">
              {carePathwayLabels[result.primaryPathway]}
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-700">{result.summary}</p>
          </article>

          <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-stone-500">General guidance only</p>
            <p className="mt-3 text-sm leading-6 text-stone-700">{result.disclaimer}</p>
            <p className="mt-4 text-xs font-medium text-stone-500">
              Completed {formatCompletedDate(result.completedAt)}
            </p>
          </article>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">Why this may fit</h2>
            <ul className="mt-4 space-y-3">
              {result.reasons.map((reason) => (
                <li key={reason} className="flex gap-3 text-sm leading-6 text-stone-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#146c60]" aria-hidden="true" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">Personalised action plan</h2>
            <div className="mt-4 space-y-3">
              {result.actionPlanSteps.map((step, index) => (
                <article key={step.id} className="rounded-lg bg-[#f8f5ef] p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#d8eee7] text-sm font-semibold text-[#146c60]">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-stone-950">{step.title}</h3>
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
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-stone-200 bg-[#f1eadf] p-5">
          <h2 className="text-xl font-semibold text-stone-950">Secondary pathways to consider</h2>
          {result.secondaryPathways.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {result.secondaryPathways.map((pathway) => (
                <article key={pathway} className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-stone-950">
                    {carePathwayLabels[pathway]}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {pathwayDescriptions[pathway]}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-stone-700">
              No strong secondary pathway was identified from these answers. It may still be
              useful to review My Aged Care status and family preferences.
            </p>
          )}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {result.recommendedNextPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#146c60] hover:shadow-md"
            >
              <span className="text-base font-semibold text-stone-950">{page.label}</span>
              <span className="mt-2 block text-sm leading-6 text-stone-600">{page.description}</span>
            </Link>
          ))}
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/assessment"
            className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
          >
            Retake assessment
          </Link>
          <Link
            href="/dashboard/action-plan"
            className="rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            View dashboard action plan
          </Link>
        </div>
      </section>
    </main>
  );
}

function SaveNotice({ status, message }: { status: AssessmentSaveStatus; message?: string }) {
  if (status === "idle") {
    return null;
  }

  if (status === "checking") {
    return (
      <p className="mb-6 rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
        Checking whether this can be saved to your dashboard...
      </p>
    );
  }

  if (status === "saved") {
    return (
      <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950">
        <p>{message ?? "Your action plan has been saved to your KinHarbour dashboard."}</p>
        <Link href="/dashboard/action-plan" className="mt-2 inline-flex font-semibold text-[#146c60]">
          View saved action plan
        </Link>
      </div>
    );
  }

  if (status === "logged_out") {
    return (
      <div className="mb-6 rounded-md border border-stone-200 bg-[#fbf8f2] px-4 py-3 text-sm text-stone-700">
        <p className="font-medium">{message ?? "Create an account to save this action plan."}</p>
        <Link href="/sign-up" className="mt-2 inline-flex font-semibold text-[#146c60]">
          Create an account
        </Link>
      </div>
    );
  }

  if (status === "no_family_case") {
    return (
      <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p className="font-medium">{message ?? "Create a family case to save this action plan."}</p>
        <Link href="/dashboard" className="mt-2 inline-flex font-semibold text-[#146c60]">
          Create a family case
        </Link>
      </div>
    );
  }

  return (
    <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
      {message ?? "Your result is shown below, but we could not save it to your dashboard."}
    </p>
  );
}

function formatCompletedDate(completedAt: string) {
  const date = new Date(completedAt);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
