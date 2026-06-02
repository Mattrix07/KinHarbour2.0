"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createFamilyNote } from "@/lib/dashboard/note-actions";
import {
  type DashboardActionState,
  noteTypeOptions,
} from "@/lib/dashboard/types";

const initialState: DashboardActionState = {
  status: "idle",
};

export function NoteForm() {
  const [state, formAction] = useActionState(createFamilyNote, initialState);

  return (
    <form action={formAction} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-stone-950">Add shared note</h2>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        Capture provider calls, tour impressions, cost questions, family discussions, or
        next points to verify.
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

      <div className="mt-5 grid gap-4">
        <label className="block" htmlFor="note-title">
          <span className="text-sm font-semibold text-stone-700">Title optional</span>
          <input
            id="note-title"
            name="title"
            type="text"
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>

        <label className="block" htmlFor="note-type">
          <span className="text-sm font-semibold text-stone-700">Note type</span>
          <select
            id="note-type"
            name="note_type"
            defaultValue="general"
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          >
            {noteTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block" htmlFor="note-body">
          <span className="text-sm font-semibold text-stone-700">Note</span>
          <textarea
            id="note-body"
            name="body"
            rows={5}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm leading-6 text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>
      </div>

      <SubmitButton />
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
      {pending ? "Saving note..." : "Save note"}
    </button>
  );
}
