import Link from "next/link";

const pathwaySteps = [
  "Assessment",
  "Pathway recommendation",
  "Action plan",
  "Dashboard",
  "Provider shortlist",
];

const homepageCards = [
  {
    title: "Home care and support at home",
    body: "Capture goals, current support, risks, and practical next steps for staying safely at home.",
  },
  {
    title: "Respite and urgent transitions",
    body: "Organise the first decisions when a carer needs relief or a hospital discharge is approaching.",
  },
  {
    title: "Residential aged care decisions",
    body: "Compare suitability, questions to ask, family responsibilities, and cost concepts before committing.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase text-[#146c60]">
            Australian aged care navigation
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-stone-950 sm:text-6xl">
            Find the right aged care pathway with less uncertainty.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            KinHarbour helps families, adult children, spouses, and carers turn a complex
            aged care situation into a clear recommendation, practical action plan, and
            provider comparison workflow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/assessment"
              className="rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
            >
              Start assessment
            </Link>
            <Link
              href="/providers"
              className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
            >
              Browse providers
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-stone-500">MVP decision flow</p>
          <div className="mt-5 space-y-3">
            {pathwaySteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-lg bg-[#f8f5ef] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#d8eee7] text-sm font-semibold text-[#146c60]">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-stone-900">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-[#28433f] p-5 text-white">
            <p className="text-sm font-semibold">Built for families first</p>
            <p className="mt-2 text-sm leading-6 text-[#e7f2ee]">
              Providers are listed data sources at MVP stage. Provider accounts, payments,
              AI chat, and full backend data migrations come later.
            </p>
          </div>
        </aside>
      </section>

      <section className="border-y border-stone-200 bg-[#f1eadf]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          {homepageCards.map((card) => (
            <article key={card.title} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-950">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">{card.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
