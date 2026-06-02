"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { FamilyInviteLink } from "@/components/dashboard/family-invite-link";
import { createFamilyInvitation } from "@/lib/dashboard/family-actions";
import type { InviteActionState } from "@/lib/dashboard/types";

const initialState: InviteActionState = {
  status: "idle",
};

export function InviteFamilyMemberForm({ canInvite }: { canInvite: boolean }) {
  const [state, formAction] = useActionState(createFamilyInvitation, initialState);

  if (!canInvite) {
    return (
      <div className="rounded-lg border border-stone-200 bg-[#f8f5ef] p-5">
        <h2 className="text-xl font-semibold text-stone-950">Invitations</h2>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Only the family case owner can invite new family members in this MVP. This does
          not confirm legal decision-making authority.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-stone-950">Invite a family member</h2>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        Create a link for a sibling, spouse, relative, or carer helping with coordination.
        Real email sending will be added later.
      </p>

      {state.message ? (
        <p
          className={
            state.status === "error"
              ? "mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-950"
              : "mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950"
          }
        >
          {state.message}
        </p>
      ) : null}

      <label className="mt-5 block" htmlFor="invited_email">
        <span className="text-sm font-semibold text-stone-700">Family member email</span>
        <input
          id="invited_email"
          name="invited_email"
          type="email"
          autoComplete="email"
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
        />
      </label>

      <SubmitButton />

      {state.inviteLink ? (
        <FamilyInviteLink inviteLink={state.inviteLink} invitedEmail={state.invitedEmail} />
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Creating invite..." : "Generate invite link"}
    </button>
  );
}
