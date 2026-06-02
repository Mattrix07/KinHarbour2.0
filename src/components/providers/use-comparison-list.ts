"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { maxComparedProviders, providerComparisonStorageKey } from "@/lib/providers/types";
import type { Provider } from "@/lib/providers/types";
import {
  readComparedProviderIds,
  writeComparedProviderIds,
} from "@/lib/providers/provider-utils";

const comparisonChangeEvent = "kinharbour:provider-comparison-change";
const emptyComparisonIds: string[] = [];

export function useComparisonList(providerCatalog?: Provider[]) {
  const validProviderIds = useMemo(
    () => providerCatalog?.map((provider) => provider.id),
    [providerCatalog],
  );
  const storedProviderIds = useSyncExternalStore(
    subscribeToComparisonStorage,
    () => readComparisonSnapshot(validProviderIds),
    getServerComparisonSnapshot,
  );
  const providerIds = storedProviderIds ?? emptyComparisonIds;

  const addProvider = useCallback(
    (providerId: string) => {
      const currentIds = readComparedProviderIds(validProviderIds);

      if (currentIds.includes(providerId)) {
        return {
          ok: true,
          message: "This home is already in your comparison list.",
        };
      }

      if (currentIds.length >= maxComparedProviders) {
        return {
          ok: false,
          message: `You can compare up to ${maxComparedProviders} homes at a time. Remove one before adding another.`,
        };
      }

      writeComparedProviderIds([...currentIds, providerId], validProviderIds);

      return {
        ok: true,
        message: "Added to your comparison list.",
      };
    },
    [validProviderIds],
  );

  const removeProvider = useCallback((providerId: string) => {
    writeComparedProviderIds(
      readComparedProviderIds(validProviderIds).filter((id) => id !== providerId),
      validProviderIds,
    );

    return {
      ok: true,
      message: "Removed from your comparison list.",
    };
  }, [validProviderIds]);

  return {
    providerIds,
    isReady: storedProviderIds !== undefined,
    addProvider,
    removeProvider,
    isSelected: useCallback((providerId: string) => providerIds.includes(providerId), [providerIds]),
  };
}

let cachedComparisonRaw: string | null | undefined;
let cachedComparisonIds: string[] | undefined;

function subscribeToComparisonStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(comparisonChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(comparisonChangeEvent, onStoreChange);
  };
}

function getServerComparisonSnapshot() {
  return undefined;
}

function readComparisonSnapshot(validProviderIds?: string[]) {
  const rawIds = window.localStorage.getItem(providerComparisonStorageKey);

  if (rawIds === cachedComparisonRaw && cachedComparisonIds) {
    return cachedComparisonIds;
  }

  cachedComparisonRaw = rawIds;
  cachedComparisonIds = readComparedProviderIds(validProviderIds);
  return cachedComparisonIds;
}
