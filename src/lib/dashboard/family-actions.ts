"use server";

import { randomBytes } from "node:crypto";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";
import {
  type FamilyMember,
  type FamilyMemberRole,
  type Invitation,
  type InviteActionState,
  type ProfileSummary,
} from "@/lib/dashboard/types";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

const memberSelect = `
  id,
  created_at,
  family_case_id,
  user_id,
  role
`;

const invitationSelect = `
  id,
  created_at,
  family_case_id,
  invited_email,
  invited_by,
  token,
  status,
  expires_at
`;

export async function getFamilyMembersForCase(
  familyCaseId: string,
): Promise<{ members: FamilyMember[]; errorMessage?: string }> {
  if (!hasSupabaseConfig()) {
    return {
      members: [],
      errorMessage: "Supabase is not configured yet.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_members")
    .select(memberSelect)
    .eq("family_case_id", familyCaseId)
    .order("created_at", { ascending: true });

  if (error) {
    return {
      members: [],
      errorMessage:
        "Family member data is not ready yet. Run the Supabase SQL for collaboration, then refresh this page.",
    };
  }

  const profileMap = await getProfilesById((data ?? []).map((member) => member.user_id as string));

  return {
    members: (data ?? []).map((member) => ({
      id: member.id as string,
      created_at: member.created_at as string,
      family_case_id: member.family_case_id as string,
      user_id: member.user_id as string,
      role: member.role as FamilyMemberRole,
      profile: profileMap.get(member.user_id as string) ?? null,
    })),
  };
}

export async function getPendingInvitationsForCase(
  familyCaseId: string,
): Promise<{ invitations: Invitation[]; errorMessage?: string }> {
  if (!hasSupabaseConfig()) {
    return {
      invitations: [],
      errorMessage: "Supabase is not configured yet.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .select(invitationSelect)
    .eq("family_case_id", familyCaseId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      invitations: [],
      errorMessage:
        "Invitation data is not ready yet. Run the Supabase SQL for collaboration, then refresh this page.",
    };
  }

  return {
    invitations: (data ?? []).map((invitation) => invitation as Invitation),
  };
}

export async function createFamilyInvitation(
  _previousState: InviteActionState,
  formData: FormData,
): Promise<InviteActionState> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "Supabase is not configured yet.",
    };
  }

  const invitedEmail = getString(formData, "invited_email").toLowerCase();

  if (!isEmail(invitedEmail)) {
    return {
      status: "error",
      message: "Enter a valid email address.",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) {
    redirect("/login?next=/dashboard/family");
  }

  const { familyCase, errorMessage } = await getActiveFamilyCase();

  if (!familyCase) {
    return {
      status: "error",
      message: errorMessage ?? "Create a family case before inviting family members.",
    };
  }

  const isOwner = await isFamilyCaseOwner(familyCase.id, userId);

  if (!isOwner) {
    return {
      status: "error",
      message: "Only the family case owner can invite family members in this MVP.",
    };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("invitations").insert({
    family_case_id: familyCase.id,
    invited_email: invitedEmail,
    invited_by: userId,
    token,
    status: "pending",
    expires_at: expiresAt,
  });

  if (error) {
    return {
      status: "error",
      message: "We could not create this invitation yet. Check the invitations table and RLS policies.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/family");

  return {
    status: "success",
    message: "Invitation link created. Email sending will be added later, so share this link manually for now.",
    inviteLink: await buildInviteLink(token),
    invitedEmail,
  };
}

export async function getInvitationByToken(
  token: string,
): Promise<{ invitation: Invitation | null; errorMessage?: string }> {
  if (!hasSupabaseConfig()) {
    return {
      invitation: null,
      errorMessage: "Supabase is not configured yet.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .select(invitationSelect)
    .eq("token", token)
    .maybeSingle();

  if (error) {
    return {
      invitation: null,
      errorMessage: "We could not load this invitation. Log in with the invited email address and try again.",
    };
  }

  if (!data) {
    return {
      invitation: null,
      errorMessage: "This invitation link is invalid or no longer available.",
    };
  }

  return {
    invitation: data as Invitation,
  };
}

export async function acceptFamilyInvitation(token: string) {
  if (!hasSupabaseConfig()) {
    redirect("/login?error=supabase-not-configured");
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;
  const userEmail = authData?.claims?.email;

  if (authError || !userId) {
    redirect(`/login?next=/invite/${token}`);
  }

  const { invitation } = await getInvitationByToken(token);

  if (
    !invitation ||
    invitation.status !== "pending" ||
    isExpired(invitation.expires_at) ||
    !sameEmail(invitation.invited_email, userEmail)
  ) {
    redirect(`/invite/${token}?error=invalid`);
  }

  const { error: memberError } = await supabase.from("family_members").upsert(
    {
      family_case_id: invitation.family_case_id,
      user_id: userId,
      role: "member",
    },
    {
      onConflict: "family_case_id,user_id",
      ignoreDuplicates: true,
    },
  );

  if (memberError) {
    redirect(`/invite/${token}?error=member`);
  }

  const { error: invitationError } = await supabase
    .from("invitations")
    .update({ status: "accepted" })
    .eq("id", invitation.id);

  if (invitationError) {
    redirect(`/invite/${token}?error=accepted-not-marked`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/family");
  redirect("/dashboard/family?accepted=true");
}

export async function getCurrentUserSummary() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return {
    id: data.claims.sub,
    email: data.claims.email as string | undefined,
  };
}

export async function isFamilyCaseOwner(familyCaseId: string, userId: string) {
  if (!hasSupabaseConfig()) {
    return false;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_members")
    .select("id")
    .eq("family_case_id", familyCaseId)
    .eq("user_id", userId)
    .eq("role", "owner")
    .maybeSingle();

  return !error && Boolean(data);
}

async function getProfilesById(userIds: string[]) {
  const uniqueIds = Array.from(new Set(userIds)).filter(Boolean);
  const profileMap = new Map<string, ProfileSummary>();

  if (uniqueIds.length === 0) {
    return profileMap;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", uniqueIds);

  for (const profile of data ?? []) {
    profileMap.set(profile.id as string, {
      id: profile.id as string,
      email: (profile.email as string | null) ?? null,
      full_name: (profile.full_name as string | null) ?? null,
    });
  }

  return profileMap;
}

async function buildInviteLink(token: string) {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol =
    headerStore.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = headerStore.get("origin") ?? `${protocol}://${host}`;

  return `${origin}/invite/${token}`;
}

function getString(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isExpired(value: string | null) {
  if (!value) {
    return false;
  }

  return new Date(value).getTime() < Date.now();
}

function sameEmail(left: string, right?: string | null) {
  return left.trim().toLowerCase() === (right ?? "").trim().toLowerCase();
}
