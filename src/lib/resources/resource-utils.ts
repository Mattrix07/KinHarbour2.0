import { resourceArticles } from "./resource-data";
import type { ResourceArticle, ResourceCategory } from "./types";

export const resourceCategoryLabels: Record<ResourceCategory, string> = {
  getting_started: "Getting started",
  home_care: "Home care",
  residential_care: "Residential care",
  respite_care: "Respite care",
  hospital_discharge: "Hospital discharge",
  costs: "Costs",
  provider_comparison: "Provider comparison",
  family_decision_making: "Family decision-making",
};

export const resourceCategories = Object.keys(resourceCategoryLabels) as ResourceCategory[];

export type ResourceFilters = {
  search: string;
  category: "all" | ResourceCategory;
};

export function getResourceBySlug(slug: string) {
  return resourceArticles.find((article) => article.slug === slug);
}

export function getRelatedResources(
  article: ResourceArticle,
  limit = 3,
  articles: ResourceArticle[] = resourceArticles,
) {
  return articles
    .filter((candidate) => candidate.id !== article.id)
    .filter((candidate) => candidate.category === article.category)
    .concat(articles.filter((candidate) => candidate.id !== article.id && candidate.category !== article.category))
    .slice(0, limit);
}

export function filterResources(articles: ResourceArticle[], filters: ResourceFilters) {
  const search = filters.search.trim().toLowerCase();

  return articles.filter((article) => {
    const matchesCategory = filters.category === "all" || article.category === filters.category;
    const searchableText = [
      article.title,
      article.summary,
      article.audience,
      resourceCategoryLabels[article.category],
      ...article.contentSections.map((section) => section.heading),
      ...article.contentSections.flatMap((section) => section.listItems ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && (!search || searchableText.includes(search));
  });
}

export function formatReviewedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
