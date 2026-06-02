"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { TaskStatusBadge } from "@/components/dashboard/task-status-badge";
import {
  deleteFamilyTask,
  updateFamilyTaskStatus,
} from "@/lib/dashboard/task-actions";
import {
  type FamilyTask,
  taskCategoryLabels,
  type TaskStatus,
  taskStatusOptions,
} from "@/lib/dashboard/types";

type TaskListProps = {
  tasks: FamilyTask[];
};

export function TaskList({ tasks }: TaskListProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  if (tasks.length === 0) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">No shared tasks yet.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-700">
          Add tasks for calls, tours, documents, My Aged Care steps, or family follow-ups.
        </p>
      </section>
    );
  }

  function updateStatus(taskId: string, status: TaskStatus) {
    startTransition(async () => {
      const result = await updateFamilyTaskStatus(taskId, status);
      setMessage(result.message);
      router.refresh();
    });
  }

  function deleteTask(taskId: string) {
    startTransition(async () => {
      const result = await deleteFamilyTask(taskId);
      setMessage(result.message);
      router.refresh();
    });
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-stone-950">Shared tasks</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            Practical follow-ups for the decision team.
          </p>
        </div>
        <span className="rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-stone-800">
          {tasks.length}
        </span>
      </div>

      {message ? (
        <p className="mt-5 rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
          {message}
        </p>
      ) : null}

      <div className="mt-5 divide-y divide-stone-200">
        {tasks.map((task) => (
          <article key={task.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_260px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <TaskStatusBadge status={task.status} />
                {task.category ? (
                  <span className="rounded-md bg-[#f1eadf] px-2 py-1 text-xs font-semibold text-stone-700">
                    {taskCategoryLabels[task.category]}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-stone-950">{task.title}</h3>
              {task.description ? (
                <p className="mt-2 text-sm leading-6 text-stone-700">{task.description}</p>
              ) : null}
              <dl className="mt-3 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                <Detail label="Assigned to" value={task.assignedToProfile?.full_name || task.assignedToProfile?.email || "Unassigned"} />
                <Detail label="Due date" value={task.due_date ? formatDate(task.due_date) : "No due date"} />
              </dl>
            </div>

            <div className="flex flex-col gap-3">
              <label className="block" htmlFor={`status-${task.id}`}>
                <span className="text-sm font-semibold text-stone-700">Update status</span>
                <select
                  id={`status-${task.id}`}
                  value={task.status}
                  disabled={isPending}
                  onChange={(event) => updateStatus(task.id, event.target.value as TaskStatus)}
                  className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20"
                >
                  {taskStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                disabled={isPending}
                className="rounded-md border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete task
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-stone-500">{label}</dt>
      <dd className="mt-1 text-stone-800">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
