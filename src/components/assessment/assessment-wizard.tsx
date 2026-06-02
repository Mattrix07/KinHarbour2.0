"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { assessmentQuestions } from "@/lib/assessment/questions";
import { scoreAssessment } from "@/lib/assessment/scoring";
import { assessmentResultStorageKey, type AssessmentAnswer } from "@/lib/assessment/types";

export function AssessmentWizard() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSelectionError, setShowSelectionError] = useState(false);

  const question = assessmentQuestions[currentIndex];
  const selectedOptionId = question ? answers[question.id] : undefined;
  const progressPercent = ((currentIndex + 1) / assessmentQuestions.length) * 100;

  const orderedAnswers = useMemo<AssessmentAnswer[]>(() => {
    return assessmentQuestions.flatMap((item) => {
      const optionId = answers[item.id];
      return optionId ? [{ questionId: item.id, optionId }] : [];
    });
  }, [answers]);

  if (!question) {
    return null;
  }

  function selectOption(optionId: string) {
    setAnswers((current) => ({
      ...current,
      [question.id]: optionId,
    }));
    setShowSelectionError(false);
  }

  function goBack() {
    setShowSelectionError(false);
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }

  function goNext() {
    if (!selectedOptionId) {
      setShowSelectionError(true);
      return;
    }

    if (currentIndex === assessmentQuestions.length - 1) {
      const result = scoreAssessment(orderedAnswers);
      window.localStorage.setItem(assessmentResultStorageKey, JSON.stringify(result));
      router.push("/assessment/results");
      return;
    }

    setShowSelectionError(false);
    setCurrentIndex((index) => index + 1);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-[#146c60]">Assessment</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-stone-950 sm:text-4xl">
              A 5-minute guide to the likely care pathway.
            </h1>
          </div>
          <div className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-stone-700">
            Question {currentIndex + 1} of {assessmentQuestions.length}
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-base leading-7 text-stone-700">
          Answer in the way that feels closest today. The result is a plain-language guide,
          not a formal decision about eligibility or care needs.
        </p>

        <div className="mt-6" aria-label="Assessment progress">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-stone-500">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-[#146c60] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-stone-200 bg-[#fbf8f2] p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase text-[#146c60]">{question.title}</p>
          <h2 className="mt-3 text-2xl font-semibold leading-snug text-stone-950">
            {question.prompt}
          </h2>
          {question.helperText ? (
            <p className="mt-3 text-sm leading-6 text-stone-600">{question.helperText}</p>
          ) : null}

          <fieldset className="mt-6">
            <legend className="sr-only">{question.prompt}</legend>
            <div className="grid gap-3">
              {question.options.map((option) => {
                const selected = selectedOptionId === option.id;

                return (
                  <label
                    key={option.id}
                    className={[
                      "block cursor-pointer rounded-lg border p-4 shadow-sm transition",
                      selected
                        ? "border-[#146c60] bg-[#e7f2ee] ring-2 ring-[#146c60]/20"
                        : "border-stone-200 bg-white hover:border-[#146c60]/70",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={selected}
                      onChange={() => selectOption(option.id)}
                      className="sr-only"
                    />
                    <span className="flex gap-3">
                      <span
                        className={[
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                          selected ? "border-[#146c60] bg-[#146c60]" : "border-stone-300 bg-white",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                      </span>
                      <span>
                        <span className="block text-base font-semibold text-stone-950">
                          {option.label}
                        </span>
                        {option.description ? (
                          <span className="mt-1 block text-sm leading-6 text-stone-600">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {showSelectionError ? (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              Please choose the closest option before continuing.
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={currentIndex === 0}
            className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            {currentIndex === assessmentQuestions.length - 1 ? "See my result" : "Next"}
          </button>
        </div>

        <p className="mt-6 rounded-lg bg-[#f1eadf] p-4 text-sm leading-6 text-stone-700">
          This assessment provides general navigation support only and does not replace My
          Aged Care, medical, legal, or financial advice.
        </p>
      </section>
    </main>
  );
}
