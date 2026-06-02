"use client";

import Link from "next/link";

import { PublishStatusBadge } from "@/components/admin/publish-status-badge";
import {
  deleteResource,
  toggleResourcePublished,
} from "@/lib/admin/resource-admin-actions";
import type { AdminResourceArticle } from "@/lib/admin/types";
import {
  formatReviewedDate,
  resourceCategoryLabels,
} from "@/lib/resources/resource-utils";

export function ResourceAdminTable({ resources }: { resources: AdminResourceArticle[] }) {
  if (resources.length === 0) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">No resource articles yet.</h2>
        <Link
          href="/admin/resources/new"
          className="mt-5 inline-flex rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
        >
          New resource
        </Link>
      </section>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
      <table className="min-w-[850px] w-full text-left text-sm">
        <thead className="bg-stone-950 text-white">
          <tr>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Reading time</th>
            <th className="px-4 py-3 font-semibold">Last reviewed</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {resources.map((resource) => (
            <tr key={resource.id}>
              <td className="px-4 py-4">
                <p className="font-semibold text-stone-950">{resource.title}</p>
                <p className="mt-1 text-xs text-stone-500">{resource.slug}</p>
              </td>
              <td className="px-4 py-4 text-stone-700">{resourceCategoryLabels[resource.category]}</td>
              <td className="px-4 py-4 text-stone-700">{resource.readingTimeMinutes} min</td>
              <td className="px-4 py-4 text-stone-700">{formatReviewedDate(resource.lastReviewedAt)}</td>
              <td className="px-4 py-4">
                <PublishStatusBadge isPublished={resource.isPublished} />
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/resources/${resource.id}/edit`}
                    className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 transition hover:border-stone-950"
                  >
                    Edit
                  </Link>
                  <form action={toggleResourcePublished.bind(null, resource.id, !resource.isPublished)}>
                    <button className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 transition hover:border-stone-950">
                      {resource.isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form
                    action={deleteResource.bind(null, resource.id)}
                    onSubmit={(event) => {
                      if (!confirm(`Delete ${resource.title}?`)) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <button className="rounded-md border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-50">
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
