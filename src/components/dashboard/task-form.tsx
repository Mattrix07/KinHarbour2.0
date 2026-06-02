"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createFamilyTask } from "@/lib/dashboard/task-actions";
import {
  type DashboardActionState,
  type FamilyMember,
  taskCategoryOptions,
  taskStatusOptions,
} from "@/lib/dashboard/types";

const initialState: DashboardActionState = {
  status: "idle",
};

type TaskFormProps = {
  members: FamilyMember[];
};

export function TaskForm({ members }: TaskFormProps) {
  const [state, formAction] = useActionState(createFamilyTask, initialState);

  return (
    <form action={formAction} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-stone-950">Create task</h2>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        Track practical follow-ups for calls, documents, tours, costs, and family decisions.
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

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2" htmlFor="title">
          <span className="text-sm font-semibold text-stone-700">Task title</span>
          <input
            id="title"
            name="title"
            type="text"
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>

        <label className="block md:col-span-2" htmlFor="description">
          <span className="text-sm font-semibold text-stone-700">Description optional</span>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm leading-6 text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          />
        </label>

        <label className="block" htmlFor="status">
          <span className="text-sm font-semibold text-stone-700">Status</span>
          <select
            id="status"
            name="status"
            defaultValue="todo"
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          >
            {taskStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block" htmlFor="category">
          <span className="text-sm font-semibold text-stone-700">Category</span>
          <select
            id="category"
            name="category"
            defaultValue="general"
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          >
            {taskCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block" htmlFor="assigned_to">
          <span className="text-sm font-semibold text-stone-700">Assigned family member</span>
          <select
            id="assigned_to"
            name="assigned_to"
            defaultValue=""
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.profile?.full_name || member.profile?.email || "Family member"}
              </option>
            ))}
          </select>
        </label>

        <label className="block" htmlFor="due_date">
          <span className="text-sm font-semibold text-stone-700">Due date optional</span>
          <input
            id="due_date"
            name="due_date"
            type="date"
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
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
      {pending ? "Adding task..." : "Add task"}
    </button>
  );
}
