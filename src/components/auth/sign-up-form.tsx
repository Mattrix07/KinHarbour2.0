"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function SignUpForm({ supabaseConfigured }: { supabaseConfigured: boolean }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
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
      setErrorMessage("Enter an email and password to create an account.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Use a password with at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim() || null,
          },
          emailRedirectTo: `${window.location.origin}/login?confirmed=true`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setMessage(
        "Account created. If email confirmation is enabled in Supabase, check your inbox before logging in.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong while creating the account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-stone-950">Create your KinHarbour account</h2>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        Create an account to save your aged care action plan, shortlist providers, and
        collaborate with family members when those features are added.
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
        <label className="block" htmlFor="fullName">
          <span className="text-sm font-semibold text-stone-700">Name optional</span>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>

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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>

        <label className="block" htmlFor="confirmPassword">
          <span className="text-sm font-semibold text-stone-700">Confirm password</span>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !supabaseConfigured}
        className="mt-6 w-full rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="mt-5 text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#146c60] hover:text-[#0f5148]">
          Log in
        </Link>
      </p>
    </form>
  );
}
