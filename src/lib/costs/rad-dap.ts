import type { RadDapCalculation, RadDapInputs, RadDapValidationError } from "./types";

export const radDapDefaults: RadDapInputs = {
  radAmount: 450000,
  lumpSumPaid: 200000,
  annualInterestRatePercent: 8,
  basicDailyFee: 0,
  extraServiceFee: 0,
  otherDailyFees: 0,
};

export const daysPerYear = 365;
export const averageDaysPerMonth = 30.4167;

export function calculateRadDap(inputs: RadDapInputs): RadDapCalculation {
  const validationErrors = validateRadDapInputs(inputs);

  if (validationErrors.length > 0) {
    return {
      result: null,
      validationErrors,
    };
  }

  const unpaidRadBalance = inputs.radAmount - inputs.lumpSumPaid;
  const annualDap = unpaidRadBalance * (inputs.annualInterestRatePercent / 100);
  const dailyDap = annualDap / daysPerYear;
  const monthlyDap = dailyDap * averageDaysPerMonth;
  const optionalDailyFeesTotal =
    inputs.basicDailyFee + inputs.extraServiceFee + inputs.otherDailyFees;
  const totalDailyCost = dailyDap + optionalDailyFeesTotal;
  const totalMonthlyCost = totalDailyCost * averageDaysPerMonth;

  return {
    result: {
      radAmount: inputs.radAmount,
      lumpSumPaid: inputs.lumpSumPaid,
      unpaidRadBalance,
      annualDap,
      dailyDap,
      monthlyDap,
      optionalDailyFeesTotal,
      totalDailyCost,
      totalMonthlyCost,
      assumptions: {
        annualInterestRatePercent: inputs.annualInterestRatePercent,
        daysPerYear,
        averageDaysPerMonth,
      },
    },
    validationErrors,
  };
}

export function validateRadDapInputs(inputs: RadDapInputs): RadDapValidationError[] {
  const errors: RadDapValidationError[] = [];

  if (!isFiniteNumber(inputs.radAmount) || inputs.radAmount < 0) {
    errors.push({
      field: "radAmount",
      message: "RAD must be zero or a positive amount.",
    });
  }

  if (!isFiniteNumber(inputs.lumpSumPaid) || inputs.lumpSumPaid < 0) {
    errors.push({
      field: "lumpSumPaid",
      message: "Lump sum paid must be zero or a positive amount.",
    });
  }

  if (inputs.lumpSumPaid > inputs.radAmount) {
    errors.push({
      field: "lumpSumPaid",
      message: "Lump sum paid cannot exceed the RAD amount.",
    });
  }

  if (!isFiniteNumber(inputs.annualInterestRatePercent) || inputs.annualInterestRatePercent < 0) {
    errors.push({
      field: "annualInterestRatePercent",
      message: "Interest rate assumption cannot be negative.",
    });
  }

  for (const field of ["basicDailyFee", "extraServiceFee", "otherDailyFees"] as const) {
    if (!isFiniteNumber(inputs[field]) || inputs[field] < 0) {
      errors.push({
        field,
        message: "Daily fees must be zero or a positive amount.",
      });
    }
  }

  return errors;
}

function isFiniteNumber(value: number) {
  return Number.isFinite(value);
}
