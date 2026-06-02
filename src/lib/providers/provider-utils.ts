import { providers } from "./provider-data";
import {
  maxComparedProviders,
  providerComparisonStorageKey,
  type CareType,
  type Provider,
  type ProviderFilters,
  type ShortlistedProvider,
  type ShortlistedProviderWithDetails,
} from "./types";

export const careTypeOptions: CareType[] = [
  "Residential aged care",
  "Respite care",
  "Dementia support",
  "Palliative care",
  "Ageing in place",
];

export function getProviderById(id: string) {
  return providers.find((provider) => provider.id === id);
}

export function getProvidersByIds(providerIds: string[], providerCatalog: Provider[] = providers) {
  const uniqueIds = Array.from(new Set(providerIds));

  return uniqueIds
    .map((id) => providerCatalog.find((provider) => provider.id === id))
    .filter((provider): provider is Provider => Boolean(provider));
}

export function attachProviderDetails(
  shortlistItems: ShortlistedProvider[],
  providerCatalog: Provider[] = providers,
) {
  return shortlistItems
    .map((item) => {
      const provider = providerCatalog.find((candidate) => candidate.id === item.provider_id);

      if (!provider) {
        return null;
      }

      return {
        ...item,
        provider,
      };
    })
    .filter((item): item is ShortlistedProviderWithDetails => Boolean(item));
}

export function filterAndSortProviders(providerList: Provider[], filters: ProviderFilters) {
  const search = filters.search.trim().toLowerCase();

  return providerList
    .filter((provider) => {
      const matchesSearch =
        !search ||
        provider.name.toLowerCase().includes(search) ||
        provider.suburb.toLowerCase().includes(search) ||
        provider.postcode.includes(search);

      const matchesCareType =
        filters.careType === "all" || provider.careTypes.includes(filters.careType);

      return (
        matchesSearch &&
        matchesCareType &&
        (!filters.dementiaSupport || provider.dementiaSupport) &&
        (!filters.respiteAvailable || provider.respiteAvailable) &&
        (!filters.palliativeCare || provider.palliativeCare) &&
        (!filters.couplesAccommodation || provider.couplesAccommodation)
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "estimated-rad") {
        return a.estimatedRAD - b.estimatedRAD;
      }

      if (filters.sortBy === "suburb") {
        return a.suburb.localeCompare(b.suburb);
      }

      return b.starRating - a.starRating;
    });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDailyPayment(value: number) {
  return `${new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} per day`;
}

export function formatProviderDate(value: string) {
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

export function formatBoolean(value: boolean) {
  return value ? "Yes" : "No";
}

export function ratingLabel(value: number) {
  if (value >= 4.5) {
    return "Very strong";
  }

  if (value >= 4) {
    return "Strong";
  }

  if (value >= 3.5) {
    return "Moderate";
  }

  return "Review carefully";
}

export function readComparedProviderIds(validProviderIds?: string[]) {
  if (typeof window === "undefined") {
    return [];
  }

  const rawIds = window.localStorage.getItem(providerComparisonStorageKey);

  if (!rawIds) {
    return [];
  }

  try {
    const parsedIds = JSON.parse(rawIds);
    if (!Array.isArray(parsedIds)) {
      return [];
    }

    const validIdSet = validProviderIds ? new Set(validProviderIds) : null;

    return parsedIds
      .filter((id): id is string => typeof id === "string")
      .filter((id) => !validIdSet || validIdSet.has(id))
      .slice(0, maxComparedProviders);
  } catch {
    return [];
  }
}

export function writeComparedProviderIds(providerIds: string[], validProviderIds?: string[]) {
  const validIdSet = validProviderIds ? new Set(validProviderIds) : null;
  const validIds = Array.from(new Set(providerIds))
    .filter((id) => !validIdSet || validIdSet.has(id))
    .slice(0, maxComparedProviders);

  window.localStorage.setItem(providerComparisonStorageKey, JSON.stringify(validIds));
  window.dispatchEvent(new Event("kinharbour:provider-comparison-change"));
  return validIds;
}

export function getComparedProviders(providerIds: string[], providerCatalog: Provider[] = providers) {
  return getProvidersByIds(providerIds, providerCatalog);
}
