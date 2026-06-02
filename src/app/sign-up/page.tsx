import Link from "next/link";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const supabaseConfigured = hasSupabaseConfig();

  if (supabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    if (data?.claims) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <section className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Create account</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
          Save your KinHarbour work when accounts are ready.
        </h1>
        <p className="mt-5 text-lg leading-8 text-stone-700">
          Create an account now to access the protected dashboard foundation. Saving
          action plans, provider shortlists, and family collaboration will be added in
          the next build stages.
        </p>
        <div className="mt-6 rounded-lg bg-[#f1eadf] p-5 text-sm leading-6 text-stone-700">
          KinHarbour does not collect or store assessment answers in Supabase yet. The
          public tools remain available without an account.
        </div>
        <Link
          href="/resources/what-is-my-aged-care"
          className="mt-5 inline-flex w-fit rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
        >
          Read getting started guide
        </Link>
      </section>

      <SignUpForm supabaseConfigured={supabaseConfigured} />
    </main>
  );
}
