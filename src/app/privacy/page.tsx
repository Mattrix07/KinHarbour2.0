import { PageShell } from "@/components/page-shell";
import { DisclaimerBox } from "@/components/disclaimer-box";

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="Privacy and safety notes for the KinHarbour MVP."
      description="KinHarbour is collecting only the basic account and family-case information needed to organise the current MVP experience. Avoid adding unnecessary sensitive health, legal, or financial details."
      links={[
        {
          href: "/assessment",
          label: "Assessment",
          description: "Complete a general navigation assessment and save it only when logged in.",
        },
        {
          href: "/contact",
          label: "Contact",
          description: "See the current contact placeholder and support notes.",
        },
      ]}
    >
      <section className="grid gap-4 md:grid-cols-2">
        <PrivacyCard
          title="What the MVP may store"
          body="If you create an account, KinHarbour may store your email, optional name, family case details, saved assessment results, shortlisted providers, family member records, invitations, tasks, and notes."
        />
        <PrivacyCard
          title="What to avoid adding"
          body="Do not add unnecessary medical history, legal documents, financial account details, government identifiers, passwords, or emergency information into tasks or notes."
        />
        <PrivacyCard
          title="Who can see family case data"
          body="Dashboard data is intended to be visible only to logged-in members of the relevant family case, subject to the Supabase Row Level Security policies being installed correctly."
        />
        <PrivacyCard
          title="Provider and resource content"
          body="Provider and resource records are informational content. KinHarbour does not endorse providers and does not replace My Aged Care, provider verification, or professional advice."
        />
      </section>

      <div className="mt-8">
        <DisclaimerBox title="General information only">
          <p>
            KinHarbour provides general navigation support. It does not determine
            eligibility and does not replace My Aged Care, medical, legal, or financial
            advice. Privacy controls depend on correct Supabase configuration before
            production deployment.
          </p>
        </DisclaimerBox>
      </div>
    </PageShell>
  );
}

function PrivacyCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-700">{body}</p>
    </article>
  );
}
