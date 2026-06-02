import Link from "next/link";

import { CostExplainer } from "@/components/costs/cost-explainer";
import { RadDapCalculator } from "@/components/costs/rad-dap-calculator";
import { DisclaimerBox } from "@/components/disclaimer-box";

export default function CostsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-[#146c60]">Aged care costs</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
            Estimate aged care accommodation costs
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-700">
            Model how a Refundable Accommodation Deposit, a lump sum payment, and a
            daily accommodation payment could work together. This is an indicative
            estimate only, designed to help families understand the moving parts before
            speaking with providers and advisers.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/compare"
              className="rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
            >
              Compare providers
            </Link>
            <Link
              href="/assessment"
              className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
            >
              Start assessment
            </Link>
          </div>
        </div>

        <DisclaimerBox title="Indicative estimate only">
          <p>
            This calculator is not a quote and does not determine actual fees. Actual costs
            may differ based on provider pricing, government rules, means assessment, and
            personal circumstances. It does not replace My Aged Care, Services Australia,
            a provider quote, or independent financial advice.
          </p>
        </DisclaimerBox>
      </section>

      <section className="mt-10">
        <CostExplainer />
      </section>

      <section className="mt-10">
        <RadDapCalculator />
      </section>

      <section className="mt-10 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-stone-500">Assumptions and limitations</p>
        <h2 className="mt-3 text-2xl font-semibold text-stone-950">
          What this modeller does and does not include
        </h2>
        <div className="mt-5 grid gap-4 text-sm leading-6 text-stone-700 md:grid-cols-2">
          <article className="rounded-lg bg-[#f8f5ef] p-4">
            <h3 className="font-semibold text-stone-950">Included in the estimate</h3>
            <p className="mt-2">
              The unpaid RAD balance, your interest rate assumption, the estimated DAP,
              and optional daily fees you enter.
            </p>
          </article>
          <article className="rounded-lg bg-[#f8f5ef] p-4">
            <h3 className="font-semibold text-stone-950">Not included in the estimate</h3>
            <p className="mt-2">
              Means-tested care fees, changing provider pricing, negotiated arrangements,
              personal financial circumstances, or any future rule changes.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
