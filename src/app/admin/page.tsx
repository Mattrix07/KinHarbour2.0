import { AdminDashboardCards } from "@/components/admin/admin-dashboard-cards";
import { getAdminOverview } from "@/lib/admin/admin-actions";

export default async function AdminPage() {
  const overview = await getAdminOverview();

  return (
    <div>
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-stone-500">Internal tools</p>
        <h1 className="mt-3 text-4xl font-semibold text-stone-950">KinHarbour admin</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700">
          Manage platform content, provider records, resource articles, and publishing
          status. Provider records are informational comparison data; KinHarbour does not
          endorse providers.
        </p>
      </section>

      <div className="mt-8">
        <AdminDashboardCards overview={overview} />
      </div>
    </div>
  );
}
