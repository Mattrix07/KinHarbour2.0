import { CreateFamilyCaseForm } from "@/components/dashboard/create-family-case-form";

type DashboardEmptyStateProps = {
  errorMessage?: string;
};

export function DashboardEmptyState({ errorMessage }: DashboardEmptyStateProps) {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Family case</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-stone-950">
          Start by creating one shared place for this aged care journey.
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-700">
          A family case represents the older person you are helping. It will hold the
          assessment pathway, action plan, shortlisted providers, family coordination,
          tasks, and notes as KinHarbour grows.
        </p>
        <p className="mt-4 text-sm leading-6 text-stone-700">
          Add only the practical details needed to organise next steps. KinHarbour does
          not determine eligibility and does not replace My Aged Care, clinical, legal,
          or financial advice.
        </p>
        {errorMessage ? (
          <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <CreateFamilyCaseForm />
    </section>
  );
}
