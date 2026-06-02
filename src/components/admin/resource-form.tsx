import Link from "next/link";

import {
  createResource,
  updateResource,
} from "@/lib/admin/resource-admin-actions";
import type { AdminResourceArticle } from "@/lib/admin/types";
import { resourceCategoryLabels, resourceCategories } from "@/lib/resources/resource-utils";

type ResourceFormProps = {
  resource?: AdminResourceArticle;
  errorMessage?: string;
};

const defaultSections = JSON.stringify(
  [
    {
      id: "introduction",
      heading: "Introduction",
      paragraphs: ["Write a plain-English introduction for families."],
    },
  ],
  null,
  2,
);

export function ResourceForm({ resource, errorMessage }: ResourceFormProps) {
  const action = resource ? updateResource.bind(null, resource.id) : createResource;

  return (
    <form action={action} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      {errorMessage ? (
        <p className="mb-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-950">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Title" name="title" value={resource?.title} required />
        <TextField label="Slug" name="slug" value={resource?.slug} required />

        <label className="block" htmlFor="category">
          <span className="text-sm font-semibold text-stone-700">Category</span>
          <select
            id="category"
            name="category"
            defaultValue={resource?.category ?? "getting_started"}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/20"
          >
            {resourceCategories.map((category) => (
              <option key={category} value={category}>
                {resourceCategoryLabels[category]}
              </option>
            ))}
          </select>
        </label>

        <TextField
          label="Reading time minutes"
          name="reading_time_minutes"
          type="number"
          value={String(resource?.readingTimeMinutes ?? 5)}
          min="1"
        />
        <TextField label="Audience" name="audience" value={resource?.audience} />
        <TextField
          label="Last reviewed date"
          name="last_reviewed_at"
          type="date"
          value={resource?.lastReviewedAt}
        />
        <TextAreaField label="Summary" name="summary" value={resource?.summary} span rows={4} />
        <TextAreaField
          label="Content sections JSON"
          name="content_sections"
          value={
            resource
              ? JSON.stringify(resource.contentSections, null, 2)
              : defaultSections
          }
          span
          rows={12}
        />
        <TextAreaField
          label="Related links JSON"
          name="related_links"
          value={resource ? JSON.stringify(resource.relatedLinks, null, 2) : "[]"}
          span
          rows={6}
        />
        <TextAreaField
          label="Disclaimer"
          name="disclaimer"
          value={resource?.disclaimer}
          span
          rows={4}
        />
      </div>

      <fieldset className="mt-6 rounded-lg bg-[#f8f5ef] p-4">
        <label className="flex items-center gap-3 text-sm font-semibold text-stone-800">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={Boolean(resource?.isPublished)}
            className="h-4 w-4 rounded border-stone-300"
          />
          Published
        </label>
      </fieldset>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-md bg-stone-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
        >
          {resource ? "Save resource" : "Create resource"}
        </button>
        <Link
          href="/admin/resources"
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
  min,
  required,
}: {
  label: string;
  name: string;
  value?: string;
  type?: string;
  min?: string;
  required?: boolean;
}) {
  return (
    <label className="block" htmlFor={name}>
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        min={min}
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
  rows = 5,
}: {
  label: string;
  name: string;
  value?: string;
  span?: boolean;
  rows?: number;
}) {
  return (
    <label className={span ? "block md:col-span-2" : "block"} htmlFor={name}>
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={value ?? ""}
        className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 font-mono text-sm leading-6 text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/20"
      />
    </label>
  );
}
