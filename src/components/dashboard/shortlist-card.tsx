import Link from "next/link";

import type { ShortlistedProviderWithDetails } from "@/lib/providers/types";

type ShortlistCardProps = {
  shortlistedProviders: ShortlistedProviderWithDetails[];
};

export function ShortlistCard({ shortlistedProviders }: ShortlistCardProps) {
  const topProviders = shortlistedProviders.slice(0, 3);

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-normal text-[#146c60]">Providers</p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-stone-950">Shortlisted providers</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            {shortlistedProviders.length === 0
              ? "No providers have been saved to this family case yet."
              : `${shortlistedProviders.length} provider${shortlistedProviders.length === 1 ? "" : "s"} saved for family review.`}
          </p>
        </div>
        <span className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-stone-800">
          {shortlistedProviders.length}
        </span>
      </div>

      {topProviders.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {topProviders.map((item) => (
            <li key={item.id} className="rounded-md bg-[#f8f5ef] px-3 py-2 text-sm text-stone-700">
              <span className="font-semibold text-stone-950">{item.provider.name}</span>
              <span className="block text-xs text-stone-500">{item.provider.suburb}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/dashboard/shortlist"
          className="rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          View full shortlist
        </Link>
        <Link
          href="/dashboard/compare"
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
        >
          Compare shortlisted homes
        </Link>
      </div>
    </article>
  );
}
