export type ResourceCategory =
  | "getting_started"
  | "home_care"
  | "residential_care"
  | "respite_care"
  | "hospital_discharge"
  | "costs"
  | "provider_comparison"
  | "family_decision_making";

export type ResourceContentSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  listTitle?: string;
  listItems?: string[];
};

export type ResourceRelatedLink = {
  href: string;
  label: string;
  description: string;
};

export type ResourceArticle = {
  id: string;
  title: string;
  slug: string;
  category: ResourceCategory;
  summary: string;
  readingTimeMinutes: number;
  audience: string;
  lastReviewedAt: string;
  contentSections: ResourceContentSection[];
  relatedLinks: ResourceRelatedLink[];
  disclaimer: string;
};
