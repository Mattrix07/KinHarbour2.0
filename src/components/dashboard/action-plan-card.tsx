import Link from "next/link";

import {
  carePathwayLabels,
  type AssessmentSession,
  urgencyLabels,
} from "@/lib/assessment/types";

type ActionPlanCardProps = {
  session: AssessmentSession | null;
};

export function ActionPlanCard({ session }: ActionPlanCardProps) {
  if (!session) {
    return (
      <article className="rounded-lg border border-stone-200 bg-[#f1eadf] p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Next best step</p>
        <h2 className="mt-3 text-2xl font-semibold text-stone-950">
          Build the action plan from the assessment.
        </h2>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Complete the assessment to save a likely pathway, urgency level, and practical
          next steps to this family case.
        </p>
        <Link
          href="/assessment"
          className="mt-5 inline-flex rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          Start assessment
        </Link>
      </article>
    );
  }

  return (
    <article className="rounded-lg border border-stone-200 bg-[#f1eadf] p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase text-[#146c60]">Latest assessment result</p>
      <h2 className="mt-3 text-2xl font-semibold text-stone-950">
        {carePathwayLabels[session.primary_pathway]}
      </h2>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        Urgency: <span className="font-semibold">{urgencyLabels[session.urgency_level]}</span>
      </p>
      <ol className="mt-4 space-y-2">
        {session.recommended_next_steps.slice(0, 3).map((step, index) => (
          <li key={step} className="flex gap-3 text-sm leading-6 text-stone-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-xs font-semibold text-[#146c60]">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
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
    </article>
  );
}
