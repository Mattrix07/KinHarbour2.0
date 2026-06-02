"use client";

import { useMemo, useState } from "react";

import { DisclaimerBox } from "@/components/disclaimer-box";
import { providers } from "@/lib/providers/provider-data";
import { filterAndSortProviders } from "@/lib/providers/provider-utils";
import type {
  Provider,
  ProviderFilters as ProviderFiltersValue,
  ShortlistMode,
} from "@/lib/providers/types";

import { ProviderCard } from "./provider-card";
import { ProviderFilters } from "./provider-filters";

const initialFilters: ProviderFiltersValue = {
  search: "",
  careType: "all",
  dementiaSupport: false,
  respiteAvailable: false,
  palliativeCare: false,
  couplesAccommodation: false,
  sortBy: "star-rating",
};

type ProviderDirectoryProps = {
  providerList?: Provider[];
  isFallback?: boolean;
  shortlistMode: ShortlistMode;
  shortlistedProviderIds: string[];
  shortlistMessage?: string;
};

export function ProviderDirectory({
  providerList = providers,
  isFallback = true,
  shortlistMode,
  shortlistedProviderIds,
  shortlistMessage,
}: ProviderDirectoryProps) {
  const [filters, setFilters] = useState<ProviderFiltersValue>(initialFilters);

  const filteredProviders = useMemo(
    () => filterAndSortProviders(providerList, filters),
    [filters, providerList],
  );
  const shortlistedProviderIdSet = useMemo(
    () => new Set(shortlistedProviderIds),
    [shortlistedProviderIds],
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Provider directory</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
          Find and compare aged care homes
        </h1>
        <p className="mt-5 text-lg leading-8 text-stone-700">
          Search provider records, shortlist options, and compare up to five homes side by
          side. This directory is informational only and families should verify provider
          details directly before making decisions.
        </p>
      </section>

      <div className="mt-8">
        <DisclaimerBox title="Provider information">
          <p>
            KinHarbour does not endorse or recommend a specific provider. Families should
            verify services, fees, ratings, availability, and room details with providers
            and official sources.
            {isFallback
              ? " This page is currently showing local fictional fallback data for MVP testing."
              : " This page is showing admin-published provider records from Supabase."}
          </p>
        </DisclaimerBox>
      </div>

      {shortlistMessage ? (
        <p className="mt-6 rounded-md border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm">
          {shortlistMessage}
        </p>
      ) : null}

      <div className="mt-8">
        <ProviderFilters
          filters={filters}
          resultCount={filteredProviders.length}
          onChange={setFilters}
          onClear={() => setFilters(initialFilters)}
        />
      </div>

      {filteredProviders.length > 0 ? (
        <section className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              initialIsShortlisted={shortlistedProviderIdSet.has(provider.id)}
              shortlistMode={shortlistMode}
            />
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-950">No providers match those filters.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-700">
            Try widening the search, clearing one of the support filters, or sorting the full
            provider list before building a shortlist.
          </p>
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="mt-5 rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            Clear filters
          </button>
        </section>
      )}
    </main>
  );
}
