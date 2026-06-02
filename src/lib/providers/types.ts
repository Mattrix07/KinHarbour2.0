export type CareType =
  | "Residential aged care"
  | "Respite care"
  | "Dementia support"
  | "Palliative care"
  | "Ageing in place";

export type RoomType =
  | "Single room"
  | "Companion room"
  | "Private ensuite"
  | "Shared ensuite"
  | "Couples suite";

export type Provider = {
  id: string;
  name: string;
  suburb: string;
  state: string;
  postcode: string;
  careTypes: CareType[];
  roomTypes: RoomType[];
  dementiaSupport: boolean;
  respiteAvailable: boolean;
  palliativeCare: boolean;
  couplesAccommodation: boolean;
  starRating: number;
  complianceRating: number;
  staffingRating: number;
  residentExperienceRating: number;
  qualityMeasuresRating: number;
  estimatedRAD: number;
  estimatedDAP: number;
  description: string;
  features: string[];
  contactPhone: string;
  website: string;
  lastVerifiedAt: string;
  dataSourceNote: string;
  isDemoData: boolean;
};

export type ProviderFilters = {
  search: string;
  careType: "all" | CareType;
  dementiaSupport: boolean;
  respiteAvailable: boolean;
  palliativeCare: boolean;
  couplesAccommodation: boolean;
  sortBy: ProviderSortOption;
};

export type ProviderSortOption = "star-rating" | "estimated-rad" | "suburb";

export type ShortlistStatus =
  | "considering"
  | "contacted"
  | "tour_booked"
  | "visited"
  | "rejected"
  | "preferred";

export type ShortlistedProvider = {
  id: string;
  created_at: string;
  updated_at: string;
  family_case_id: string;
  user_id: string;
  provider_id: string;
  notes: string | null;
  status: ShortlistStatus;
};

export type ShortlistedProviderWithDetails = ShortlistedProvider & {
  provider: Provider;
};

export type ShortlistMode =
  | "logged_out"
  | "family_case"
  | "no_family_case"
  | "not_configured"
  | "error";

export type ShortlistActionResult = {
  status:
    | "saved"
    | "removed"
    | "already_saved"
    | "logged_out"
    | "no_family_case"
    | "not_configured"
    | "error";
  message: string;
};

export type ShortlistEditActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const providerComparisonStorageKey = "kinharbour.providerComparisonIds";
export const maxComparedProviders = 5;

export const shortlistStatusLabels: Record<ShortlistStatus, string> = {
  considering: "Considering",
  contacted: "Contacted",
  tour_booked: "Tour booked",
  visited: "Visited",
  rejected: "Rejected",
  preferred: "Preferred",
};

export const shortlistStatusOptions: Array<{ value: ShortlistStatus; label: string }> = [
  { value: "considering", label: "Considering" },
  { value: "contacted", label: "Contacted" },
  { value: "tour_booked", label: "Tour booked" },
  { value: "visited", label: "Visited" },
  { value: "rejected", label: "Rejected" },
  { value: "preferred", label: "Preferred" },
];
