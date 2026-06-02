import { ResourceForm } from "@/components/admin/resource-form";

type NewResourcePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewResourcePage({ searchParams }: NewResourcePageProps) {
  const params = await searchParams;

  return (
    <div>
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-stone-500">Resource articles</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-950">New resource</h1>
      </section>

      <div className="mt-6">
        <ResourceForm errorMessage={params.error} />
      </div>
    </div>
  );
}
