import { PageShell } from "@/components/page-shell";

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="KinHarbour is being built for families making aged care decisions."
      description="KinHarbour is an Australian aged care navigation and decision platform for adult children, spouses, carers, and families who need a clearer path through assessment, planning, costs, provider comparison, and coordination."
      links={[
        {
          href: "/assessment",
          label: "Assessment",
          description: "Start with the family situation and care pathway needs.",
        },
        {
          href: "/resources",
          label: "Resources",
          description: "Read plain-English guides for common aged care decisions.",
        },
      ]}
    />
  );
}
