"use client";

import { useActionState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import {
  removeProviderFromShortlist,
  updateShortlistedProvider,
} from "@/lib/providers/provider-actions";
import {
  type ShortlistedProviderWithDetails,
  type ShortlistEditActionState,
  shortlistStatusOptions,
} from "@/lib/providers/types";

const initialState: ShortlistEditActionState = {
  status: "idle",
};

type ShortlistedProviderNotesProps = {
  shortlistItem: ShortlistedProviderWithDetails;
};

export function ShortlistedProviderNotes({ shortlistItem }: ShortlistedProviderNotesProps) {
  const router = useRouter();
  const updateAction = updateShortlistedProvider.bind(null, shortlistItem.id);
  const [state, formAction] = useActionState(updateAction, initialState);
  const [isRemoving, startRemoveTransition] = useTransition();

  function handleRemove() {
    startRemoveTransition(async () => {
      await removeProviderFromShortlist(shortlistItem.provider_id);
      router.refresh();
    });
  }

  return (
    <form action={formAction} className="mt-5 grid gap-4">
      {state.message ? (
        <p
          className={
            state.status === "error"
              ? "rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-950"
              : "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950"
          }
        >
          {state.message}
        </p>
      ) : null}

      <label className="block" htmlFor={`status-${shortlistItem.id}`}>
        <span className="text-sm font-semibold text-stone-700">Shortlist status</span>
        <select
          id={`status-${shortlistItem.id}`}
          name="status"
          defaultValue={shortlistItem.status}
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
        >
          {shortlistStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block" htmlFor={`notes-${shortlistItem.id}`}>
        <span className="text-sm font-semibold text-stone-700">Family notes</span>
        <textarea
          id={`notes-${shortlistItem.id}`}
          name="notes"
          rows={4}
          defaultValue={shortlistItem.notes ?? ""}
          placeholder="Add call notes, tour questions, family impressions, or next follow-up."
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm leading-6 text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          className="rounded-md border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRemoving ? "Removing..." : "Remove provider"}
        </button>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save notes"}
    </button>
  );
}
