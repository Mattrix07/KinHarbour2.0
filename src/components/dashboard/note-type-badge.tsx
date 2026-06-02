import { noteTypeLabels, type NoteType } from "@/lib/dashboard/types";

export function NoteTypeBadge({ noteType }: { noteType: NoteType }) {
  return (
    <span className="rounded-md border border-stone-200 bg-[#f1eadf] px-2 py-1 text-xs font-semibold text-stone-700">
      {noteTypeLabels[noteType]}
    </span>
  );
}
