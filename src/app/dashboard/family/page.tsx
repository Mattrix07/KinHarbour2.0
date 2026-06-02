import Link from "next/link";

import { FamilyMembersList } from "@/components/dashboard/family-members-list";
import { InviteFamilyMemberForm } from "@/components/dashboard/invite-family-member-form";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";
import {
  getCurrentUserSummary,
  getFamilyMembersForCase,
  getPendingInvitationsForCase,
  isFamilyCaseOwner,
} from "@/lib/dashboard/family-actions";

export const dynamic = "force-dynamic";

type DashboardFamilyPageProps = {
  searchParams: Promise<{
    accepted?: string;
  }>;
};

export default async function DashboardFamilyPage({ searchParams }: DashboardFamilyPageProps) {
  const params = await searchParams;
  const { familyCase, errorMessage } = await getActiveFamilyCase();
  const user = await getCurrentUserSummary();

  if (!familyCase) {
    return (
      <EmptyCollaborationPage
        title="Create a family case before inviting family members."
        description={
          errorMessage ??
          "KinHarbour needs a family case so collaboration can be attached to the aged care journey you are organising."
        }
        ctaHref="/dashboard"
        ctaLabel="Go to dashboard"
      />
    );
  }

  const [{ members, errorMessage: membersError }, { invitations, errorMessage: invitationsError }] =
    await Promise.all([
      getFamilyMembersForCase(familyCase.id),
      getPendingInvitationsForCase(familyCase.id),
    ]);
  const canInvite = user ? await isFamilyCaseOwner(familyCase.id, user.id) : false;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[#146c60]">Family coordination</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
              Decision team for {familyCase.care_recipient_name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone-700">
              Invite siblings, spouses, relatives, or carers helping coordinate practical
              aged care decisions, tasks, and notes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/tasks"
              className="rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
            >
              View tasks
            </Link>
            <Link
              href="/dashboard/notes"
              className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
            >
              View notes
            </Link>
          </div>
        </div>
      </section>

      {params.accepted === "true" ? (
        <p className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950">
          Invitation accepted. You have joined this family case for coordination.
        </p>
      ) : null}

      {(membersError || invitationsError) ? (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          {membersError ?? invitationsError}
        </p>
      ) : null}

      <div className="mt-8">
        <DisclaimerBox title="Coordination only">
          <p>
            Family collaboration helps organise communication and shared follow-up. It does
            not confirm legal decision-making authority, power of attorney, or formal
            representative status.
          </p>
        </DisclaimerBox>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <FamilyMembersList members={members} pendingInvitations={invitations} />
        <InviteFamilyMemberForm canInvite={canInvite} />
      </section>
    </main>
  );
}

function EmptyCollaborationPage({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase text-[#146c60]">Family coordination</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-950">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">{description}</p>
        <Link
          href={ctaHref}
          className="mt-6 inline-flex rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          {ctaLabel}
        </Link>
      </section>
    </main>
  );
}
