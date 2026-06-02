"use client";

import {
  resourceCategories,
  resourceCategoryLabels,
  type ResourceFilters as ResourceFiltersValue,
} from "@/lib/resources/resource-utils";

type ResourceFiltersProps = {
  filters: ResourceFiltersValue;
  resultCount: number;
  onChange: (filters: ResourceFiltersValue) => void;
  onClear: () => void;
};

export function ResourceFilters({
  filters,
  resultCount,
  onChange,
  onClear,
}: ResourceFiltersProps) {
  function updateFilters(nextFilters: Partial<ResourceFiltersValue>) {
    onChange({ ...filters, ...nextFilters });
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">Search resources</h2>
          <p className="mt-1 text-sm text-stone-600">{resultCount} guides shown</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-[#146c60] hover:text-[#146c60]"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <label className="block">
          <span className="text-sm font-semibold text-stone-700">Search by title or topic</span>
          <input
            value={filters.search}
            onChange={(event) => updateFilters({ search: event.target.value })}
            placeholder="Search guides, topics, or next steps"
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-700">Category</span>
          <select
            value={filters.category}
            onChange={(event) =>
              updateFilters({ category: event.target.value as ResourceFiltersValue["category"] })
            }
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          >
            <option value="all">All categories</option>
            {resourceCategories.map((category) => (
              <option key={category} value={category}>
                {resourceCategoryLabels[category]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <CategoryButton
          active={filters.category === "all"}
          label="All"
          onClick={() => updateFilters({ category: "all" })}
        />
        {resourceCategories.map((category) => (
          <CategoryButton
            key={category}
            active={filters.category === category}
            label={resourceCategoryLabels[category]}
            onClick={() => updateFilters({ category })}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-md px-3 py-2 text-sm font-semibold transition",
        active
          ? "bg-[#146c60] text-white"
          : "border border-stone-300 bg-white text-stone-700 hover:border-[#146c60] hover:text-[#146c60]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
