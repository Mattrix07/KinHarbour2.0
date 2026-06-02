import Link from "next/link";

import { DisclaimerBox } from "@/components/disclaimer-box";
import { ComparisonTable } from "@/components/providers/comparison-table";
import { getPublishedProvidersWithFallback } from "@/lib/admin/provider-admin-actions";
import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";
import { getShortlistedProvidersForFamilyCase } from "@/lib/providers/provider-actions";
import { attachProviderDetails } from "@/lib/providers/provider-utils";

export const dynamic = "force-dynamic";

export default async function DashboardComparePage() {
  const { familyCase, errorMessage: familyCaseError } = await getActiveFamilyCase();

  if (!familyCase) {
    return (
      <EmptyComparePage
        title="Create a family case before comparing saved providers."
        description={
          familyCaseError ??
          "KinHarbour needs a family case so provider comparisons can be attached to the aged care journey you are organising."
        }
        ctaHref="/dashboard"
        ctaLabel="Go to dashboard"
      />
    );
  }

  const { shortlistedProviders, errorMessage } =
    await getShortlistedProvidersForFamilyCase(familyCase.id);
  const providerContent = await getPublishedProvidersWithFallback();
  const providersWithDetails = attachProviderDetails(shortlistedProviders, providerContent.providers);
  const availableProviders = providersWithDetails.map((item) => item.provider);

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[#146c60]">Dashboard compare</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
              Compare saved homes for {familyCase.care_recipient_name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone-700">
              Choose up to five homes from the family shortlist and compare provider
              details side by side. This helps organise family review; it does not endorse
              or recommend a provider.
            </p>
          </div>
          <Link
            href="/providers"
            className="rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            Browse providers
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <DisclaimerBox title="Provider comparison only">
          <p>
            Provider records are informational and indicative only. Availability is not
            real-time. Families should verify services, ratings, fees, and room details
            directly with providers and official sources.
            {providerContent.isFallback
              ? " This comparison is matching against local fictional fallback data."
              : " This comparison is matching against admin-published Supabase provider records."}
          </p>
        </DisclaimerBox>
      </div>

      {errorMessage ? (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-8">
        <ComparisonTable
          mode="dashboard"
          availableProviders={availableProviders}
          initialProviderIds={availableProviders.map((provider) => provider.id)}
        />
      </div>
    </main>
  );
}

function EmptyComparePage({
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
        <p className="text-sm font-semibold uppercase text-[#146c60]">Dashboard compare</p>
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
