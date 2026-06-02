import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminProfile } from "@/lib/admin/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminProfile("/admin");

  return <AdminShell>{children}</AdminShell>;
}
