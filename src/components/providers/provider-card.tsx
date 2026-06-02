import Link from "next/link";

import type { Provider } from "@/lib/providers/types";
import type { ShortlistMode } from "@/lib/providers/types";
import {
  formatBoolean,
  formatCurrency,
  formatDailyPayment,
  ratingLabel,
} from "@/lib/providers/provider-utils";

import { CompareButton } from "./compare-button";

type ProviderCardProps = {
  provider: Provider;
  initialIsShortlisted?: boolean;
  shortlistMode?: ShortlistMode;
};

export function ProviderCard({
  provider,
  initialIsShortlisted = false,
  shortlistMode = "logged_out",
}: ProviderCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#146c60]">
            {provider.suburb}, {provider.state} {provider.postcode}
          </p>
          <h2 className="mt-2 text-xl font-semibold leading-snug text-stone-950">{provider.name}</h2>
        </div>
        <span className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-stone-800">
          {provider.starRating.toFixed(1)} / 5
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-stone-700">{provider.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {provider.careTypes.slice(0, 3).map((careType) => (
          <span key={careType} className="rounded-md bg-[#e7f2ee] px-2 py-1 text-xs font-semibold text-[#146c60]">
            {careType}
          </span>
        ))}
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-stone-500">Dementia support</dt>
          <dd className="mt-1 text-stone-900">{formatBoolean(provider.dementiaSupport)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-stone-500">Respite</dt>
          <dd className="mt-1 text-stone-900">{formatBoolean(provider.respiteAvailable)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-stone-500">Indicative RAD</dt>
          <dd className="mt-1 text-stone-900">{formatCurrency(provider.estimatedRAD)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-stone-500">Indicative DAP</dt>
          <dd className="mt-1 text-stone-900">{formatDailyPayment(provider.estimatedDAP)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs font-medium text-stone-500">
        Demo rating: {ratingLabel(provider.starRating)}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
        <Link
          href={`/providers/${provider.id}`}
          className="flex-1 rounded-md border border-stone-300 bg-white px-4 py-2 text-center text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
        >
          View provider
        </Link>
        <CompareButton
          providerId={provider.id}
          className="flex-1"
          initialIsShortlisted={initialIsShortlisted}
          shortlistMode={shortlistMode}
        />
      </div>
    </article>
  );
}
