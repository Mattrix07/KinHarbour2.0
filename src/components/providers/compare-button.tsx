"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  addProviderToShortlist,
  removeProviderFromShortlist,
} from "@/lib/providers/provider-actions";
import type { ShortlistMode } from "@/lib/providers/types";

import { useComparisonList } from "./use-comparison-list";

type CompareButtonProps = {
  providerId: string;
  className?: string;
  initialIsShortlisted?: boolean;
  shortlistMode?: ShortlistMode;
};

export function CompareButton({
  providerId,
  className,
  initialIsShortlisted = false,
  shortlistMode = "logged_out",
}: CompareButtonProps) {
  const router = useRouter();
  const { addProvider, removeProvider, isReady, isSelected } = useComparisonList();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [serverSelected, setServerSelected] = useState(initialIsShortlisted);
  const isFamilyShortlistMode = shortlistMode === "family_case";
  const selected = isFamilyShortlistMode ? serverSelected : isSelected(providerId);
  const disabled = isFamilyShortlistMode ? isPending : !isReady;

  function handleClick() {
    if (isFamilyShortlistMode) {
      startTransition(async () => {
        const result = selected
          ? await removeProviderFromShortlist(providerId)
          : await addProviderToShortlist(providerId);

        if (result.status === "saved" || result.status === "already_saved") {
          setServerSelected(true);
        }

        if (result.status === "removed") {
          setServerSelected(false);
        }

        setMessage(result.message);
        router.refresh();
      });
      return;
    }

    const result = selected ? removeProvider(providerId) : addProvider(providerId);
    setMessage(
      selected
        ? result.message
        : `${result.message} Create a free account and family case to save a shared shortlist.`,
    );
  }

  if (shortlistMode === "no_family_case") {
    return (
      <div className={className}>
        <Link
          href="/dashboard"
          className="flex w-full justify-center rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          Create family case to save
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={[
          "w-full rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
          selected
            ? "border border-stone-300 bg-white text-stone-800 hover:border-[#146c60] hover:text-[#146c60]"
            : "bg-[#146c60] text-white hover:bg-[#0f5148]",
        ].join(" ")}
      >
        {isPending
          ? "Saving..."
          : selected
            ? isFamilyShortlistMode
              ? "Remove from shortlist"
              : "Remove from compare"
            : isFamilyShortlistMode
              ? "Save to shortlist"
              : "Add to compare"}
      </button>
      {message ? (
        <p className="mt-2 text-xs font-medium leading-5 text-stone-600" aria-live="polite">
          {message}
        </p>
      ) : null}
    </div>
  );
}
