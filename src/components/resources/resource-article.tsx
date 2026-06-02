import Link from "next/link";

import { DisclaimerBox } from "@/components/disclaimer-box";
import type { ResourceArticle as ResourceArticleType } from "@/lib/resources/types";
import {
  formatReviewedDate,
  resourceCategoryLabels,
} from "@/lib/resources/resource-utils";

import { ResourceCard } from "./resource-card";
import { ResourceCta } from "./resource-cta";

export function ResourceArticle({
  article,
  relatedArticles,
}: {
  article: ResourceArticleType;
  relatedArticles: ResourceArticleType[];
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <Link href="/resources" className="text-sm font-semibold text-[#146c60] hover:text-[#0f5148]">
        Back to resources
      </Link>

      <article className="mt-6 rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[#d8eee7] px-2 py-1 text-xs font-semibold text-[#146c60]">
              {resourceCategoryLabels[article.category]}
            </span>
            <span className="text-xs font-semibold text-stone-500">
              {article.readingTimeMinutes} min read
            </span>
            <span className="text-xs font-semibold text-stone-500">
              Last reviewed {formatReviewedDate(article.lastReviewedAt)}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">{article.summary}</p>
          <p className="mt-4 text-sm font-medium text-stone-500">For: {article.audience}</p>
        </header>

        <div className="mt-8 space-y-6">
          {article.contentSections.map((section) => (
            <section key={section.id} className="rounded-lg bg-[#fbf8f2] p-5">
              <h2 className="text-2xl font-semibold text-stone-950">{section.heading}</h2>
              <div className="mt-4 space-y-3 text-base leading-7 text-stone-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.listItems && section.listItems.length > 0 ? (
                <div className="mt-4">
                  {section.listTitle ? (
                    <p className="text-sm font-semibold text-stone-800">{section.listTitle}</p>
                  ) : null}
                  <ul className="mt-3 space-y-2">
                    {section.listItems.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-stone-700">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#146c60]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-8">
          <ResourceCta links={article.relatedLinks} />
        </div>

        <div className="mt-8">
          <DisclaimerBox title="Guide disclaimer">
            <p>{article.disclaimer}</p>
          </DisclaimerBox>
        </div>
      </article>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-stone-950">Related resources</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {relatedArticles.map((relatedArticle) => (
            <ResourceCard key={relatedArticle.id} article={relatedArticle} />
          ))}
        </div>
      </section>
    </main>
  );
}
