import Link from "next/link";

import { ProviderAdminTable } from "@/components/admin/provider-admin-table";
import { getAdminProviders } from "@/lib/admin/provider-admin-actions";

export default async function AdminProvidersPage() {
  const providers = await getAdminProviders();

  return (
    <div>
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase text-stone-500">Provider records</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-950">Manage providers</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
            Providers are listed entities for family comparison, not provider accounts.
            Publish only records that are ready for public informational display.
          </p>
        </div>
        <Link
          href="/admin/providers/new"
          className="rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
        >
          New provider
        </Link>
      </section>

      <div className="mt-6">
        <ProviderAdminTable providers={providers} />
      </div>
    </div>
  );
}
