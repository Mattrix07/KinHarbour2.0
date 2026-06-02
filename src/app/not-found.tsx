import Link from "next/link";

import { DisclaimerBox } from "@/components/disclaimer-box";

export default function NotFoundPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Page not found</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
          We could not find that KinHarbour page.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700">
          The page may have moved, or the link may no longer be current. You can return to
          the main navigation and continue from one of the core tools.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            Go home
          </Link>
          <Link
            href="/assessment"
            className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
          >
            Start assessment
          </Link>
          <Link
            href="/resources"
            className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
          >
            Browse resources
          </Link>
        </div>
      </section>

      <div className="mt-6">
        <DisclaimerBox>
          <p>
            KinHarbour provides general navigation support only. It does not determine
            eligibility and does not replace My Aged Care, medical, legal, or financial
            advice.
          </p>
        </DisclaimerBox>
      </div>
    </main>
  );
}
