import Link from "next/link";
import type { ReactNode } from "react";

import { PublishStatusBadge } from "@/components/admin/publish-status-badge";
import type { AdminOverview } from "@/lib/admin/types";

export function AdminDashboardCards({ overview }: { overview: AdminOverview }) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total providers" value={overview.totalProviders} />
        <MetricCard label="Published providers" value={overview.publishedProviders} />
        <MetricCard label="Draft providers" value={overview.draftProviders} />
        <MetricCard label="Total resources" value={overview.totalResources} />
        <MetricCard label="Published resources" value={overview.publishedResources} />
        <MetricCard label="Draft resources" value={overview.draftResources} />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <RecentPanel
          title="Recent provider updates"
          emptyLabel="No provider records yet."
          href="/admin/providers"
          cta="Manage providers"
        >
          {overview.recentProviders.map((provider) => (
            <li key={provider.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-semibold text-stone-950">{provider.name}</p>
                <p className="mt-1 text-xs text-stone-500">{provider.suburb || "No suburb"}</p>
              </div>
              <PublishStatusBadge isPublished={provider.isPublished} />
            </li>
          ))}
        </RecentPanel>

        <RecentPanel
          title="Recent resource updates"
          emptyLabel="No resource articles yet."
          href="/admin/resources"
          cta="Manage resources"
        >
          {overview.recentResources.map((resource) => (
            <li key={resource.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-semibold text-stone-950">{resource.title}</p>
                <p className="mt-1 text-xs text-stone-500">{resource.slug}</p>
              </div>
              <PublishStatusBadge isPublished={resource.isPublished} />
            </li>
          ))}
        </RecentPanel>
      </section>
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase text-stone-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-stone-950">{value}</p>
    </article>
  );
}

function RecentPanel({
  title,
  emptyLabel,
  href,
  cta,
  children,
}: {
  title: string;
  emptyLabel: string;
  href: string;
  cta: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-[#146c60] hover:text-[#0f5148]">
          {cta}
        </Link>
      </div>
      <ul className="mt-4 divide-y divide-stone-200">
        {Array.isArray(children) && children.length === 0 ? (
          <li className="py-3 text-sm text-stone-600">{emptyLabel}</li>
        ) : (
          children
        )}
      </ul>
    </article>
  );
}
