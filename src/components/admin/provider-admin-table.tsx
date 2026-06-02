"use client";

import Link from "next/link";

import { PublishStatusBadge } from "@/components/admin/publish-status-badge";
import {
  deleteProvider,
  toggleProviderPublished,
} from "@/lib/admin/provider-admin-actions";
import type { AdminProvider } from "@/lib/admin/types";
import {
  formatCurrency,
  formatDailyPayment,
  formatProviderDate,
} from "@/lib/providers/provider-utils";

export function ProviderAdminTable({ providers }: { providers: AdminProvider[] }) {
  if (providers.length === 0) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">No provider records yet.</h2>
        <Link
          href="/admin/providers/new"
          className="mt-5 inline-flex rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
        >
          New provider
        </Link>
      </section>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
      <table className="min-w-[1000px] w-full text-left text-sm">
        <thead className="bg-stone-950 text-white">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Suburb</th>
            <th className="px-4 py-3 font-semibold">Care types</th>
            <th className="px-4 py-3 font-semibold">Star</th>
            <th className="px-4 py-3 font-semibold">RAD</th>
            <th className="px-4 py-3 font-semibold">DAP</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Verified</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td className="px-4 py-4 font-semibold text-stone-950">{provider.name}</td>
              <td className="px-4 py-4 text-stone-700">{provider.suburb}</td>
              <td className="px-4 py-4 text-stone-700">{provider.careTypes.join(", ")}</td>
              <td className="px-4 py-4 text-stone-700">{provider.starRating.toFixed(1)}</td>
              <td className="px-4 py-4 text-stone-700">{formatCurrency(provider.estimatedRAD)}</td>
              <td className="px-4 py-4 text-stone-700">{formatDailyPayment(provider.estimatedDAP)}</td>
              <td className="px-4 py-4">
                <PublishStatusBadge isPublished={provider.isPublished} />
              </td>
              <td className="px-4 py-4 text-stone-700">{formatProviderDate(provider.lastVerifiedAt)}</td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/providers/${provider.id}/edit`}
                    className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 transition hover:border-stone-950"
                  >
                    Edit
                  </Link>
                  <form action={toggleProviderPublished.bind(null, provider.id, !provider.isPublished)}>
                    <button className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 transition hover:border-stone-950">
                      {provider.isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form
                    action={deleteProvider.bind(null, provider.id)}
                    onSubmit={(event) => {
                      if (!confirm(`Delete ${provider.name}?`)) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <button className="rounded-md border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-50">
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
