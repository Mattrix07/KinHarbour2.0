import Link from "next/link";
import { notFound } from "next/navigation";

import { DisclaimerBox } from "@/components/disclaimer-box";
import { CompareButton } from "@/components/providers/compare-button";
import { ProviderRatingSummary } from "@/components/providers/provider-rating-summary";
import { getPublicProviderByIdWithFallback } from "@/lib/admin/provider-admin-actions";
import { providers } from "@/lib/providers/provider-data";
import { getShortlistContext } from "@/lib/providers/provider-actions";
import {
  formatBoolean,
  formatCurrency,
  formatDailyPayment,
  formatProviderDate,
} from "@/lib/providers/provider-utils";

type ProviderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return providers.map((provider) => ({
    id: provider.id,
  }));
}

export default async function ProviderDetailPage({ params }: ProviderDetailPageProps) {
  const { id } = await params;
  const [{ provider, isFallback }, shortlistContext] = await Promise.all([
    getPublicProviderByIdWithFallback(id),
    getShortlistContext(),
  ]);

  if (!provider) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Link href="/providers" className="text-sm font-semibold text-[#146c60] hover:text-[#0f5148]">
            Back to provider directory
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase text-[#146c60]">Provider profile</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
            {provider.name}
          </h1>
          <p className="mt-4 text-lg leading-8 text-stone-700">
            {provider.suburb}, {provider.state} {provider.postcode}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-700">
            {provider.description}
          </p>
        </div>

        <aside className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-stone-500">Shortlist action</p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-950">Review this home</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Save this home to your shortlist, then review it alongside other options.
            KinHarbour does not endorse or recommend a specific provider.
          </p>
          <CompareButton
            providerId={provider.id}
            className="mt-5"
            initialIsShortlisted={shortlistContext.shortlistedProviders.some(
              (item) => item.provider_id === provider.id,
            )}
            shortlistMode={shortlistContext.mode}
          />
          {shortlistContext.message ? (
            <p className="mt-3 text-xs font-medium leading-5 text-stone-600">
              {shortlistContext.message}
            </p>
          ) : null}
          <Link
            href="/compare"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
          >
            Compare selected homes
          </Link>
        </aside>
      </section>

      <div className="mt-8">
        <DisclaimerBox title="Verify before deciding">
          <p>
            Provider information is informational and may be incomplete or out of date.
            Families should verify all services, ratings, fees, room details, and
            availability directly with the provider and official sources.
            {isFallback || provider.isDemoData
              ? " This profile is using fictional demo data for MVP testing."
              : " This profile is using admin-published Supabase content."}
          </p>
        </DisclaimerBox>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">Care and accommodation</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <DetailRow label="Care types" value={provider.careTypes.join(", ")} />
              <DetailRow label="Room types" value={provider.roomTypes.join(", ")} />
              <DetailRow label="Dementia support" value={formatBoolean(provider.dementiaSupport)} />
              <DetailRow label="Respite availability" value={formatBoolean(provider.respiteAvailable)} />
              <DetailRow label="Palliative care" value={formatBoolean(provider.palliativeCare)} />
              <DetailRow
                label="Couples accommodation"
                value={formatBoolean(provider.couplesAccommodation)}
              />
            </dl>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">Indicative costs</h2>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-lg bg-[#f8f5ef] p-4">
                <dt className="font-semibold text-stone-500">Estimated RAD</dt>
                <dd className="mt-2 text-2xl font-semibold text-stone-950">
                  {formatCurrency(provider.estimatedRAD)}
                </dd>
              </div>
              <div className="rounded-lg bg-[#f8f5ef] p-4">
                <dt className="font-semibold text-stone-500">Estimated DAP</dt>
                <dd className="mt-2 text-2xl font-semibold text-stone-950">
                  {formatDailyPayment(provider.estimatedDAP)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              These figures are indicative only. Families should verify current fees and
              seek appropriate financial advice where needed.
              {provider.isDemoData ? " This provider record uses fictional demo figures." : null}
            </p>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">Contact details</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <DetailRow label="Phone" value={provider.contactPhone} />
              <DetailRow label="Website" value={provider.website} />
              <DetailRow label="Last verified" value={formatProviderDate(provider.lastVerifiedAt)} />
              <DetailRow label="Data source note" value={provider.dataSourceNote} />
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <ProviderRatingSummary provider={provider} />

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">Features to review</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {provider.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-lg bg-[#f8f5ef] px-4 py-3 text-sm font-semibold text-stone-800"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-stone-200 bg-[#f1eadf] p-5">
            <h2 className="text-xl font-semibold text-stone-950">Questions families may ask</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
              <li>What care needs can the home support now, and what changes would require review?</li>
              <li>Are respite or permanent rooms currently available, and what waiting periods apply?</li>
              <li>How are families kept informed about care plans, incidents, and daily wellbeing?</li>
              <li>What fees and room prices should be confirmed before making a decision?</li>
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-stone-500">{label}</dt>
      <dd className="mt-1 leading-6 text-stone-800">{value}</dd>
    </div>
  );
}
