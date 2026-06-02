import Link from "next/link";

import { ProviderForm } from "@/components/admin/provider-form";
import { getAdminProviderById } from "@/lib/admin/provider-admin-actions";

type EditProviderPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditProviderPage({ params, searchParams }: EditProviderPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const provider = await getAdminProviderById(id);

  if (!provider) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-950">Provider not found</h1>
        <Link
          href="/admin/providers"
          className="mt-5 inline-flex rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to providers
        </Link>
      </section>
    );
  }

  return (
    <div>
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-stone-500">Provider records</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-950">Edit {provider.name}</h1>
      </section>

      <div className="mt-6">
        <ProviderForm provider={provider} errorMessage={query.error} />
      </div>
    </div>
  );
}
