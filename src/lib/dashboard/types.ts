export type RelationshipToUser = "mum" | "dad" | "partner" | "grandparent" | "other";

export type CurrentLivingSituation =
  | "living_independently"
  | "living_with_family"
  | "hospital"
  | "respite"
  | "residential_aged_care"
  | "unsure";

export type CurrentStatus =
  | "just_starting"
  | "already_contacted_my_aged_care"
  | "assessment_booked"
  | "comparing_providers"
  | "urgent_transition"
  | "unsure";

export type FamilyMemberRole = "owner" | "member";

export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskCategory =
  | "my_aged_care"
  | "provider_call"
  | "tour"
  | "financial"
  | "documents"
  | "family_discussion"
  | "urgent"
  | "general";

export type NoteType =
  | "provider_call"
  | "tour"
  | "financial"
  | "my_aged_care"
  | "family_discussion"
  | "hospital_discharge"
  | "general";

export type FamilyCase = {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  care_recipient_name: string;
  relationship_to_user: RelationshipToUser;
  care_recipient_suburb: string | null;
  care_recipient_state: string | null;
  current_living_situation: CurrentLivingSituation;
  current_status: CurrentStatus;
  primary_pathway: string | null;
  urgency_level: string | null;
};

export type FamilyCaseActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<FamilyCaseFieldName, string>>;
};

export type FamilyCaseFieldName =
  | "care_recipient_name"
  | "relationship_to_user"
  | "care_recipient_suburb"
  | "care_recipient_state"
  | "current_living_situation"
  | "current_status";

export type FamilyCaseLoadResult = {
  familyCase: FamilyCase | null;
  errorMessage?: string;
};

export type ProfileSummary = {
  id: string;
  email: string | null;
  full_name: string | null;
};

export type FamilyMember = {
  id: string;
  created_at: string;
  family_case_id: string;
  user_id: string;
  role: FamilyMemberRole;
  profile: ProfileSummary | null;
};

export type Invitation = {
  id: string;
  created_at: string;
  family_case_id: string;
  invited_email: string;
  invited_by: string;
  token: string;
  status: InvitationStatus;
  expires_at: string | null;
};

export type FamilyTask = {
  id: string;
  created_at: string;
  updated_at: string;
  family_case_id: string;
  created_by: string;
  assigned_to: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  category: TaskCategory | null;
  createdByProfile: ProfileSummary | null;
  assignedToProfile: ProfileSummary | null;
};

export type FamilyNote = {
  id: string;
  created_at: string;
  updated_at: string;
  family_case_id: string;
  created_by: string;
  title: string | null;
  body: string;
  note_type: NoteType;
  createdByProfile: ProfileSummary | null;
};

export type DashboardActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type InviteActionState = DashboardActionState & {
  inviteLink?: string;
  invitedEmail?: string;
};

export const relationshipOptions: Array<{ value: RelationshipToUser; label: string }> = [
  { value: "mum", label: "Mum" },
  { value: "dad", label: "Dad" },
  { value: "partner", label: "Partner" },
  { value: "grandparent", label: "Grandparent" },
  { value: "other", label: "Other" },
];

export const livingSituationOptions: Array<{
  value: CurrentLivingSituation;
  label: string;
}> = [
  { value: "living_independently", label: "Living independently" },
  { value: "living_with_family", label: "Living with family" },
  { value: "hospital", label: "Hospital" },
  { value: "respite", label: "Respite" },
  { value: "residential_aged_care", label: "Residential aged care" },
  { value: "unsure", label: "Unsure" },
];

export const currentStatusOptions: Array<{ value: CurrentStatus; label: string }> = [
  { value: "just_starting", label: "Just starting" },
  { value: "already_contacted_my_aged_care", label: "Already contacted My Aged Care" },
  { value: "assessment_booked", label: "Assessment booked" },
  { value: "comparing_providers", label: "Comparing providers" },
  { value: "urgent_transition", label: "Urgent transition" },
  { value: "unsure", label: "Unsure" },
];

export const australianStateOptions = [
  "ACT",
  "NSW",
  "NT",
  "QLD",
  "SA",
  "TAS",
  "VIC",
  "WA",
] as const;

export const relationshipLabels = Object.fromEntries(
  relationshipOptions.map((option) => [option.value, option.label]),
) as Record<RelationshipToUser, string>;

export const livingSituationLabels = Object.fromEntries(
  livingSituationOptions.map((option) => [option.value, option.label]),
) as Record<CurrentLivingSituation, string>;

export const currentStatusLabels = Object.fromEntries(
  currentStatusOptions.map((option) => [option.value, option.label]),
) as Record<CurrentStatus, string>;

export const familyMemberRoleLabels: Record<FamilyMemberRole, string> = {
  owner: "Owner",
  member: "Member",
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const taskStatusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

export const taskCategoryLabels: Record<TaskCategory, string> = {
  my_aged_care: "My Aged Care",
  provider_call: "Provider call",
  tour: "Tour",
  financial: "Financial",
  documents: "Documents",
  family_discussion: "Family discussion",
  urgent: "Urgent",
  general: "General",
};

export const taskCategoryOptions: Array<{ value: TaskCategory; label: string }> = [
  { value: "general", label: "General" },
  { value: "my_aged_care", label: "My Aged Care" },
  { value: "provider_call", label: "Provider call" },
  { value: "tour", label: "Tour" },
  { value: "financial", label: "Financial" },
  { value: "documents", label: "Documents" },
  { value: "family_discussion", label: "Family discussion" },
  { value: "urgent", label: "Urgent" },
];

export const noteTypeLabels: Record<NoteType, string> = {
  provider_call: "Provider call",
  tour: "Tour",
  financial: "Financial",
  my_aged_care: "My Aged Care",
  family_discussion: "Family discussion",
  hospital_discharge: "Hospital discharge",
  general: "General",
};

export const noteTypeOptions: Array<{ value: NoteType; label: string }> = [
  { value: "general", label: "General" },
  { value: "provider_call", label: "Provider call" },
  { value: "tour", label: "Tour" },
  { value: "financial", label: "Financial" },
  { value: "my_aged_care", label: "My Aged Care" },
  { value: "family_discussion", label: "Family discussion" },
  { value: "hospital_discharge", label: "Hospital discharge" },
];
