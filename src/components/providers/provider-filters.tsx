"use client";

import { careTypeOptions } from "@/lib/providers/provider-utils";
import type { ProviderFilters as ProviderFiltersValue } from "@/lib/providers/types";

type ProviderFiltersProps = {
  filters: ProviderFiltersValue;
  resultCount: number;
  onChange: (filters: ProviderFiltersValue) => void;
  onClear: () => void;
};

export function ProviderFilters({
  filters,
  resultCount,
  onChange,
  onClear,
}: ProviderFiltersProps) {
  function updateFilters(nextFilters: Partial<ProviderFiltersValue>) {
    onChange({ ...filters, ...nextFilters });
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">Search and filter</h2>
          <p className="mt-1 text-sm text-stone-600">{resultCount} providers shown</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-[#146c60] hover:text-[#146c60]"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
        <label className="block">
          <span className="text-sm font-semibold text-stone-700">Provider name or suburb</span>
          <input
            value={filters.search}
            onChange={(event) => updateFilters({ search: event.target.value })}
            placeholder="Search by name, suburb, or postcode"
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-700">Care type</span>
          <select
            value={filters.careType}
            onChange={(event) =>
              updateFilters({ careType: event.target.value as ProviderFiltersValue["careType"] })
            }
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          >
            <option value="all">All care types</option>
            {careTypeOptions.map((careType) => (
              <option key={careType} value={careType}>
                {careType}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-700">Sort by</span>
          <select
            value={filters.sortBy}
            onChange={(event) =>
              updateFilters({ sortBy: event.target.value as ProviderFiltersValue["sortBy"] })
            }
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          >
            <option value="star-rating">Star rating</option>
            <option value="estimated-rad">Estimated RAD low to high</option>
            <option value="suburb">Suburb A-Z</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterCheckbox
          checked={filters.dementiaSupport}
          label="Dementia support"
          onChange={(checked) => updateFilters({ dementiaSupport: checked })}
        />
        <FilterCheckbox
          checked={filters.respiteAvailable}
          label="Respite availability"
          onChange={(checked) => updateFilters({ respiteAvailable: checked })}
        />
        <FilterCheckbox
          checked={filters.palliativeCare}
          label="Palliative care"
          onChange={(checked) => updateFilters({ palliativeCare: checked })}
        />
        <FilterCheckbox
          checked={filters.couplesAccommodation}
          label="Couples accommodation"
          onChange={(checked) => updateFilters({ couplesAccommodation: checked })}
        />
      </div>
    </section>
  );
}

function FilterCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-[#fbf8f2] px-3 py-3 text-sm font-semibold text-stone-800 transition hover:border-[#146c60]/70">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-stone-300 accent-[#146c60]"
      />
      <span>{label}</span>
    </label>
  );
}
