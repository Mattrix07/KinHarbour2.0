import type { Provider } from "@/lib/providers/types";
import type { ResourceArticle } from "@/lib/resources/types";

export type PublishStatus = "published" | "draft";

export type AdminProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "family_user" | string;
};

export type AdminProvider = Provider & {
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
};

export type AdminResourceArticle = ResourceArticle & {
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
};

export type AdminOverview = {
  totalProviders: number;
  publishedProviders: number;
  draftProviders: number;
  totalResources: number;
  publishedResources: number;
  draftResources: number;
  recentProviders: AdminProvider[];
  recentResources: AdminResourceArticle[];
};
