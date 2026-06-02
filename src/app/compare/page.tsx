import Link from "next/link";

import { DisclaimerBox } from "@/components/disclaimer-box";
import { ComparisonTable } from "@/components/providers/comparison-table";
import { getPublishedProvidersWithFallback } from "@/lib/admin/provider-admin-actions";

export default async function ComparePage() {
  const { providers, isFallback } = await getPublishedProvidersWithFallback();

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Compare providers</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
          Compare aged care homes side by side
        </h1>
        <p className="mt-5 text-lg leading-8 text-stone-700">
          Review selected homes across care types, support indicators, ratings,
          indicative costs, and features. This comparison helps families organise questions;
          it does not endorse or recommend a specific provider.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/providers"
            className="rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            Browse providers
          </Link>
          <Link
            href="/costs"
            className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
          >
            Understand costs
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <DisclaimerBox title="Provider comparison only">
          <p>
            {isFallback
              ? "Provider data is fictional fallback demo data for MVP testing. "
              : "Provider data is admin-published content from Supabase. "}
            Provider data is indicative only. Families should verify all information, fees,
            services, ratings, and availability with the provider and official sources
            before making decisions.
          </p>
        </DisclaimerBox>
      </div>

      <div className="mt-8">
        <ComparisonTable providerCatalog={providers} />
      </div>
    </main>
  );
}
