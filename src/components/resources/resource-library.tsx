"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { DisclaimerBox } from "@/components/disclaimer-box";
import { resourceArticles } from "@/lib/resources/resource-data";
import { filterResources, type ResourceFilters as ResourceFiltersValue } from "@/lib/resources/resource-utils";
import type { ResourceArticle } from "@/lib/resources/types";

import { ResourceCard } from "./resource-card";
import { ResourceFilters } from "./resource-filters";

const initialFilters: ResourceFiltersValue = {
  search: "",
  category: "all",
};

type ResourceLibraryProps = {
  articles?: ResourceArticle[];
  isFallback?: boolean;
};

export function ResourceLibrary({
  articles = resourceArticles,
  isFallback = true,
}: ResourceLibraryProps) {
  const [filters, setFilters] = useState<ResourceFiltersValue>(initialFilters);

  const filteredArticles = useMemo(
    () => filterResources(articles, filters),
    [articles, filters],
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-[#146c60]">Resource library</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
            Aged care guides for families
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-700">
            Plain-English guides to help families understand aged care pathways,
            provider comparison, costs, hospital discharge, respite, and shared family
            decisions. These resources help you prepare questions and next steps; they
            are not official advice.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/assessment"
              className="rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
            >
              Start free assessment
            </Link>
            <Link
              href="/compare"
              className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
            >
              Compare providers
            </Link>
          </div>
        </div>

        <DisclaimerBox title="General guidance only">
          <p>
            KinHarbour resources are general navigation support. They are not official
            government guidance and do not replace My Aged Care, Services Australia,
            provider information, medical, legal, or financial advice.
            {isFallback ? " This page is currently showing local fallback guide content." : null}
          </p>
        </DisclaimerBox>
      </section>

      <div className="mt-8">
        <ResourceFilters
          filters={filters}
          resultCount={filteredArticles.length}
          onChange={setFilters}
          onClear={() => setFilters(initialFilters)}
        />
      </div>

      {filteredArticles.length > 0 ? (
        <section className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => (
            <ResourceCard key={article.id} article={article} />
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-950">No guides match those filters.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-700">
            Try a broader search term, choose another category, or clear the filters to
            see all current KinHarbour guides.
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
