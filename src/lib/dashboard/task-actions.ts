"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getActiveFamilyCase } from "@/lib/dashboard/family-case-actions";
import {
  type DashboardActionState,
  type FamilyTask,
  type ProfileSummary,
  type TaskCategory,
  taskCategoryOptions,
  type TaskStatus,
  taskStatusOptions,
} from "@/lib/dashboard/types";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

const taskSelect = `
  id,
  created_at,
  updated_at,
  family_case_id,
  created_by,
  assigned_to,
  title,
  description,
  status,
  due_date,
  category
`;

export async function getTasksForFamilyCase(
  familyCaseId: string,
  limit = 100,
): Promise<{ tasks: FamilyTask[]; errorMessage?: string }> {
  if (!hasSupabaseConfig()) {
    return {
      tasks: [],
      errorMessage: "Supabase is not configured yet.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_tasks")
    .select(taskSelect)
    .eq("family_case_id", familyCaseId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      tasks: [],
      errorMessage:
        "Family tasks are not ready yet. Run the Supabase SQL for collaboration, then refresh this page.",
    };
  }

  const profileIds = (data ?? []).flatMap((task) =>
    [task.created_by as string, task.assigned_to as string | null].filter(Boolean) as string[],
  );
  const profileMap = await getProfilesById(profileIds);

  return {
    tasks: (data ?? []).map((task) => ({
      id: task.id as string,
      created_at: task.created_at as string,
      updated_at: task.updated_at as string,
      family_case_id: task.family_case_id as string,
      created_by: task.created_by as string,
      assigned_to: (task.assigned_to as string | null) ?? null,
      title: task.title as string,
      description: (task.description as string | null) ?? null,
      status: task.status as TaskStatus,
      due_date: (task.due_date as string | null) ?? null,
      category: (task.category as TaskCategory | null) ?? null,
      createdByProfile: profileMap.get(task.created_by as string) ?? null,
      assignedToProfile: task.assigned_to
        ? profileMap.get(task.assigned_to as string) ?? null
        : null,
    })),
  };
}

export async function createFamilyTask(
  _previousState: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "Supabase is not configured yet.",
    };
  }

  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const status = getString(formData, "status") || "todo";
  const category = getString(formData, "category") || "general";
  const dueDate = getString(formData, "due_date");
  const assignedTo = getString(formData, "assigned_to");

  if (!title) {
    return {
      status: "error",
      message: "Enter a task title.",
    };
  }

  if (title.length > 120) {
    return {
      status: "error",
      message: "Use 120 characters or fewer for the task title.",
    };
  }

  if (description.length > 1200) {
    return {
      status: "error",
      message: "Use 1200 characters or fewer for the task description.",
    };
  }

  if (!isTaskStatus(status) || !isTaskCategory(category)) {
    return {
      status: "error",
      message: "Choose valid task status and category values.",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) {
    redirect("/login?next=/dashboard/tasks");
  }

  const { familyCase, errorMessage } = await getActiveFamilyCase();

  if (!familyCase) {
    return {
      status: "error",
      message: errorMessage ?? "Create a family case before adding tasks.",
    };
  }

  const { error } = await supabase.from("family_tasks").insert({
    family_case_id: familyCase.id,
    created_by: userId,
    assigned_to: assignedTo || null,
    title,
    description: description || null,
    status,
    due_date: dueDate || null,
    category,
  });

  if (error) {
    return {
      status: "error",
      message: "We could not create this task yet. Check the family_tasks table and RLS policies.",
    };
  }

  revalidateTaskPaths();

  return {
    status: "success",
    message: "Task added.",
  };
}

export async function updateFamilyTaskStatus(taskId: string, status: TaskStatus) {
  if (!hasSupabaseConfig() || !isTaskStatus(status)) {
    return {
      status: "error",
      message: "We could not update this task.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("family_tasks").update({ status }).eq("id", taskId);

  if (error) {
    return {
      status: "error",
      message: "We could not update this task. Check that you still have access.",
    };
  }

  revalidateTaskPaths();

  return {
    status: "success",
    message: "Task updated.",
  };
}

export async function deleteFamilyTask(taskId: string) {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "Supabase is not configured yet.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("family_tasks").delete().eq("id", taskId);

  if (error) {
    return {
      status: "error",
      message: "We could not delete this task. Check that you still have access.",
    };
  }

  revalidateTaskPaths();

  return {
    status: "success",
    message: "Task deleted.",
  };
}

function revalidateTaskPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
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

function getString(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function isTaskStatus(value: string): value is TaskStatus {
  return taskStatusOptions.some((option) => option.value === value);
}

function isTaskCategory(value: string): value is TaskCategory {
  return taskCategoryOptions.some((option) => option.value === value);
}
