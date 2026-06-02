import Link from "next/link";
import type { ReactNode } from "react";

import {
  acceptFamilyInvitation,
  getCurrentUserSummary,
  getInvitationByToken,
} from "@/lib/dashboard/family-actions";

export const dynamic = "force-dynamic";

type InvitePageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function InvitePage({ params, searchParams }: InvitePageProps) {
  const { token } = await params;
  const query = await searchParams;
  const user = await getCurrentUserSummary();

  if (!user) {
    return (
      <InviteShell
        title="Log in or create an account to accept this invitation."
        description="Family invitations are linked to the email address that was invited. Log in or sign up first, then return to this link to join the family case."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/login?next=/invite/${token}`}
            className="rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
          >
            Sign up
          </Link>
        </div>
      </InviteShell>
    );
  }

  const { invitation, errorMessage } = await getInvitationByToken(token);

  if (query.error || !invitation) {
    return (
      <InviteShell
        title="This invitation could not be accepted."
        description={
          errorMessage ??
          "The link may be invalid, expired, already accepted, or linked to a different email address."
        }
      >
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          Go to dashboard
        </Link>
      </InviteShell>
    );
  }

  if (invitation.status !== "pending") {
    return (
      <InviteShell
        title="This invitation is no longer pending."
        description="It may already have been accepted or replaced with a newer invitation link."
      >
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          Go to dashboard
        </Link>
      </InviteShell>
    );
  }

  if (isExpired(invitation.expires_at)) {
    return (
      <InviteShell
        title="This invitation has expired."
        description="Ask the family case owner to create a new invitation link."
      >
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          Go to dashboard
        </Link>
      </InviteShell>
    );
  }

  return (
    <InviteShell
      title="Accept family invitation"
      description={`You are signed in as ${user.email ?? "this account"}. Accepting will add this account to the family case for coordination only.`}
    >
      <form action={acceptFamilyInvitation.bind(null, token)} className="mt-6">
        <button
          type="submit"
          className="rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          Accept invitation
        </button>
      </form>
      <p className="mt-5 rounded-lg bg-[#f1eadf] p-4 text-sm leading-6 text-stone-700">
        Family collaboration is for coordination only. It does not confirm legal
        decision-making authority, power of attorney, or formal representative status.
      </p>
    </InviteShell>
  );
}

function InviteShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Family invitation</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">{description}</p>
        {children}
      </section>
    </main>
  );
}

function isExpired(value: string | null) {
  if (!value) {
    return false;
  }

  return new Date(value).getTime() < Date.now();
}
