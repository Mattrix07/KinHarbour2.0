import Link from "next/link";

import { ResourceForm } from "@/components/admin/resource-form";
import { getAdminResourceById } from "@/lib/admin/resource-admin-actions";

type EditResourcePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditResourcePage({ params, searchParams }: EditResourcePageProps) {
  const { id } = await params;
  const query = await searchParams;
  const resource = await getAdminResourceById(id);

  if (!resource) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-950">Resource not found</h1>
        <Link
          href="/admin/resources"
          className="mt-5 inline-flex rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to resources
        </Link>
      </section>
    );
  }

  return (
    <div>
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-stone-500">Resource articles</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-950">Edit {resource.title}</h1>
      </section>

      <div className="mt-6">
        <ResourceForm resource={resource} errorMessage={query.error} />
      </div>
    </div>
  );
}
