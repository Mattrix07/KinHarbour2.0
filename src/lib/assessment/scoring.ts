import { assessmentQuestions } from "./questions";
import {
  assessmentDisclaimer,
  carePathwayLabels,
  type ActionPlanStep,
  type AssessmentAnswer,
  type AssessmentFlag,
  type AssessmentOption,
  type AssessmentQuestion,
  type AssessmentResult,
  type CarePathway,
  type RecommendedNextPage,
  type UrgencyLevel,
} from "./types";

const allCarePathways: CarePathway[] = [
  "support_at_home",
  "residential_care",
  "respite_care",
  "urgent_hospital_discharge",
  "my_aged_care_assessment",
  "financial_planning",
  "family_coordination",
];

const primaryPathwayPriority: CarePathway[] = [
  "urgent_hospital_discharge",
  "residential_care",
  "support_at_home",
  "respite_care",
  "my_aged_care_assessment",
  "family_coordination",
  "financial_planning",
];

const urgencyRank: Record<UrgencyLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

type SelectedAnswer = {
  answer: AssessmentAnswer;
  question: AssessmentQuestion;
  option: AssessmentOption;
};

export function scoreAssessment(answers: AssessmentAnswer[]): AssessmentResult {
  const selectedAnswers = getSelectedAnswers(answers);
  const pathwayScores = createEmptyScores();
  const flags = new Set<AssessmentFlag>();
  let highestUrgencyRank = urgencyRank.low;

  for (const selected of selectedAnswers) {
    for (const [pathway, score] of Object.entries(selected.option.score ?? {})) {
      pathwayScores[pathway as CarePathway] += score ?? 0;
    }

    for (const flag of selected.option.flags ?? []) {
      flags.add(flag);
    }

    if (selected.option.urgency) {
      highestUrgencyRank = Math.max(highestUrgencyRank, urgencyRank[selected.option.urgency]);
    }
  }

  applyRuleAdjustments(pathwayScores, flags);

  const urgencyLevel = determineUrgencyLevel(pathwayScores, flags, highestUrgencyRank);
  const primaryPathway = determinePrimaryPathway(pathwayScores, flags);
  const secondaryPathways = determineSecondaryPathways(pathwayScores, primaryPathway, flags);
  const reasons = buildReasons(selectedAnswers, flags, primaryPathway);
  const { headline, summary } = buildResultCopy(primaryPathway, urgencyLevel);
  const actionPlanSteps = buildActionPlanSteps(primaryPathway, secondaryPathways, flags, urgencyLevel);

  return {
    primaryPathway,
    secondaryPathways,
    urgencyLevel,
    riskFlags: Array.from(flags),
    headline,
    summary,
    reasons,
    actionPlanSteps,
    recommendedNextPages: buildRecommendedNextPages(),
    disclaimer: assessmentDisclaimer,
    completedAt: new Date().toISOString(),
    answers,
    pathwayScores,
  };
}

function createEmptyScores(): Record<CarePathway, number> {
  return {
    support_at_home: 0,
    residential_care: 0,
    respite_care: 0,
    urgent_hospital_discharge: 0,
    my_aged_care_assessment: 0,
    financial_planning: 0,
    family_coordination: 0,
  };
}

function getSelectedAnswers(answers: AssessmentAnswer[]): SelectedAnswer[] {
  return answers.flatMap((answer) => {
    const question = assessmentQuestions.find((item) => item.id === answer.questionId);
    const option = question?.options.find((item) => item.id === answer.optionId);

    if (!question || !option) {
      return [];
    }

    return [{ answer, question, option }];
  });
}

function applyRuleAdjustments(scores: Record<CarePathway, number>, flags: Set<AssessmentFlag>) {
  if (flags.has("hospital_discharge_now")) {
    scores.urgent_hospital_discharge += 3;
    scores.respite_care += 1;
  }

  if (flags.has("immediate_safety_risk")) {
    scores.urgent_hospital_discharge += 2;
    scores.residential_care += 2;
  }

  if (flags.has("high_personal_care_need") && flags.has("cognitive_safety_concern")) {
    scores.residential_care += 2;
  }

  if (flags.has("my_aged_care_needed")) {
    scores.my_aged_care_assessment += 2;
  }

  if (flags.has("cost_concern")) {
    scores.financial_planning += 2;
  }

  if (flags.has("carer_strain")) {
    scores.family_coordination += 1;
    scores.respite_care += 1;
  }

  if (flags.has("location_unclear")) {
    scores.family_coordination += 1;
  }
}

function determineUrgencyLevel(
  scores: Record<CarePathway, number>,
  flags: Set<AssessmentFlag>,
  highestUrgencyRank: number,
): UrgencyLevel {
  if (
    flags.has("hospital_discharge_now") ||
    flags.has("immediate_safety_risk") ||
    scores.urgent_hospital_discharge >= 6 ||
    highestUrgencyRank === urgencyRank.high
  ) {
    return "high";
  }

  if (
    highestUrgencyRank === urgencyRank.medium ||
    scores.residential_care >= 5 ||
    scores.support_at_home >= 5 ||
    scores.respite_care >= 4 ||
    scores.family_coordination >= 4
  ) {
    return "medium";
  }

  return "low";
}

function determinePrimaryPathway(
  scores: Record<CarePathway, number>,
  flags: Set<AssessmentFlag>,
): CarePathway {
  if (
    flags.has("hospital_discharge_now") ||
    (flags.has("immediate_safety_risk") && scores.urgent_hospital_discharge >= scores.residential_care - 1)
  ) {
    return "urgent_hospital_discharge";
  }

  if (scores.residential_care >= 8 && scores.residential_care >= scores.support_at_home - 1) {
    return "residential_care";
  }

  if (scores.respite_care >= 7 && scores.respite_care > scores.support_at_home) {
    return "respite_care";
  }

  if (scores.my_aged_care_assessment >= 7 && scores.support_at_home < 5 && scores.residential_care < 5) {
    return "my_aged_care_assessment";
  }

  if (scores.family_coordination >= 7 && scores.support_at_home < 5 && scores.residential_care < 5) {
    return "family_coordination";
  }

  return primaryPathwayPriority.reduce((bestPathway, pathway) => {
    if (pathway === "financial_planning") {
      return bestPathway;
    }

    if (scores[pathway] > scores[bestPathway]) {
      return pathway;
    }

    return bestPathway;
  }, "support_at_home" as CarePathway);
}

function determineSecondaryPathways(
  scores: Record<CarePathway, number>,
  primaryPathway: CarePathway,
  flags: Set<AssessmentFlag>,
): CarePathway[] {
  const secondary = allCarePathways
    .filter((pathway) => pathway !== primaryPathway)
    .filter((pathway) => scores[pathway] >= 3)
    .sort((a, b) => scores[b] - scores[a]);

  if (flags.has("my_aged_care_needed")) {
    secondary.unshift("my_aged_care_assessment");
  }

  if (flags.has("cost_concern")) {
    secondary.unshift("financial_planning");
  }

  if (flags.has("carer_strain")) {
    secondary.unshift("family_coordination", "respite_care");
  }

  if (primaryPathway === "urgent_hospital_discharge" && scores.residential_care >= 4) {
    secondary.unshift("residential_care");
  }

  return uniquePathways(secondary)
    .filter((pathway) => pathway !== primaryPathway)
    .slice(0, 5);
}

function buildReasons(
  selectedAnswers: SelectedAnswer[],
  flags: Set<AssessmentFlag>,
  primaryPathway: CarePathway,
): string[] {
  const selectedOptionIds = new Set(selectedAnswers.map((item) => item.option.id));
  const reasons: string[] = [];

  if (flags.has("hospital_discharge_now")) {
    reasons.push("A recent or current hospital discharge can make timing and safe support the first priority.");
  }

  if (flags.has("immediate_safety_risk")) {
    reasons.push("Your answers suggest safety at home may need to be reviewed before relying on the current routine.");
  }

  if (flags.has("high_personal_care_need")) {
    reasons.push("Personal care or daily routines may now need more consistent support.");
  }

  if (flags.has("cognitive_safety_concern")) {
    reasons.push("Memory or confusion concerns could affect how much support is needed day to day.");
  }

  if (flags.has("carer_strain")) {
    reasons.push("Family or carer pressure appears to be a meaningful part of the decision.");
  }

  if (flags.has("my_aged_care_needed")) {
    reasons.push("Your My Aged Care status may need to be confirmed before funded services can be planned.");
  }

  if (flags.has("cost_concern")) {
    reasons.push("Residential aged care costs and fee choices may need careful explanation before decisions are made.");
  }

  if (selectedOptionIds.has("preference_stay_home")) {
    reasons.push("Staying at home is an important preference, so home support should be explored first where safe.");
  }

  if (selectedOptionIds.has("location_regional")) {
    reasons.push("A regional or rural location may make availability and timing important to check early.");
  }

  if (selectedOptionIds.has("location_remote_family")) {
    reasons.push("Coordinating from another city or state can make shared notes, roles, and follow-up tasks more important.");
  }

  if (reasons.length === 0) {
    reasons.push(
      `${carePathwayLabels[primaryPathway]} may be worth considering based on the overall pattern of your answers.`,
    );
    reasons.push("Your answers suggest planning ahead could help the family make decisions with more confidence.");
  }

  return reasons.slice(0, 6);
}

function buildResultCopy(primaryPathway: CarePathway, urgencyLevel: UrgencyLevel) {
  const urgencyPhrase =
    urgencyLevel === "high"
      ? "time-sensitive"
      : urgencyLevel === "medium"
        ? "important to plan soon"
        : "suitable for calm planning";

  const copy: Record<CarePathway, { headline: string; summary: string }> = {
    support_at_home: {
      headline: "Support at home may be the first pathway to explore.",
      summary: `Based on your answers, extra support at home could be relevant. This may include practical help, personal care, transport, meals, health routines, or a clearer family support plan. The situation looks ${urgencyPhrase}, so the next step is to understand what support is needed and how it may be organised.`,
    },
    residential_care: {
      headline: "Residential aged care may be worth considering.",
      summary: `Based on your answers, care needs may be moving beyond what the current home arrangement can comfortably support. Residential aged care could be relevant to explore alongside short-term options, My Aged Care steps, family preferences, and cost questions. This is general guidance only, not a decision or eligibility outcome.`,
    },
    respite_care: {
      headline: "Respite care may help create breathing room.",
      summary: `Based on your answers, short-term respite could be relevant while the family reviews care needs, carer capacity, and longer-term options. Respite may be useful when support is stretched but the final pathway is not settled yet.`,
    },
    urgent_hospital_discharge: {
      headline: "Time-sensitive support should be prioritised.",
      summary: `Based on your answers, the immediate next step may be a safe transition plan, especially if hospital discharge, sudden decline, or current safety risk is involved. This does not determine eligibility or replace professional advice; it highlights that timing and safety may need attention now.`,
    },
    my_aged_care_assessment: {
      headline: "Confirming the My Aged Care pathway may be the next step.",
      summary: `Based on your answers, the family may benefit from understanding or confirming My Aged Care status before comparing services. This could include checking whether an assessment has happened, what services are approved, or what interim support may be needed.`,
    },
    financial_planning: {
      headline: "Aged care cost planning may need attention.",
      summary: `Based on your answers, cost questions could affect the next decision. It may be useful to understand general fee concepts and consider independent financial advice before making residential aged care decisions.`,
    },
    family_coordination: {
      headline: "Family coordination may be the most useful first step.",
      summary: `Based on your answers, the family may need clearer roles, shared notes, and a practical plan before provider decisions feel manageable. This can sit alongside My Aged Care steps, respite, support at home, or residential care research.`,
    },
  };

  return copy[primaryPathway];
}

function buildActionPlanSteps(
  primaryPathway: CarePathway,
  secondaryPathways: CarePathway[],
  flags: Set<AssessmentFlag>,
  urgencyLevel: UrgencyLevel,
): ActionPlanStep[] {
  const steps: ActionPlanStep[] = [];

  if (urgencyLevel === "high") {
    steps.push({
      id: "safety-first",
      title: "Clarify immediate safety and timing",
      description:
        "If they are in hospital, recently discharged, or unsafe at home today, ask the hospital, GP, or relevant care contacts what needs to be in place before relying on the current arrangement.",
      pathway: "urgent_hospital_discharge",
      priority: "now",
    });
  }

  if (primaryPathway === "support_at_home") {
    steps.push({
      id: "map-home-support",
      title: "List the support needed at home",
      description:
        "Write down the weekly help needed for personal care, meals, cleaning, transport, medication routines, safety checks, and family responsibilities.",
      pathway: "support_at_home",
      priority: "now",
    });
  }

  if (primaryPathway === "residential_care") {
    steps.push({
      id: "residential-readiness",
      title: "Start a residential care readiness list",
      description:
        "Capture preferred locations, must-have care needs, family questions, timing pressures, and what would make a home feel suitable.",
      pathway: "residential_care",
      priority: "now",
      href: "/providers",
    });
  }

  if (primaryPathway === "respite_care") {
    steps.push({
      id: "respite-options",
      title: "Explore short-term respite options",
      description:
        "Consider whether respite could give the family time to recover, gather information, or plan the next longer-term care pathway.",
      pathway: "respite_care",
      priority: "now",
      href: "/providers",
    });
  }

  if (primaryPathway === "urgent_hospital_discharge") {
    steps.push({
      id: "discharge-questions",
      title: "Prepare discharge and transition questions",
      description:
        "Ask what support is needed for the first 24 to 72 hours, who is responsible for each task, and whether short-term or residential options should be explored.",
      pathway: "urgent_hospital_discharge",
      priority: "now",
    });
  }

  if (secondaryPathways.includes("my_aged_care_assessment") || flags.has("my_aged_care_needed")) {
    steps.push({
      id: "confirm-my-aged-care",
      title: "Confirm My Aged Care status",
      description:
        "Check whether an assessment has happened, what services are approved, and what information the family should have ready for the next conversation.",
      pathway: "my_aged_care_assessment",
      priority: urgencyLevel === "low" ? "soon" : "now",
    });
  }

  if (secondaryPathways.includes("financial_planning") || flags.has("cost_concern")) {
    steps.push({
      id: "cost-questions",
      title: "Create a list of cost questions",
      description:
        "Write down what the family needs to understand about fees, contributions, RAD, DAP, daily payments, and when independent financial advice may be useful.",
      pathway: "financial_planning",
      priority: "soon",
      href: "/costs",
    });
  }

  if (secondaryPathways.includes("family_coordination") || flags.has("carer_strain")) {
    steps.push({
      id: "family-roles",
      title: "Agree on family roles and follow-ups",
      description:
        "Decide who will contact My Aged Care, speak with providers, gather documents, visit homes, track costs, and keep notes for the family.",
      pathway: "family_coordination",
      priority: "soon",
      href: "/dashboard/family",
    });
  }

  steps.push({
    id: "provider-shortlist",
    title: "Build an initial provider shortlist",
    description:
      "Once the likely pathway is clearer, compare providers by service fit, location, availability questions, family priorities, and next actions.",
    priority: "later",
    href: "/providers",
  });

  return uniqueSteps(steps).slice(0, 6);
}

function buildRecommendedNextPages(): RecommendedNextPage[] {
  return [
    {
      href: "/providers",
      label: "Browse providers",
      description: "Start a shortlist of providers that may fit the pathway and location.",
    },
    {
      href: "/compare",
      label: "Compare providers",
      description: "Review options side by side once you have a shortlist.",
    },
    {
      href: "/costs",
      label: "Understand costs",
      description: "Read plain-language cost guidance before making financial decisions.",
    },
    {
      href: "/sign-up",
      label: "Create an account",
      description: "Save action plans to your KinHarbour dashboard.",
    },
  ];
}

function uniquePathways(pathways: CarePathway[]) {
  return Array.from(new Set(pathways));
}

function uniqueSteps(steps: ActionPlanStep[]) {
  return Array.from(new Map(steps.map((step) => [step.id, step])).values());
}
