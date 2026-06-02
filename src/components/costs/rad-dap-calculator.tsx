"use client";

import { useMemo, useState } from "react";

import { calculateRadDap, radDapDefaults } from "@/lib/costs/rad-dap";
import type { RadDapField, RadDapInputs, RadDapValidationError } from "@/lib/costs/types";

import { CostSummaryCard } from "./cost-summary-card";

export function RadDapCalculator() {
  const [inputs, setInputs] = useState<RadDapInputs>(radDapDefaults);
  const calculation = useMemo(() => calculateRadDap(inputs), [inputs]);

  function updateInput(field: RadDapField, value: number) {
    setInputs((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <form className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase text-[#146c60]">RAD/DAP calculator</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">Enter the accommodation assumptions</h2>
          </div>
          <button
            type="button"
            onClick={() => setInputs(radDapDefaults)}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-[#146c60] hover:text-[#146c60]"
          >
            Reset
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-stone-700">
          Use this as a planning estimate only. You can change every assumption, including
          the interest rate, to see how the daily payment changes.
        </p>

        <div className="mt-6 grid gap-5">
          <MoneyInput
            id="radAmount"
            label="Refundable Accommodation Deposit amount (RAD)"
            value={inputs.radAmount}
            onChange={(value) => updateInput("radAmount", value)}
            error={findError(calculation.validationErrors, "radAmount")}
          />

          <div>
            <MoneyInput
              id="lumpSumPaid"
              label="Lump sum paid upfront"
              value={inputs.lumpSumPaid}
              onChange={(value) => updateInput("lumpSumPaid", value)}
              error={findError(calculation.validationErrors, "lumpSumPaid")}
            />
            <label className="mt-3 block">
              <span className="sr-only">Choose lump sum paid upfront</span>
              <input
                type="range"
                min="0"
                max={Math.max(0, inputs.radAmount)}
                step="1000"
                value={Math.min(Math.max(0, inputs.lumpSumPaid), Math.max(0, inputs.radAmount))}
                onChange={(event) => updateInput("lumpSumPaid", Number(event.target.value))}
                className="w-full accent-[#146c60]"
              />
            </label>
            <p className="mt-2 text-xs leading-5 text-stone-500">
              Move the slider to model paying none, part, or all of the RAD as a lump sum.
            </p>
          </div>

          <NumberInput
            id="annualInterestRatePercent"
            label="Interest rate assumption"
            suffix="% per year"
            value={inputs.annualInterestRatePercent}
            step="0.01"
            onChange={(value) => updateInput("annualInterestRatePercent", value)}
            error={findError(calculation.validationErrors, "annualInterestRatePercent")}
          />

          <div className="rounded-lg bg-[#f8f5ef] p-4">
            <h3 className="font-semibold text-stone-950">Optional daily fees</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Add daily fees only if you want to see how extra assumptions affect the
              monthly estimate.
            </p>
            <div className="mt-4 grid gap-4">
              <MoneyInput
                id="basicDailyFee"
                label="Basic daily fee"
                value={inputs.basicDailyFee}
                onChange={(value) => updateInput("basicDailyFee", value)}
                error={findError(calculation.validationErrors, "basicDailyFee")}
              />
              <MoneyInput
                id="extraServiceFee"
                label="Extra service fee per day"
                value={inputs.extraServiceFee}
                onChange={(value) => updateInput("extraServiceFee", value)}
                error={findError(calculation.validationErrors, "extraServiceFee")}
              />
              <MoneyInput
                id="otherDailyFees"
                label="Other daily fees"
                value={inputs.otherDailyFees}
                onChange={(value) => updateInput("otherDailyFees", value)}
                error={findError(calculation.validationErrors, "otherDailyFees")}
              />
            </div>
          </div>
        </div>
      </form>

      <CostSummaryCard
        result={calculation.result}
        validationErrors={calculation.validationErrors}
      />
    </section>
  );
}

function MoneyInput({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: RadDapField;
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-stone-700" htmlFor={id}>
        {label}
      </label>
      <div className="mt-2 flex overflow-hidden rounded-md border border-stone-300 bg-white shadow-sm focus-within:border-[#146c60] focus-within:ring-2 focus-within:ring-[#146c60]/20">
        <span aria-hidden="true" className="flex items-center border-r border-stone-200 bg-[#f8f5ef] px-3 text-sm font-semibold text-stone-500">
          $
        </span>
        <input
          id={id}
          type="number"
          min="0"
          step="1"
          value={numberInputValue(value)}
          onChange={(event) => onChange(parseNumberInput(event.target.value))}
          className="w-full border-0 px-3 py-2 text-sm text-stone-950 outline-none"
        />
      </div>
      {error ? <p className="mt-2 text-sm font-medium text-rose-800">{error}</p> : null}
    </div>
  );
}

function NumberInput({
  id,
  label,
  suffix,
  value,
  step,
  onChange,
  error,
}: {
  id: RadDapField;
  label: string;
  suffix: string;
  value: number;
  step: string;
  onChange: (value: number) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-stone-700" htmlFor={id}>
        {label}
      </label>
      <div className="mt-2 flex overflow-hidden rounded-md border border-stone-300 bg-white shadow-sm focus-within:border-[#146c60] focus-within:ring-2 focus-within:ring-[#146c60]/20">
        <input
          id={id}
          type="number"
          min="0"
          step={step}
          value={numberInputValue(value)}
          onChange={(event) => onChange(parseNumberInput(event.target.value))}
          className="w-full border-0 px-3 py-2 text-sm text-stone-950 outline-none"
        />
        <span aria-hidden="true" className="flex items-center border-l border-stone-200 bg-[#f8f5ef] px-3 text-sm font-semibold text-stone-500">
          {suffix}
        </span>
      </div>
      {error ? <p className="mt-2 text-sm font-medium text-rose-800">{error}</p> : null}
    </div>
  );
}

function parseNumberInput(value: string) {
  if (value.trim() === "") {
    return 0;
  }

  return Number(value);
}

function numberInputValue(value: number) {
  if (Number.isNaN(value)) {
    return "";
  }

  return String(value);
}

function findError(errors: RadDapValidationError[], field: RadDapField) {
  return errors.find((error) => error.field === field)?.message;
}
