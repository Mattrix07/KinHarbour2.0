"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { maxComparedProviders, type Provider } from "@/lib/providers/types";
import {
  formatBoolean,
  formatCurrency,
  formatDailyPayment,
  formatProviderDate,
  getComparedProviders,
} from "@/lib/providers/provider-utils";

import { useComparisonList } from "./use-comparison-list";

type ComparisonTableProps = {
  mode?: "public" | "dashboard";
  availableProviders?: Provider[];
  initialProviderIds?: string[];
  providerCatalog?: Provider[];
};

export function ComparisonTable({
  mode = "public",
  availableProviders = [],
  initialProviderIds = [],
  providerCatalog,
}: ComparisonTableProps) {
  const isDashboardMode = mode === "dashboard";
  const comparisonCatalog = providerCatalog ?? availableProviders;
  const [dashboardProviderIds, setDashboardProviderIds] = useState(() =>
    initialProviderIds.slice(0, maxComparedProviders),
  );
  const { providerIds: localProviderIds, removeProvider, isReady } =
    useComparisonList(comparisonCatalog);
  const providerIds = isDashboardMode ? dashboardProviderIds : localProviderIds;
  const comparedProviders =
    comparisonCatalog.length > 0
      ? getComparedProviders(providerIds, comparisonCatalog)
      : getComparedProviders(providerIds);
  const availableProviderMap = useMemo(
    () => new Map(availableProviders.map((provider) => [provider.id, provider])),
    [availableProviders],
  );

  if (!isDashboardMode && !isReady) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-stone-600">Loading your comparison list...</p>
      </div>
    );
  }

  if (isDashboardMode && availableProviders.length === 0) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Dashboard comparison</p>
        <h2 className="mt-3 text-3xl font-semibold text-stone-950">
          No shortlisted providers yet.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-700">
          Save providers to the family shortlist first, then compare up to {maxComparedProviders}
          homes side by side here.
        </p>
        <Link
          href="/providers"
          className="mt-6 inline-flex rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          Browse providers
        </Link>
      </section>
    );
  }

  if (comparedProviders.length === 0) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase text-[#146c60]">
          {isDashboardMode ? "Dashboard comparison" : "Comparison list"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-stone-950">
          No providers are selected yet.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-700">
          {isDashboardMode
            ? `Choose up to ${maxComparedProviders} homes from the saved family shortlist to compare.`
            : `Browse the fictional provider directory and add up to ${maxComparedProviders} homes to review side by side.`}
        </p>
        <Link
          href="/providers"
          className="mt-6 inline-flex rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          Browse providers
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {isDashboardMode ? (
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-stone-950">Choose homes to compare</h2>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                Select up to {maxComparedProviders} providers from the saved family shortlist.
              </p>
            </div>
            <span className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-stone-700">
              {dashboardProviderIds.length} of {maxComparedProviders}
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {availableProviders.map((provider) => {
              const selected = dashboardProviderIds.includes(provider.id);
              const wouldExceedLimit = !selected && dashboardProviderIds.length >= maxComparedProviders;

              return (
                <label
                  key={provider.id}
                  className={[
                    "flex cursor-pointer gap-3 rounded-lg border p-4 text-sm shadow-sm transition",
                    selected
                      ? "border-[#146c60] bg-[#e7f2ee]"
                      : "border-stone-200 bg-white hover:border-[#146c60]/70",
                    wouldExceedLimit ? "cursor-not-allowed opacity-60" : "",
                  ].join(" ")}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={wouldExceedLimit}
                    onChange={() => toggleDashboardProvider(provider.id)}
                    className="mt-1 h-4 w-4 rounded border-stone-300 text-[#146c60]"
                  />
                  <span>
                    <span className="block font-semibold text-stone-950">{provider.name}</span>
                    <span className="mt-1 block text-stone-600">
                      {provider.suburb} · {provider.starRating.toFixed(1)} / 5
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950">Selected homes</h2>
          <p className="mt-1 text-sm text-stone-600">
            Comparing {comparedProviders.length} of {maxComparedProviders} homes.
          </p>
        </div>
        <Link
          href="/providers"
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
        >
          Return to provider directory
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-[980px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 rounded-tl-lg border-b border-stone-200 bg-[#f8f5ef] px-4 py-3 font-semibold text-stone-700">
                Comparison point
              </th>
              {comparedProviders.map((provider) => (
                <th
                  key={provider.id}
                  className="border-b border-stone-200 bg-[#f8f5ef] px-4 py-3 align-top font-semibold text-stone-950"
                >
                  <Link href={`/providers/${provider.id}`} className="hover:text-[#146c60]">
                    {provider.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemoveFromComparison(provider.id)}
                    className="mt-3 block rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-[#146c60] hover:text-[#146c60]"
                  >
                    Remove from comparison
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ComparisonRow
              label="Suburb"
              values={comparedProviders.map((provider) => provider.suburb)}
            />
            <ComparisonRow
              label="Care types"
              values={comparedProviders.map((provider) => provider.careTypes.join(", "))}
            />
            <ComparisonRow
              label="Dementia support"
              values={comparedProviders.map((provider) => formatBoolean(provider.dementiaSupport))}
            />
            <ComparisonRow
              label="Respite availability"
              values={comparedProviders.map((provider) => formatBoolean(provider.respiteAvailable))}
            />
            <ComparisonRow
              label="Palliative care"
              values={comparedProviders.map((provider) => formatBoolean(provider.palliativeCare))}
            />
            <ComparisonRow
              label="Couples accommodation"
              values={comparedProviders.map((provider) => formatBoolean(provider.couplesAccommodation))}
            />
            <ComparisonRow
              label="Star rating"
              values={comparedProviders.map((provider) => `${provider.starRating.toFixed(1)} / 5`)}
            />
            <ComparisonRow
              label="Compliance rating"
              values={comparedProviders.map((provider) => `${provider.complianceRating.toFixed(1)} / 5`)}
            />
            <ComparisonRow
              label="Staffing rating"
              values={comparedProviders.map((provider) => `${provider.staffingRating.toFixed(1)} / 5`)}
            />
            <ComparisonRow
              label="Resident experience"
              values={comparedProviders.map(
                (provider) => `${provider.residentExperienceRating.toFixed(1)} / 5`,
              )}
            />
            <ComparisonRow
              label="Estimated RAD"
              values={comparedProviders.map((provider) => formatCurrency(provider.estimatedRAD))}
            />
            <ComparisonRow
              label="Estimated DAP"
              values={comparedProviders.map((provider) => formatDailyPayment(provider.estimatedDAP))}
            />
            <ComparisonRow
              label="Key features"
              values={comparedProviders.map((provider) => provider.features.slice(0, 4).join(", "))}
            />
            <ComparisonRow
              label="Last verified"
              values={comparedProviders.map((provider) => formatProviderDate(provider.lastVerifiedAt))}
            />
          </tbody>
        </table>
      </div>
      </div>
    </section>
  );

  function toggleDashboardProvider(providerId: string) {
    if (!availableProviderMap.has(providerId)) {
      return;
    }

    setDashboardProviderIds((currentIds) => {
      if (currentIds.includes(providerId)) {
        return currentIds.filter((id) => id !== providerId);
      }

      if (currentIds.length >= maxComparedProviders) {
        return currentIds;
      }

      return [...currentIds, providerId];
    });
  }

  function handleRemoveFromComparison(providerId: string) {
    if (isDashboardMode) {
      setDashboardProviderIds((currentIds) => currentIds.filter((id) => id !== providerId));
      return;
    }

    removeProvider(providerId);
  }
}

function ComparisonRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <th className="sticky left-0 z-10 border-b border-stone-200 bg-white px-4 py-4 align-top font-semibold text-stone-700">
        {label}
      </th>
      {values.map((value, index) => (
        <td
          key={`${label}-${index}`}
          className="border-b border-stone-200 px-4 py-4 align-top leading-6 text-stone-700"
        >
          {value}
        </td>
      ))}
    </tr>
  );
}
