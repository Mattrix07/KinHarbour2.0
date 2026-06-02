import { ProviderForm } from "@/components/admin/provider-form";

type NewProviderPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewProviderPage({ searchParams }: NewProviderPageProps) {
  const params = await searchParams;

  return (
    <div>
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-stone-500">Provider records</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-950">New provider</h1>
      </section>

      <div className="mt-6">
        <ProviderForm errorMessage={params.error} />
      </div>
    </div>
  );
}
