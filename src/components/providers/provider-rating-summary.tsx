import type { Provider } from "@/lib/providers/types";
import { ratingLabel } from "@/lib/providers/provider-utils";

const ratingRows = [
  {
    key: "complianceRating",
    label: "Compliance",
    description: "How the home is tracking against care and safety obligations in this demo record.",
  },
  {
    key: "staffingRating",
    label: "Staffing",
    description: "A simple indicator for staffing strength in this fictional profile.",
  },
  {
    key: "residentExperienceRating",
    label: "Resident experience",
    description: "How residents and families may experience daily life in this demo comparison.",
  },
  {
    key: "qualityMeasuresRating",
    label: "Quality measures",
    description: "A broad quality signal for family comparison, not an official score.",
  },
] satisfies {
  key: keyof Pick<
    Provider,
    "complianceRating" | "staffingRating" | "residentExperienceRating" | "qualityMeasuresRating"
  >;
  label: string;
  description: string;
}[];

export function ProviderRatingSummary({ provider }: { provider: Provider }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-stone-500">Star rating summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-950">
            {provider.starRating.toFixed(1)} out of 5
          </h2>
        </div>
        <span className="rounded-md bg-[#d8eee7] px-3 py-2 text-sm font-semibold text-[#146c60]">
          {ratingLabel(provider.starRating)}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-700">
        These ratings are fictional MVP indicators to help families understand how a
        comparison could work. They are not official ratings and should be verified with
        official sources before making decisions.
      </p>
      <div className="mt-5 grid gap-3">
        {ratingRows.map((row) => {
          const value = provider[row.key];

          return (
            <article key={row.key} className="rounded-lg bg-[#f8f5ef] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-stone-950">{row.label}</h3>
                <span className="text-sm font-semibold text-[#146c60]">
                  {value.toFixed(1)} / 5 · {ratingLabel(value)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">{row.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
