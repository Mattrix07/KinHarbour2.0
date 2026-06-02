"use client";

import { useState } from "react";

type FamilyInviteLinkProps = {
  inviteLink: string;
  invitedEmail?: string;
};

export function FamilyInviteLink({ inviteLink, invitedEmail }: FamilyInviteLinkProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
  }

  return (
    <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <p className="text-sm font-semibold text-emerald-950">
        Invitation link created{invitedEmail ? ` for ${invitedEmail}` : ""}.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={inviteLink}
          className="min-w-0 flex-1 rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-stone-900"
        />
        <button
          type="button"
          onClick={copyLink}
          className="rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-emerald-950">
        Email sending is not active yet. Share this link manually with the invited family
        member for now.
      </p>
    </div>
  );
}
