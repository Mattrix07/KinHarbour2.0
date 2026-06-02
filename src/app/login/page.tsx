import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    confirmed?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const supabaseConfigured = hasSupabaseConfig();

  if (supabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    if (data?.claims) {
      redirect("/dashboard");
    }
  }

  const notice =
    params.confirmed === "true"
      ? "Your email has been confirmed. You can log in now."
      : params.error === "supabase-not-configured"
        ? "Supabase is not configured yet. Add your environment variables before testing auth."
        : undefined;

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <section className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Account access</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
          Log in to continue your aged care plan.
        </h1>
        <p className="mt-5 text-lg leading-8 text-stone-700">
          Your account will become the place to save assessment results, action plans,
          shortlisted providers, family tasks, and notes. The dashboard is protected so
          your family case stays private to invited members.
        </p>
        <div className="mt-6 rounded-lg bg-[#f1eadf] p-5 text-sm leading-6 text-stone-700">
          You can still use the public assessment, provider directory, compare tool, cost
          modeller, and resources without logging in.
        </div>
        <Link
          href="/assessment"
          className="mt-5 inline-flex w-fit rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
        >
          Use free assessment
        </Link>
      </section>

      <LoginForm
        nextPath={params.next}
        notice={notice}
        supabaseConfigured={supabaseConfigured}
      />
    </main>
  );
}
