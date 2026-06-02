import { taskStatusLabels, type TaskStatus } from "@/lib/dashboard/types";

const styles: Record<TaskStatus, string> = {
  todo: "border-stone-200 bg-stone-50 text-stone-700",
  in_progress: "border-amber-200 bg-amber-50 text-amber-900",
  done: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${styles[status]}`}>
      {taskStatusLabels[status]}
    </span>
  );
}
