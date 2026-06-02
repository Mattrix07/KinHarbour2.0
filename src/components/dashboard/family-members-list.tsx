import {
  familyMemberRoleLabels,
  type FamilyMember,
  type Invitation,
} from "@/lib/dashboard/types";

type FamilyMembersListProps = {
  members: FamilyMember[];
  pendingInvitations: Invitation[];
};

export function FamilyMembersList({ members, pendingInvitations }: FamilyMembersListProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-stone-950">Family members</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            People helping coordinate this aged care journey.
          </p>
        </div>
        <span className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-stone-800">
          {members.length}
        </span>
      </div>

      <div className="mt-5 divide-y divide-stone-200">
        {members.map((member) => (
          <article key={member.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="text-sm font-semibold text-stone-950">
                {member.profile?.full_name || member.profile?.email || "Family member"}
              </p>
              {member.profile?.email ? (
                <p className="mt-1 text-sm text-stone-600">{member.profile.email}</p>
              ) : null}
            </div>
            <span className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700">
              {familyMemberRoleLabels[member.role]}
            </span>
          </article>
        ))}
      </div>

      {pendingInvitations.length > 0 ? (
        <div className="mt-6 rounded-lg bg-[#f8f5ef] p-4">
          <h3 className="text-sm font-semibold uppercase text-[#146c60]">Pending invites</h3>
          <ul className="mt-3 space-y-2">
            {pendingInvitations.map((invitation) => (
              <li key={invitation.id} className="text-sm text-stone-700">
                {invitation.invited_email}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
