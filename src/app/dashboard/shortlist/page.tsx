import Link from "next/link";

import { ShortlistedProviderNotes } from "@/components/dashboard/shortlisted-provider-notes";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { getPublishedProvidersWithFallback } from "@/lib/admin/provider-admin-actions";
import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";
import { getShortlistedProvidersForFamilyCase } from "@/lib/providers/provider-actions";
import {
  formatCurrency,
  formatDailyPayment,
  attachProviderDetails,
} from "@/lib/providers/provider-utils";
import { shortlistStatusLabels } from "@/lib/providers/types";

export const dynamic = "force-dynamic";

export default async function DashboardShortlistPage() {
  const { familyCase, errorMessage: familyCaseError } = await getActiveFamilyCase();

  if (!familyCase) {
    return (
      <EmptyShortlistPage
        title="Create a family case before saving providers."
        description={
          familyCaseError ??
          "KinHarbour needs a family case so saved providers can be attached to the aged care journey you are organising."
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

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[#146c60]">Family shortlist</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
              Shortlisted providers for {familyCase.care_recipient_name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone-700">
              Keep track of providers the family wants to consider, review, contact, or rule
              out. KinHarbour does not endorse or recommend a specific provider.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/compare"
              className="rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
            >
              Compare homes
            </Link>
            <Link
              href="/providers"
              className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
            >
              Browse more providers
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <DisclaimerBox title="Provider information">
          <p>
            Provider records are informational and indicative only. Families should
            verify services, fees, ratings, and availability directly with providers and
            official sources before making decisions.
            {providerContent.isFallback
              ? " This page is matching against local fictional fallback data."
              : " This page is matching against admin-published Supabase provider records."}
          </p>
        </DisclaimerBox>
      </div>

      {errorMessage ? (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          {errorMessage}
        </p>
      ) : null}

      {providersWithDetails.length === 0 ? (
        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-3xl font-semibold text-stone-950">No providers saved yet.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-700">
            Browse the provider directory and save homes to the family shortlist when
            they look worth reviewing.
          </p>
          <Link
            href="/providers"
            className="mt-6 inline-flex rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            Browse providers
          </Link>
        </section>
      ) : (
        <section className="mt-8 grid gap-5">
          {providersWithDetails.map((item) => (
            <article key={item.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#146c60]">
                        {item.provider.suburb}, {item.provider.state} {item.provider.postcode}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-stone-950">
                        <Link href={`/providers/${item.provider.id}`} className="hover:text-[#146c60]">
                          {item.provider.name}
                        </Link>
                      </h2>
                    </div>
                    <span className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-stone-800">
                      {shortlistStatusLabels[item.status]}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.provider.careTypes.map((careType) => (
                      <span
                        key={careType}
                        className="rounded-md bg-[#e7f2ee] px-2 py-1 text-xs font-semibold text-[#146c60]"
                      >
                        {careType}
                      </span>
                    ))}
                  </div>

                  <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    <SummaryItem label="Star rating" value={`${item.provider.starRating.toFixed(1)} / 5`} />
                    <SummaryItem label="Indicative RAD" value={formatCurrency(item.provider.estimatedRAD)} />
                    <SummaryItem label="Indicative DAP" value={formatDailyPayment(item.provider.estimatedDAP)} />
                    <SummaryItem label="Status" value={shortlistStatusLabels[item.status]} />
                  </dl>
                </div>

                <ShortlistedProviderNotes shortlistItem={item} />
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function EmptyShortlistPage({
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
        <p className="text-sm font-semibold uppercase text-[#146c60]">Family shortlist</p>
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
      <dd className="mt-1 font-semibold text-stone-950">{value}</dd>
    </div>
  );
}
