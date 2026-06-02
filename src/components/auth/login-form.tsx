"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type LoginFormProps = {
  nextPath?: string;
  supabaseConfigured: boolean;
  notice?: string;
};

export function LoginForm({ nextPath = "/dashboard", supabaseConfigured, notice }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(notice ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!supabaseConfigured) {
      setErrorMessage("Supabase is not configured yet. Add the environment variables first.");
      return;
    }

    if (!email || !password) {
      setErrorMessage("Enter your email and password to log in.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push(safeNextPath(nextPath));
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong while logging in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-stone-950">Log in to KinHarbour</h2>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        Access your protected dashboard to save action plans, provider shortlists,
        family tasks, and notes.
      </p>

      {!supabaseConfigured ? (
        <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          Supabase environment variables are missing. Add them to `.env.local` before testing auth.
        </p>
      ) : null}

      {message ? (
        <p className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950">
          {message}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-950">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4">
        <label className="block" htmlFor="email">
          <span className="text-sm font-semibold text-stone-700">Email address</span>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>

        <label className="block" htmlFor="password">
          <span className="text-sm font-semibold text-stone-700">Password</span>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !supabaseConfigured}
        className="mt-6 w-full rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>

      <p className="mt-5 text-center text-sm text-stone-600">
        New to KinHarbour?{" "}
        <Link href="/sign-up" className="font-semibold text-[#146c60] hover:text-[#0f5148]">
          Create an account
        </Link>
      </p>
    </form>
  );
}

function safeNextPath(path: string) {
  if (path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }

  return "/dashboard";
}
