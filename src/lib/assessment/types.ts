export type CarePathway =
  | "support_at_home"
  | "residential_care"
  | "respite_care"
  | "urgent_hospital_discharge"
  | "my_aged_care_assessment"
  | "financial_planning"
  | "family_coordination";

export type UrgencyLevel = "low" | "medium" | "high";

export type AssessmentFlag =
  | "immediate_safety_risk"
  | "recent_hospital_or_decline"
  | "hospital_discharge_now"
  | "high_personal_care_need"
  | "cognitive_safety_concern"
  | "carer_strain"
  | "my_aged_care_needed"
  | "cost_concern"
  | "location_unclear";

export type AssessmentOption = {
  id: string;
  label: string;
  description?: string;
  score?: Partial<Record<CarePathway, number>>;
  urgency?: UrgencyLevel;
  flags?: AssessmentFlag[];
};

export type AssessmentQuestion = {
  id: string;
  title: string;
  prompt: string;
  helperText?: string;
  options: AssessmentOption[];
};

export type AssessmentAnswer = {
  questionId: string;
  optionId: string;
};

export type ActionPlanStep = {
  id: string;
  title: string;
  description: string;
  pathway?: CarePathway;
  priority: "now" | "soon" | "later";
  href?: string;
};

export type RecommendedNextPage = {
  href: string;
  label: string;
  description: string;
};

export type AssessmentResult = {
  primaryPathway: CarePathway;
  secondaryPathways: CarePathway[];
  urgencyLevel: UrgencyLevel;
  riskFlags: AssessmentFlag[];
  headline: string;
  summary: string;
  reasons: string[];
  actionPlanSteps: ActionPlanStep[];
  recommendedNextPages: RecommendedNextPage[];
  disclaimer: string;
  completedAt: string;
  answers: AssessmentAnswer[];
  pathwayScores: Record<CarePathway, number>;
};

export const assessmentResultStorageKey = "kinharbour.latestAssessmentResult";
export const assessmentSavedStorageKey = "kinharbour.latestAssessmentSavedAt";

export type AssessmentSaveStatus =
  | "idle"
  | "checking"
  | "saved"
  | "logged_out"
  | "no_family_case"
  | "save_failed"
  | "not_configured";

export type AssessmentSaveResult = {
  status: AssessmentSaveStatus;
  message: string;
  sessionId?: string;
};

export type AssessmentSession = {
  id: string;
  created_at: string;
  family_case_id: string;
  user_id: string;
  answers: AssessmentAnswer[];
  result: AssessmentResult;
  primary_pathway: CarePathway;
  secondary_pathways: CarePathway[];
  urgency_level: UrgencyLevel;
  risk_flags: AssessmentFlag[];
  recommended_next_steps: string[];
  consent_given: boolean;
};

export type AssessmentSessionLoadResult = {
  sessions: AssessmentSession[];
  errorMessage?: string;
};

export const carePathwayLabels: Record<CarePathway, string> = {
  support_at_home: "Support at home",
  residential_care: "Residential aged care",
  respite_care: "Respite care",
  urgent_hospital_discharge: "Urgent hospital discharge support",
  my_aged_care_assessment: "My Aged Care assessment",
  financial_planning: "Aged care cost planning",
  family_coordination: "Family coordination",
};

export const urgencyLabels: Record<UrgencyLevel, string> = {
  low: "Low urgency",
  medium: "Medium urgency",
  high: "High urgency",
};

export const assessmentDisclaimer =
  "KinHarbour provides general navigation support only. It does not determine eligibility and does not replace My Aged Care, medical, legal, or financial advice.";
