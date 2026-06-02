import Link from "next/link";

import { DisclaimerBox } from "@/components/disclaimer-box";
import { ResourceArticle } from "@/components/resources/resource-article";
import {
  getPublicResourceBySlugWithFallback,
  getPublishedResourcesWithFallback,
} from "@/lib/admin/resource-admin-actions";
import { resourceArticles } from "@/lib/resources/resource-data";
import { getRelatedResources } from "@/lib/resources/resource-utils";

type ResourceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return resourceArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { slug } = await params;
  const [{ article }, { articles }] = await Promise.all([
    getPublicResourceBySlugWithFallback(slug),
    getPublishedResourcesWithFallback(),
  ]);

  if (!article) {
    return <ResourceNotFound slug={slug} />;
  }

  return <ResourceArticle article={article} relatedArticles={getRelatedResources(article, 3, articles)} />;
}

function ResourceNotFound({ slug }: { slug: string }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Resource guide</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-950">
          We could not find that guide.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
          The resource address <span className="font-semibold">{slug}</span> does not match a
          current KinHarbour guide. You can return to the resource library and search by topic.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/resources"
            className="rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            Browse resources
          </Link>
          <Link
            href="/assessment"
            className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
          >
            Start assessment
          </Link>
        </div>
      </section>

      <div className="mt-6">
        <DisclaimerBox title="General guidance only">
          <p>
            KinHarbour resources provide general navigation support only. They do not
            determine eligibility and do not replace My Aged Care, provider information,
            medical, legal, or financial advice.
          </p>
        </DisclaimerBox>
      </div>
    </main>
  );
}
