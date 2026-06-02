"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { NoteTypeBadge } from "@/components/dashboard/note-type-badge";
import { deleteFamilyNote } from "@/lib/dashboard/note-actions";
import type { FamilyNote } from "@/lib/dashboard/types";

type NotesListProps = {
  notes: FamilyNote[];
};

export function NotesList({ notes }: NotesListProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  if (notes.length === 0) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">No shared notes yet.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-700">
          Add notes from family conversations, provider calls, tours, cost questions, or
          hospital discharge planning.
        </p>
      </section>
    );
  }

  function deleteNote(noteId: string) {
    startTransition(async () => {
      const result = await deleteFamilyNote(noteId);
      setMessage(result.message);
      router.refresh();
    });
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-stone-950">Shared notes</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            Coordination notes visible to members of this family case.
          </p>
        </div>
        <span className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-stone-800">
          {notes.length}
        </span>
      </div>

      {message ? (
        <p className="mt-5 rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
          {message}
        </p>
      ) : null}

      <div className="mt-5 grid gap-4">
        {notes.map((note) => (
          <article key={note.id} className="rounded-lg border border-stone-200 bg-[#fbf8f2] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <NoteTypeBadge noteType={note.note_type} />
                <h3 className="mt-3 text-lg font-semibold text-stone-950">
                  {note.title || "Untitled note"}
                </h3>
                <p className="mt-2 text-xs font-medium text-stone-500">
                  {note.createdByProfile?.full_name || note.createdByProfile?.email || "Family member"} ·{" "}
                  {formatDate(note.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                disabled={isPending}
                className="rounded-md border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-800 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete note
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-700">{note.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
