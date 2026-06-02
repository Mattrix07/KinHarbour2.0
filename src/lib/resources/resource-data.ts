import type { ResourceArticle } from "./types";

const standardDisclaimer =
  "This guide is general information only. It is not official government guidance and does not replace My Aged Care, medical, legal, financial, or provider advice. Families should verify details with the relevant official sources and professionals.";

export const resourceArticles: ResourceArticle[] = [
  {
    id: "what-is-my-aged-care",
    title: "What is My Aged Care?",
    slug: "what-is-my-aged-care",
    category: "getting_started",
    summary:
      "A plain-English overview of My Aged Care and how families can prepare for the first steps.",
    readingTimeMinutes: 5,
    audience: "Families starting aged care research for a parent or relative",
    lastReviewedAt: "2026-05-21",
    contentSections: [
      {
        id: "introduction",
        heading: "Short introduction",
        paragraphs: [
          "My Aged Care is the main entry point many Australian families use when exploring government-supported aged care services. It can feel confusing at first, especially if decisions are being made during a stressful period.",
          "KinHarbour can help you organise questions and next steps, but it does not decide eligibility or replace official My Aged Care processes.",
        ],
      },
      {
        id: "explanation",
        heading: "Plain-English explanation",
        paragraphs: [
          "My Aged Care helps connect older people with assessment pathways and information about aged care services. Depending on the situation, the next step may involve a phone discussion, an assessment, service approvals, or advice about local supports.",
          "The exact pathway can depend on care needs, urgency, location, and current supports. Families should confirm details directly with My Aged Care.",
        ],
      },
      {
        id: "when-it-matters",
        heading: "When this topic matters",
        paragraphs: [
          "This matters when an older person needs help at home, respite, residential care, or a clearer plan after a change in health or family capacity.",
        ],
        listItems: [
          "You are not sure whether an assessment has happened.",
          "Current support at home is no longer enough.",
          "A hospital discharge or sudden decline has made decisions more urgent.",
          "Family members are unsure what to ask or prepare.",
        ],
      },
      {
        id: "next-steps",
        heading: "Practical next steps",
        paragraphs: [
          "Start by writing down the older person's daily support needs, safety concerns, current services, key contacts, and who in the family can help with calls or paperwork.",
        ],
        listItems: [
          "Confirm whether the person is already registered with My Aged Care.",
          "Gather Medicare details, current services, GP contact details, and a simple summary of support needs.",
          "Use the KinHarbour assessment to organise the situation before making calls.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [
          "Families often wait until a crisis before gathering information. A short written summary can make conversations calmer and more useful.",
        ],
        listItems: [
          "Assuming eligibility before an official assessment.",
          "Relying on memory instead of keeping notes.",
          "Leaving one family member to manage every task alone.",
        ],
      },
    ],
    relatedLinks: [
      {
        href: "/assessment",
        label: "Start the free assessment",
        description: "Organise care needs and see which pathway may be worth exploring.",
      },
      {
        href: "/dashboard/action-plan",
        label: "Preview the action plan",
        description: "See where future family tasks and next steps will be organised.",
      },
    ],
    disclaimer: standardDisclaimer,
  },
  {
    id: "support-at-home-explained",
    title: "Support at Home explained",
    slug: "support-at-home-explained",
    category: "home_care",
    summary:
      "How families can think about practical help at home without assuming a specific service outcome.",
    readingTimeMinutes: 6,
    audience: "Families hoping an older person can keep living safely at home",
    lastReviewedAt: "2026-05-21",
    contentSections: [
      {
        id: "introduction",
        heading: "Short introduction",
        paragraphs: [
          "Many families first want to understand whether a parent can stay at home with more support. That can be a sensible place to start, as long as safety, carer pressure, and daily routines are considered honestly.",
        ],
      },
      {
        id: "explanation",
        heading: "Plain-English explanation",
        paragraphs: [
          "Support at home can include help with personal care, meals, cleaning, transport, appointments, medication routines, social connection, or home safety. The right mix depends on the person's needs and what the family can realistically sustain.",
          "KinHarbour can help you list the support that may be needed, but official service access and funding need to be confirmed through appropriate channels.",
        ],
      },
      {
        id: "when-it-matters",
        heading: "When this topic matters",
        paragraphs: [
          "Support at home is often relevant when the older person prefers to stay where they are, and the main concerns are practical tasks, confidence, mobility, or family coordination.",
        ],
        listItems: [
          "Meals, cleaning, transport, or shopping are getting harder.",
          "Family help is regular but starting to feel stretched.",
          "There are manageable safety concerns that need a clearer plan.",
          "The family wants to compare providers for home-based support later.",
        ],
      },
      {
        id: "next-steps",
        heading: "Practical next steps",
        paragraphs: [
          "Write down the week as it really works now. Note which tasks are handled by the older person, family, neighbours, private services, or existing aged care services.",
        ],
        listItems: [
          "List support needed each morning, afternoon, evening, and overnight.",
          "Identify what must happen for home to remain safe.",
          "Confirm My Aged Care status if government-supported services may be relevant.",
          "Use provider comparison once you know what services you are looking for.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [
          "It can be tempting to focus only on the older person's preference to stay home. Preference matters, but the plan also needs to consider safety, carer capacity, and whether support is available when needed.",
        ],
        listItems: [
          "Underestimating overnight or weekend support needs.",
          "Assuming one provider can meet every need without checking.",
          "Ignoring carer fatigue until the situation becomes urgent.",
        ],
      },
    ],
    relatedLinks: [
      {
        href: "/assessment",
        label: "Check the likely pathway",
        description: "Use the assessment to see whether support at home may fit your situation.",
      },
      {
        href: "/providers",
        label: "Browse providers",
        description: "Review provider information and start a shortlist.",
      },
    ],
    disclaimer: standardDisclaimer,
  },
  {
    id: "residential-aged-care-explained",
    title: "Residential aged care explained",
    slug: "residential-aged-care-explained",
    category: "residential_care",
    summary:
      "A calm overview of when families may start considering residential aged care and what to prepare.",
    readingTimeMinutes: 7,
    audience: "Families considering whether care at home is still enough",
    lastReviewedAt: "2026-05-21",
    contentSections: [
      {
        id: "introduction",
        heading: "Short introduction",
        paragraphs: [
          "Residential aged care can be an emotional topic. For many families, it comes up when daily needs, safety concerns, or carer pressure are becoming difficult to manage at home.",
        ],
      },
      {
        id: "explanation",
        heading: "Plain-English explanation",
        paragraphs: [
          "Residential aged care provides accommodation and ongoing care in a care home. Families usually need to consider care needs, location, room options, costs, cultural preferences, visits, and how the home communicates with relatives.",
          "This guide does not say whether residential care is required or whether someone is eligible. It is a way to organise early questions.",
        ],
      },
      {
        id: "when-it-matters",
        heading: "When this topic matters",
        paragraphs: [
          "Residential care may be worth exploring when support at home no longer feels safe, reliable, or sustainable.",
        ],
        listItems: [
          "The person needs frequent personal care or supervision.",
          "Memory or confusion concerns affect daily safety.",
          "The main carer cannot continue at the current level.",
          "A hospital discharge has raised questions about safe long-term care.",
        ],
      },
      {
        id: "next-steps",
        heading: "Practical next steps",
        paragraphs: [
          "Before touring homes, create a simple family brief. Include care needs, preferred suburbs, budget questions, must-have features, and what would make a home unsuitable.",
        ],
        listItems: [
          "Confirm assessment and approval status through official channels.",
          "Shortlist homes by location, care needs, room options, and family visiting practicalities.",
          "Prepare questions about staffing, communication, fees, and how care plans are reviewed.",
          "Consider independent financial advice before payment decisions.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [
          "Families can feel rushed and focus only on vacancies. Availability matters, but fit, communication, care needs, and cost questions also matter.",
        ],
        listItems: [
          "Choosing only by location without asking care-specific questions.",
          "Comparing fees without understanding what is included.",
          "Leaving siblings or key family members out of early discussions.",
        ],
      },
    ],
    relatedLinks: [
      {
        href: "/providers",
        label: "Browse aged care homes",
        description: "Use fictional demo listings to practise shortlisting and comparison.",
      },
      {
        href: "/costs",
        label: "Estimate RAD and DAP",
        description: "Model indicative accommodation payment scenarios.",
      },
    ],
    disclaimer: standardDisclaimer,
  },
  {
    id: "respite-care-explained",
    title: "Respite care explained",
    slug: "respite-care-explained",
    category: "respite_care",
    summary:
      "How respite care can give families breathing room while longer-term decisions are considered.",
    readingTimeMinutes: 5,
    audience: "Carers and families needing short-term support or relief",
    lastReviewedAt: "2026-05-21",
    contentSections: [
      {
        id: "introduction",
        heading: "Short introduction",
        paragraphs: [
          "Respite care can help when a carer needs a break, family support is stretched, or a short-term arrangement is needed while the next pathway is being considered.",
        ],
      },
      {
        id: "explanation",
        heading: "Plain-English explanation",
        paragraphs: [
          "Respite may happen in different settings depending on needs, availability, and assessment status. It can be planned in advance or explored after a change in circumstances.",
          "The details of access, cost, and availability should be checked with official sources and providers.",
        ],
      },
      {
        id: "when-it-matters",
        heading: "When this topic matters",
        paragraphs: [
          "Respite can be relevant when the older person needs temporary support, or when a carer needs time to rest, recover, work, travel, or manage family responsibilities.",
        ],
        listItems: [
          "The main carer is exhausted or unwell.",
          "The family needs time to compare longer-term care options.",
          "There is a gap after hospital discharge or a change at home.",
          "The older person may benefit from a short supported stay.",
        ],
      },
      {
        id: "next-steps",
        heading: "Practical next steps",
        paragraphs: [
          "Clarify the purpose of respite before calling providers. A rest break, recovery period, trial stay, or transition plan may lead to different questions.",
        ],
        listItems: [
          "Write down preferred dates and flexibility.",
          "List care needs that must be supported during the stay.",
          "Ask what the family needs to provide before admission.",
          "Confirm costs and availability directly with providers.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [
          "Respite can be hard to arrange at short notice, so it helps to explore options before the family is at breaking point.",
        ],
        listItems: [
          "Waiting until the carer is already overwhelmed.",
          "Assuming every home has respite available now.",
          "Not asking what happens if care needs change during the stay.",
        ],
      },
    ],
    relatedLinks: [
      {
        href: "/assessment",
        label: "Review carer pressure",
        description: "Use the assessment to see whether respite may be a useful pathway.",
      },
      {
        href: "/providers",
        label: "Search providers",
        description: "Filter providers by respite availability.",
      },
    ],
    disclaimer: standardDisclaimer,
  },
  {
    id: "rad-and-dap-explained",
    title: "RAD and DAP explained",
    slug: "rad-and-dap-explained",
    category: "costs",
    summary:
      "A simple explanation of accommodation payment terms and how families can model scenarios.",
    readingTimeMinutes: 6,
    audience: "Families comparing residential aged care accommodation costs",
    lastReviewedAt: "2026-05-21",
    contentSections: [
      {
        id: "introduction",
        heading: "Short introduction",
        paragraphs: [
          "RAD and DAP are common terms families see when comparing residential aged care accommodation costs. They can feel technical, but the basic idea is easier once you separate the lump sum and daily payment parts.",
        ],
      },
      {
        id: "explanation",
        heading: "Plain-English explanation",
        paragraphs: [
          "A Refundable Accommodation Deposit, or RAD, is an accommodation price that may be paid as a lump sum. A Daily Accommodation Payment, or DAP, is a daily amount linked to the unpaid part of the RAD.",
          "Families may see different payment combinations. Actual fees can depend on provider pricing, government settings, means assessment, personal circumstances, and advice specific to the family.",
        ],
      },
      {
        id: "when-it-matters",
        heading: "When this topic matters",
        paragraphs: [
          "This topic matters when residential care is being considered and the family needs to understand what questions to ask before making payment decisions.",
        ],
        listItems: [
          "You are comparing room prices across homes.",
          "The family is deciding whether a lump sum, daily payment, or mix may be possible.",
          "You need to understand how daily costs could affect cash flow.",
          "A decision may affect other financial planning questions.",
        ],
      },
      {
        id: "next-steps",
        heading: "Practical next steps",
        paragraphs: [
          "Use an indicative calculator to understand scenarios, then verify actual fees with the provider and consider independent financial advice before deciding.",
        ],
        listItems: [
          "Write down the quoted RAD and DAP figures from each provider.",
          "Ask what fees are included and what optional services cost extra.",
          "Use KinHarbour's cost modeller for indicative scenarios.",
          "Speak with an appropriate financial adviser for personal advice.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [
          "A calculator can help with understanding, but it is not a quote and does not account for every personal or regulatory factor.",
        ],
        listItems: [
          "Treating an indicative estimate as the final fee.",
          "Ignoring optional daily fees or extra services.",
          "Making payment decisions without checking personal financial implications.",
        ],
      },
    ],
    relatedLinks: [
      {
        href: "/costs",
        label: "Use the RAD/DAP modeller",
        description: "Enter a RAD, lump sum, and interest assumption to see indicative costs.",
      },
      {
        href: "/compare",
        label: "Compare providers",
        description: "Review indicative RAD and DAP fields across shortlisted homes.",
      },
    ],
    disclaimer:
      "This guide is general information only and is not financial advice. Actual costs may differ based on provider pricing, government rules, means assessment, and personal circumstances. Consider independent financial advice before aged care payment decisions.",
  },
  {
    id: "how-to-compare-aged-care-homes",
    title: "How to compare aged care homes",
    slug: "how-to-compare-aged-care-homes",
    category: "provider_comparison",
    summary:
      "A practical framework for comparing homes by care fit, location, communication, costs, and family priorities.",
    readingTimeMinutes: 7,
    audience: "Families building a residential aged care shortlist",
    lastReviewedAt: "2026-05-21",
    contentSections: [
      {
        id: "introduction",
        heading: "Short introduction",
        paragraphs: [
          "Comparing aged care homes is easier when the family agrees on what matters most before visiting or calling providers.",
        ],
      },
      {
        id: "explanation",
        heading: "Plain-English explanation",
        paragraphs: [
          "A good comparison is not only about ratings or cost. Families often need to compare care needs, location, room options, dementia or palliative support, communication style, visiting practicalities, and how the home responds to questions.",
          "KinHarbour does not endorse a provider. The goal is to help families review options more consistently.",
        ],
      },
      {
        id: "when-it-matters",
        heading: "When this topic matters",
        paragraphs: [
          "This matters once the family has two or more homes to consider, or when different relatives have different views about what should matter most.",
        ],
        listItems: [
          "You have several homes on a shortlist.",
          "Family members disagree about location, cost, or care fit.",
          "You need questions for tours or phone calls.",
          "You want to compare providers without relying on memory.",
        ],
      },
      {
        id: "next-steps",
        heading: "Practical next steps",
        paragraphs: [
          "Create a simple comparison table and use the same questions for each home. This makes differences easier to see.",
        ],
        listItems: [
          "Start with must-have care needs.",
          "Compare location and visiting practicality.",
          "Ask how the home communicates with family.",
          "Record costs, room types, and what needs verification.",
          "Use the KinHarbour compare tool to keep options side by side.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [
          "Stress can make families focus on the most recent phone call or tour. A written comparison helps reduce that effect.",
        ],
        listItems: [
          "Comparing homes using different questions.",
          "Assuming a high-level rating answers every care-fit question.",
          "Forgetting to ask about family updates, complaints, and care plan reviews.",
        ],
      },
    ],
    relatedLinks: [
      {
        href: "/providers",
        label: "Browse provider directory",
        description: "Search and filter provider records.",
      },
      {
        href: "/compare",
        label: "Open comparison table",
        description: "Compare up to five selected homes.",
      },
    ],
    disclaimer: standardDisclaimer,
  },
  {
    id: "what-to-do-after-hospital-discharge",
    title: "What to do after a hospital discharge",
    slug: "what-to-do-after-hospital-discharge",
    category: "hospital_discharge",
    summary:
      "How families can organise the first questions and tasks after a hospital stay or discharge plan.",
    readingTimeMinutes: 6,
    audience: "Families managing urgent transitions after hospital",
    lastReviewedAt: "2026-05-21",
    contentSections: [
      {
        id: "introduction",
        heading: "Short introduction",
        paragraphs: [
          "Hospital discharge can make aged care decisions feel sudden. Families may need to understand what support is needed immediately, what can wait, and who is responsible for each next step.",
        ],
      },
      {
        id: "explanation",
        heading: "Plain-English explanation",
        paragraphs: [
          "A discharge plan should help clarify the practical support needed after leaving hospital. This may include personal care, equipment, medication routines, transport, wound care, follow-up appointments, or temporary accommodation.",
          "Clinical and discharge advice should come from the hospital team, GP, or relevant health professionals. KinHarbour helps organise questions, not replace that advice.",
        ],
      },
      {
        id: "when-it-matters",
        heading: "When this topic matters",
        paragraphs: [
          "This topic matters when home may not be safe without extra support, or when the family is unsure whether respite, home support, or residential care should be explored.",
        ],
        listItems: [
          "The person is leaving hospital soon.",
          "Family members are unsure what needs to happen in the first 24 to 72 hours.",
          "There has been a sudden decline in mobility, memory, or confidence.",
          "The main carer cannot provide the level of support now required.",
        ],
      },
      {
        id: "next-steps",
        heading: "Practical next steps",
        paragraphs: [
          "Before discharge, ask for clear written instructions and write down who is responsible for each task.",
        ],
        listItems: [
          "Ask what support is needed on day one at home.",
          "Confirm medication, equipment, transport, and follow-up appointments.",
          "Ask who to contact if the plan is not working.",
          "Use KinHarbour's assessment to organise urgency and pathway options.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [
          "Discharge conversations can move quickly. Families should ask questions until responsibilities and safety arrangements are clear.",
        ],
        listItems: [
          "Leaving hospital without knowing who to call if support breaks down.",
          "Assuming family can safely manage all new care tasks.",
          "Not asking whether temporary respite or extra support should be explored.",
        ],
      },
    ],
    relatedLinks: [
      {
        href: "/assessment",
        label: "Start urgent pathway assessment",
        description: "Organise discharge concerns and see what pathway may be relevant.",
      },
      {
        href: "/providers",
        label: "Review provider options",
        description: "Browse providers if respite or residential care may need review.",
      },
    ],
    disclaimer:
      "This guide is general information only and is not medical or discharge advice. Families should follow hospital, GP, and relevant clinical advice and verify aged care steps with official sources.",
  },
  {
    id: "questions-to-ask-on-an-aged-care-home-tour",
    title: "Questions to ask on an aged care home tour",
    slug: "questions-to-ask-on-an-aged-care-home-tour",
    category: "provider_comparison",
    summary:
      "A practical question list for families visiting or calling aged care homes.",
    readingTimeMinutes: 6,
    audience: "Families preparing for provider calls or tours",
    lastReviewedAt: "2026-05-21",
    contentSections: [
      {
        id: "introduction",
        heading: "Short introduction",
        paragraphs: [
          "Tours can be emotional and easy to forget afterwards. Taking a consistent question list helps families compare homes more clearly.",
        ],
      },
      {
        id: "explanation",
        heading: "Plain-English explanation",
        paragraphs: [
          "A tour is a chance to understand care fit, daily routines, communication, rooms, fees, visiting, and what happens if needs change. It is also a chance to notice whether staff answer questions clearly and respectfully.",
        ],
      },
      {
        id: "when-it-matters",
        heading: "When this topic matters",
        paragraphs: [
          "This matters when a home is on the shortlist or the family needs to choose quickly but still wants a careful process.",
        ],
        listItems: [
          "You are visiting several homes in a short time.",
          "Different relatives will attend different tours.",
          "The older person has specific care, cultural, language, or family needs.",
          "Costs and room options need clearer explanation.",
        ],
      },
      {
        id: "next-steps",
        heading: "Practical next steps",
        paragraphs: [
          "Bring the same questions to each provider and record answers straight after the visit.",
        ],
        listItems: [
          "Ask how care plans are created and reviewed.",
          "Ask how families are contacted if something changes.",
          "Ask what fees are included and what costs extra.",
          "Ask what support is available for dementia, palliative care, respite, or couples if relevant.",
          "Write down your impressions while they are fresh.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [
          "A warm tour experience matters, but it should be balanced with practical questions about care, costs, and communication.",
        ],
        listItems: [
          "Only touring the room and not asking care questions.",
          "Forgetting to ask how complaints or concerns are handled.",
          "Not checking whether the home can support changing needs.",
        ],
      },
    ],
    relatedLinks: [
      {
        href: "/compare",
        label: "Compare shortlisted homes",
        description: "Keep tour notes and provider details side by side.",
      },
      {
        href: "/providers",
        label: "Return to provider directory",
        description: "Open provider profiles before calls or tours.",
      },
    ],
    disclaimer: standardDisclaimer,
  },
  {
    id: "how-to-talk-with-siblings-about-aged-care-decisions",
    title: "How to talk with siblings about aged care decisions",
    slug: "how-to-talk-with-siblings-about-aged-care-decisions",
    category: "family_decision_making",
    summary:
      "How families can make aged care conversations calmer, clearer, and less dependent on one person.",
    readingTimeMinutes: 6,
    audience: "Adult children and relatives sharing care decisions",
    lastReviewedAt: "2026-05-21",
    contentSections: [
      {
        id: "introduction",
        heading: "Short introduction",
        paragraphs: [
          "Aged care decisions often bring up old family patterns, guilt, distance, money concerns, and different views about what a parent needs. A clear structure can make conversations less heated.",
        ],
      },
      {
        id: "explanation",
        heading: "Plain-English explanation",
        paragraphs: [
          "Family decision-making works better when people separate facts, feelings, tasks, and decisions. Not everyone needs to do the same amount, but responsibilities should be visible.",
        ],
      },
      {
        id: "when-it-matters",
        heading: "When this topic matters",
        paragraphs: [
          "This matters when one person is carrying most of the work, siblings disagree, or decisions are being made quickly after a change in health or care needs.",
        ],
        listItems: [
          "One sibling lives nearby and others are interstate.",
          "There is disagreement about home care, respite, or residential care.",
          "Money questions are creating tension.",
          "The family needs to speak with providers or My Aged Care consistently.",
        ],
      },
      {
        id: "next-steps",
        heading: "Practical next steps",
        paragraphs: [
          "Start with a shared summary. Keep it factual and short: what has changed, what support is happening now, what decisions are needed, and by when.",
        ],
        listItems: [
          "Assign one person to keep notes.",
          "Separate urgent decisions from longer-term questions.",
          "Give each person a clear task, even if they cannot provide hands-on care.",
          "Agree what information needs to be verified before deciding.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [
          "Families can lose time arguing about conclusions before agreeing on the facts. Start with shared information, then move to options.",
        ],
        listItems: [
          "Assuming everyone has the same information.",
          "Letting one person become the only source of truth.",
          "Mixing financial, emotional, and care decisions into one rushed conversation.",
        ],
      },
    ],
    relatedLinks: [
      {
        href: "/dashboard/family",
        label: "Preview family coordination",
        description: "See where shared roles and tasks will be organised later.",
      },
      {
        href: "/assessment",
        label: "Create a shared care summary",
        description: "Use assessment questions to get family context into one place.",
      },
    ],
    disclaimer:
      "This guide is general information only and is not counselling, legal, financial, or medical advice. Families should seek appropriate professional support where needed.",
  },
  {
    id: "what-to-prepare-before-contacting-providers",
    title: "What to prepare before contacting providers",
    slug: "what-to-prepare-before-contacting-providers",
    category: "provider_comparison",
    summary:
      "A simple preparation checklist before calling home care, respite, or residential aged care providers.",
    readingTimeMinutes: 5,
    audience: "Families ready to contact aged care providers",
    lastReviewedAt: "2026-05-21",
    contentSections: [
      {
        id: "introduction",
        heading: "Short introduction",
        paragraphs: [
          "Provider calls are easier when the family has the basics ready. A short preparation list can make each conversation more useful and reduce repeated explanations.",
        ],
      },
      {
        id: "explanation",
        heading: "Plain-English explanation",
        paragraphs: [
          "Providers may ask about care needs, location, timing, assessment status, preferred services, and whether the family is looking for home support, respite, or residential care.",
          "You do not need every answer before calling, but it helps to know what is known, what is uncertain, and what needs checking.",
        ],
      },
      {
        id: "when-it-matters",
        heading: "When this topic matters",
        paragraphs: [
          "This matters when the family is moving from general research into actual provider conversations.",
        ],
        listItems: [
          "You have a provider shortlist.",
          "You need to ask about respite or room availability.",
          "You are comparing service fit, costs, or location.",
          "Several family members may be calling different providers.",
        ],
      },
      {
        id: "next-steps",
        heading: "Practical next steps",
        paragraphs: [
          "Prepare a short script and use it consistently. This helps each provider respond to the same situation.",
        ],
        listItems: [
          "Summarise the older person's care needs in plain language.",
          "Know the preferred suburb or service area.",
          "Confirm timing and urgency.",
          "Have assessment status, current services, and key contact details nearby.",
          "Write down answers immediately after each call.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [
          "Families often call providers before agreeing what they are asking for. This can make answers harder to compare.",
        ],
        listItems: [
          "Calling without a clear pathway or location.",
          "Forgetting to ask whether information is current or indicative.",
          "Not recording who said what and when.",
        ],
      },
    ],
    relatedLinks: [
      {
        href: "/providers",
        label: "Open provider directory",
        description: "Search, filter, and open provider profiles.",
      },
      {
        href: "/compare",
        label: "Compare selected providers",
        description: "Keep shortlisted homes side by side.",
      },
    ],
    disclaimer: standardDisclaimer,
  },
];
