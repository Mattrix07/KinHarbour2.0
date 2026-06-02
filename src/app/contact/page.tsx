import { PageShell } from "@/components/page-shell";

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Contact options will be added here later."
      description="This page will eventually provide safe, practical ways for families, carers, and partners to contact KinHarbour. No forms, backend submissions, or support workflows are wired up yet."
      links={[
        {
          href: "/about",
          label: "About KinHarbour",
          description: "Learn what the platform is being built to support.",
        },
        {
          href: "/privacy",
          label: "Privacy",
          description: "Review current MVP privacy and safety notes.",
        },
      ]}
    />
  );
}
