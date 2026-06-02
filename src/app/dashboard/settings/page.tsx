import Link from "next/link";

import { EditFamilyCaseForm } from "@/components/dashboard/edit-family-case-form";
import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";
import {
  currentStatusLabels,
  livingSituationLabels,
  relationshipLabels,
} from "@/lib/dashboard/types";

export const dynamic = "force-dynamic";

type DashboardSettingsPageProps = {
  searchParams: Promise<{
    updated?: string;
  }>;
};

export default async function DashboardSettingsPage({ searchParams }: DashboardSettingsPageProps) {
  const params = await searchParams;
  const { familyCase, errorMessage } = await getActiveFamilyCase();

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Dashboard settings</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
          Family case details
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-700">
          Edit the simple profile KinHarbour uses to organise this aged care journey.
          Avoid adding private health details here; richer care planning will be introduced
          carefully in later steps.
        </p>
      </section>

      {params.updated === "true" ? (
        <p className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950">
          Family case details saved.
        </p>
      ) : null}

      {!familyCase ? (
        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-950">No family case yet</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Create a family case from the dashboard before editing these details.
          </p>
          {errorMessage ? (
            <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
              {errorMessage}
            </p>
          ) : null}
          <Link
            href="/dashboard"
            className="mt-5 inline-flex rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            Go to dashboard
          </Link>
        </section>
      ) : (
        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-lg border border-stone-200 bg-[#f1eadf] p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-[#146c60]">Current summary</p>
            <h2 className="mt-3 text-2xl font-semibold text-stone-950">
              {familyCase.care_recipient_name}
            </h2>
            <dl className="mt-5 grid gap-3">
              <SummaryItem label="Relationship" value={relationshipLabels[familyCase.relationship_to_user]} />
              <SummaryItem
                label="Living situation"
                value={livingSituationLabels[familyCase.current_living_situation]}
              />
              <SummaryItem label="Status" value={currentStatusLabels[familyCase.current_status]} />
              <SummaryItem
                label="Location"
                value={
                  [familyCase.care_recipient_suburb, familyCase.care_recipient_state]
                    .filter(Boolean)
                    .join(", ") || "Not added yet"
                }
              />
            </dl>
          </aside>

          <EditFamilyCaseForm familyCase={familyCase} />
        </section>
      )}
    </main>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/70 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-normal text-stone-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-stone-900">{value}</dd>
    </div>
  );
}
