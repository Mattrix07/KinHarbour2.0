import Link from "next/link";

import { ResourceAdminTable } from "@/components/admin/resource-admin-table";
import { getAdminResources } from "@/lib/admin/resource-admin-actions";

export default async function AdminResourcesPage() {
  const resources = await getAdminResources();

  return (
    <div>
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase text-stone-500">Resource articles</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-950">Manage resources</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
            Resources provide general navigation support only. Publish only plain-English
            guidance that does not replace My Aged Care, medical, legal, or financial advice.
          </p>
        </div>
        <Link
          href="/admin/resources/new"
          className="rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
        >
          New resource
        </Link>
      </section>

      <div className="mt-6">
        <ResourceAdminTable resources={resources} />
      </div>
    </div>
  );
}
