export type RadDapInputs = {
  radAmount: number;
  lumpSumPaid: number;
  annualInterestRatePercent: number;
  basicDailyFee: number;
  extraServiceFee: number;
  otherDailyFees: number;
};

export type RadDapField = keyof RadDapInputs;

export type RadDapValidationError = {
  field: RadDapField;
  message: string;
};

export type RadDapResult = {
  radAmount: number;
  lumpSumPaid: number;
  unpaidRadBalance: number;
  annualDap: number;
  dailyDap: number;
  monthlyDap: number;
  optionalDailyFeesTotal: number;
  totalDailyCost: number;
  totalMonthlyCost: number;
  assumptions: {
    annualInterestRatePercent: number;
    daysPerYear: number;
    averageDaysPerMonth: number;
  };
};

export type RadDapCalculation = {
  result: RadDapResult | null;
  validationErrors: RadDapValidationError[];
};
