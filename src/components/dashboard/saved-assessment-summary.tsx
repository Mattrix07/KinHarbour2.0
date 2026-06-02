import Link from "next/link";

import {
  carePathwayLabels,
  type AssessmentSession,
  urgencyLabels,
} from "@/lib/assessment/types";

type SavedAssessmentSummaryProps = {
  session: AssessmentSession;
  showActions?: boolean;
};

export function SavedAssessmentSummary({ session, showActions = true }: SavedAssessmentSummaryProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-[#146c60]">Latest saved assessment</p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-950">
            {carePathwayLabels[session.primary_pathway]}
          </h2>
        </div>
        <span className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-stone-700">
          {urgencyLabels[session.urgency_level]}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-stone-700">{session.result.summary}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <SummaryMetric label="Completed" value={formatDate(session.created_at)} />
        <SummaryMetric label="Next steps" value={String(session.recommended_next_steps.length)} />
        <SummaryMetric label="Secondary pathways" value={String(session.secondary_pathways.length)} />
      </div>

      {showActions ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/action-plan"
            className="rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            View full action plan
          </Link>
          <Link
            href="/assessment"
            className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
          >
            Retake assessment
          </Link>
        </div>
      ) : null}
    </article>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-stone-950">{value}</p>
    </div>
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
