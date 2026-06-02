import type { RadDapResult, RadDapValidationError } from "@/lib/costs/types";

type CostSummaryCardProps = {
  result: RadDapResult | null;
  validationErrors: RadDapValidationError[];
};

export function CostSummaryCard({ result, validationErrors }: CostSummaryCardProps) {
  if (!result) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-stone-500">Indicative estimate</p>
        <h2 className="mt-3 text-2xl font-semibold text-stone-950">Adjust inputs to see the estimate</h2>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Fix the highlighted inputs and the indicative DAP and monthly estimate will update.
        </p>
        {validationErrors.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {validationErrors.map((error) => (
              <li key={`${error.field}-${error.message}`} className="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-900">
                {error.message}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase text-stone-500">Indicative estimate</p>
      <h2 className="mt-3 text-3xl font-semibold text-stone-950">
        {formatCurrency(result.totalMonthlyCost)}
        <span className="block text-base font-medium text-stone-600">estimated total per month</span>
      </h2>

      <dl className="mt-6 grid gap-3">
        <SummaryRow label="RAD amount" value={formatCurrency(result.radAmount)} />
        <SummaryRow label="Lump sum paid" value={formatCurrency(result.lumpSumPaid)} />
        <SummaryRow label="Unpaid RAD balance" value={formatCurrency(result.unpaidRadBalance)} />
        <SummaryRow label="Estimated DAP per day" value={formatCurrency(result.dailyDap)} strong />
        <SummaryRow label="Estimated DAP per month" value={formatCurrency(result.monthlyDap)} />
        <SummaryRow label="Optional daily fees total" value={formatCurrency(result.optionalDailyFeesTotal)} />
        <SummaryRow label="Estimated total daily cost" value={formatCurrency(result.totalDailyCost)} strong />
      </dl>

      <div className="mt-6 rounded-lg bg-[#f8f5ef] p-4 text-sm leading-6 text-stone-700">
        <p className="font-semibold text-stone-950">Assumptions used</p>
        <ul className="mt-2 space-y-1">
          <li>Interest rate assumption: {result.assumptions.annualInterestRatePercent.toFixed(2)}% per year.</li>
          <li>DAP is estimated using {result.assumptions.daysPerYear} days per year.</li>
          <li>Monthly estimates use {result.assumptions.averageDaysPerMonth.toFixed(4)} average days per month.</li>
        </ul>
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg bg-[#fbf8f2] px-4 py-3">
      <dt className="text-sm font-semibold text-stone-600">{label}</dt>
      <dd className={strong ? "text-right text-base font-semibold text-[#146c60]" : "text-right text-sm font-semibold text-stone-950"}>
        {value}
      </dd>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}
