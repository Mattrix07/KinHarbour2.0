export type RouteItem = {
  href: string;
  label: string;
  description?: string;
};

export const publicRoutes: RouteItem[] = [
  {
    href: "/assessment",
    label: "Assessment",
    description: "Capture family needs, urgency, goals, and care context.",
  },
  {
    href: "/providers",
    label: "Providers",
    description: "Browse aged care provider information and service areas.",
  },
  {
    href: "/compare",
    label: "Compare",
    description: "Compare shortlisted providers side by side.",
  },
  {
    href: "/costs",
    label: "Costs",
    description: "Understand aged care cost concepts and funding pathways.",
  },
  {
    href: "/resources",
    label: "Resources",
    description: "Read guides for home care, respite, residential care, and discharge planning.",
  },
];

export const secondaryPublicRoutes: RouteItem[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export const accountRoutes: RouteItem[] = [
  {
    href: "/login",
    label: "Log in",
    description: "Account access for families and carers.",
  },
  {
    href: "/sign-up",
    label: "Sign up",
    description: "Create an account to save assessments, plans, and family coordination.",
  },
];

export const dashboardRoutes: RouteItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Family overview, recommended pathway, and next actions.",
  },
  {
    href: "/dashboard/action-plan",
    label: "Action plan",
    description: "Step-by-step care tasks matched to the family situation.",
  },
  {
    href: "/dashboard/assessment",
    label: "Assessment",
    description: "Saved assessment answers and care needs summary.",
  },
  {
    href: "/dashboard/shortlist",
    label: "Shortlist",
    description: "Saved providers for deeper review.",
  },
  {
    href: "/dashboard/compare",
    label: "Compare",
    description: "Dashboard view for provider comparison decisions.",
  },
  {
    href: "/dashboard/family",
    label: "Family",
    description: "Family coordination and shared roles.",
  },
  {
    href: "/dashboard/tasks",
    label: "Tasks",
    description: "Checklist for calls, documents, visits, and decisions.",
  },
  {
    href: "/dashboard/notes",
    label: "Notes",
    description: "Shared notes about providers, preferences, and conversations.",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    description: "Family case settings and basic account context.",
  },
];

export const adminRoutes: RouteItem[] = [
  {
    href: "/admin",
    label: "Admin",
    description: "Internal tools for managing provider and resource content.",
  },
];

export const routeMap = {
  public: publicRoutes,
  secondaryPublic: secondaryPublicRoutes,
  account: accountRoutes,
  dashboard: dashboardRoutes,
  admin: adminRoutes,
};
