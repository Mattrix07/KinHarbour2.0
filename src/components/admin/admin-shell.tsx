import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <AdminSidebar />
      <div className="min-w-0">{children}</div>
    </main>
  );
}
