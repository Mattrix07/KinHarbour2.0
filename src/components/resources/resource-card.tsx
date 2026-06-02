import Link from "next/link";

import type { ResourceArticle } from "@/lib/resources/types";
import { formatReviewedDate, resourceCategoryLabels } from "@/lib/resources/resource-utils";

export function ResourceCard({ article }: { article: ResourceArticle }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-[#d8eee7] px-2 py-1 text-xs font-semibold text-[#146c60]">
          {resourceCategoryLabels[article.category]}
        </span>
        <span className="text-xs font-semibold text-stone-500">
          {article.readingTimeMinutes} min read
        </span>
      </div>

      <h2 className="mt-4 text-xl font-semibold leading-snug text-stone-950">
        <Link href={`/resources/${article.slug}`} className="hover:text-[#146c60]">
          {article.title}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-6 text-stone-700">{article.summary}</p>

      <dl className="mt-5 space-y-2 text-xs leading-5 text-stone-500">
        <div>
          <dt className="font-semibold uppercase">For</dt>
          <dd>{article.audience}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase">Last reviewed</dt>
          <dd>{formatReviewedDate(article.lastReviewedAt)}</dd>
        </div>
      </dl>

      <Link
        href={`/resources/${article.slug}`}
        className="mt-auto inline-flex pt-5 text-sm font-semibold text-[#146c60] hover:text-[#0f5148]"
      >
        Read guide
      </Link>
    </article>
  );
}
