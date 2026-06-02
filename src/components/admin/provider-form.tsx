import Link from "next/link";

import {
  createProvider,
  updateProvider,
} from "@/lib/admin/provider-admin-actions";
import type { AdminProvider } from "@/lib/admin/types";

type ProviderFormProps = {
  provider?: AdminProvider;
  errorMessage?: string;
};

export function ProviderForm({ provider, errorMessage }: ProviderFormProps) {
  const action = provider ? updateProvider.bind(null, provider.id) : createProvider;

  return (
    <form action={action} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      {errorMessage ? (
        <p className="mb-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-950">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Name" name="name" value={provider?.name} required />
        <TextField label="Suburb" name="suburb" value={provider?.suburb} />
        <TextField label="State" name="state" value={provider?.state ?? "NSW"} />
        <TextField label="Postcode" name="postcode" value={provider?.postcode} />
        <TextAreaField label="Care types" name="care_types" value={provider?.careTypes.join("\n")} />
        <TextAreaField label="Room types" name="room_types" value={provider?.roomTypes.join("\n")} />
        <TextField label="Star rating" name="star_rating" value={String(provider?.starRating ?? "")} type="number" step="0.1" min="0" max="5" />
        <TextField label="Estimated RAD" name="estimated_rad" value={String(provider?.estimatedRAD ?? "")} type="number" min="0" />
        <TextField label="Estimated DAP" name="estimated_dap" value={String(provider?.estimatedDAP ?? "")} type="number" step="0.01" min="0" />
        <TextField label="Compliance rating" name="compliance_rating" value={String(provider?.complianceRating ?? "")} type="number" step="0.1" min="0" max="5" />
        <TextField label="Staffing rating" name="staffing_rating" value={String(provider?.staffingRating ?? "")} type="number" step="0.1" min="0" max="5" />
        <TextField label="Resident experience rating" name="resident_experience_rating" value={String(provider?.residentExperienceRating ?? "")} type="number" step="0.1" min="0" max="5" />
        <TextField label="Quality measures rating" name="quality_measures_rating" value={String(provider?.qualityMeasuresRating ?? "")} type="number" step="0.1" min="0" max="5" />
        <TextField label="Contact phone" name="contact_phone" value={provider?.contactPhone} />
        <TextField label="Website" name="website" value={provider?.website} type="url" />
        <TextField label="Last verified date" name="last_verified_at" value={provider?.lastVerifiedAt} type="date" />
        <TextAreaField label="Description" name="description" value={provider?.description} span />
        <TextAreaField label="Features" name="features" value={provider?.features.join("\n")} span />
        <TextAreaField label="Data source note" name="data_source_note" value={provider?.dataSourceNote} span />
      </div>

      <fieldset className="mt-6 grid gap-3 rounded-lg bg-[#f8f5ef] p-4 sm:grid-cols-2">
        <Checkbox label="Dementia support" name="dementia_support" checked={provider?.dementiaSupport} />
        <Checkbox label="Respite available" name="respite_available" checked={provider?.respiteAvailable} />
        <Checkbox label="Palliative care" name="palliative_care" checked={provider?.palliativeCare} />
        <Checkbox label="Couples accommodation" name="couples_accommodation" checked={provider?.couplesAccommodation} />
        <Checkbox label="Published" name="is_published" checked={provider?.isPublished} />
        <Checkbox label="Demo data" name="is_demo_data" checked={provider?.isDemoData ?? true} />
      </fieldset>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-md bg-stone-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
        >
          {provider ? "Save provider" : "Create provider"}
        </button>
        <Link
          href="/admin/providers"
          className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-950"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function TextField({
  label,
  name,
  value,
  type = "text",
  step,
  min,
  max,
  required,
}: {
  label: string;
  name: string;
  value?: string;
  type?: string;
  step?: string;
  min?: string;
  max?: string;
  required?: boolean;
}) {
  return (
    <label className="block" htmlFor={name}>
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        min={min}
        max={max}
        required={required}
        defaultValue={value ?? ""}
        className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/20"
      />
    </label>
  );
}

function TextAreaField({
  label,
  name,
  value,
  span,
}: {
  label: string;
  name: string;
  value?: string;
  span?: boolean;
}) {
  return (
    <label className={span ? "block md:col-span-2" : "block"} htmlFor={name}>
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      <textarea
        id={name}
        name={name}
        rows={span ? 5 : 4}
        defaultValue={value ?? ""}
        className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm leading-6 text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/20"
      />
    </label>
  );
}

function Checkbox({ label, name, checked }: { label: string; name: string; checked?: boolean }) {
  return (
    <label className="flex items-center gap-3 text-sm font-semibold text-stone-800">
      <input
        type="checkbox"
        name={name}
        defaultChecked={Boolean(checked)}
        className="h-4 w-4 rounded border-stone-300"
      />
      {label}
    </label>
  );
}
