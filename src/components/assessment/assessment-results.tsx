"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { ResultsSummary } from "@/components/assessment/results-summary";
import { saveAssessmentResult } from "@/lib/assessment/assessment-actions";
import {
  assessmentResultStorageKey,
  assessmentSavedStorageKey,
  type AssessmentResult,
  type AssessmentSaveResult,
  type AssessmentSaveStatus,
} from "@/lib/assessment/types";

let cachedAssessmentRaw: string | null | undefined;
let cachedAssessmentResult: AssessmentResult | null | undefined;

export function AssessmentResults() {
  const result = useSyncExternalStore(
    subscribeToAssessmentStorage,
    readStoredAssessmentResult,
    getServerAssessmentSnapshot,
  );
  const [saveResult, setSaveResult] = useState<AssessmentSaveResult>({
    status: "idle",
    message: "",
  });
  const attemptedSaveKeyRef = useRef<string | null>(null);

  const saveKey = useMemo(() => {
    if (!result) {
      return null;
    }

    return `${result.completedAt}:${result.primaryPathway}`;
  }, [result]);

  useEffect(() => {
    if (!result || !saveKey || attemptedSaveKeyRef.current === saveKey) {
      return;
    }

    attemptedSaveKeyRef.current = saveKey;

    const savedKey = window.localStorage.getItem(assessmentSavedStorageKey);

    if (savedKey === saveKey) {
      queueMicrotask(() => {
        setSaveResult({
          status: "saved",
          message: "Your action plan has been saved to your KinHarbour dashboard.",
        });
      });
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      setSaveResult({
        status: "checking",
        message: "Checking whether this can be saved to your dashboard...",
      });
    });

    saveAssessmentResult(result)
      .then((response) => {
        if (cancelled) {
          return;
        }

        if (response.status === "saved") {
          window.localStorage.setItem(assessmentSavedStorageKey, saveKey);
        }

        setSaveResult(response);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setSaveResult({
          status: "save_failed",
          message: "Your result is shown below, but we could not save it to your dashboard.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [result, saveKey]);

  if (result === undefined) {
    return (
      <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-stone-600">Loading your assessment result...</p>
        </div>
      </main>
    );
  }

  if (result === null) {
    return (
      <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase text-[#146c60]">Assessment results</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-950">
            You have not completed an assessment yet.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
            Start the free assessment to receive general guidance about the pathway that may
            be worth exploring and a plain-language action plan.
          </p>
          <Link
            href="/assessment"
            className="mt-6 inline-flex rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            Start assessment
          </Link>
        </section>
      </main>
    );
  }

  return (
    <ResultsSummary
      result={result}
      saveStatus={saveResult.status as AssessmentSaveStatus}
      saveMessage={saveResult.message}
    />
  );
}

function subscribeToAssessmentStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getServerAssessmentSnapshot() {
  return undefined;
}

function readStoredAssessmentResult(): AssessmentResult | null | undefined {
  const savedResult = window.localStorage.getItem(assessmentResultStorageKey);

  if (savedResult === cachedAssessmentRaw) {
    return cachedAssessmentResult;
  }

  cachedAssessmentRaw = savedResult;

  if (!savedResult) {
    cachedAssessmentResult = null;
    return cachedAssessmentResult;
  }

  try {
    const parsed = JSON.parse(savedResult) as AssessmentResult;
    cachedAssessmentResult = {
      ...parsed,
      riskFlags: parsed.riskFlags ?? [],
    };
    return cachedAssessmentResult;
  } catch {
    cachedAssessmentResult = null;
    return cachedAssessmentResult;
  }
}
