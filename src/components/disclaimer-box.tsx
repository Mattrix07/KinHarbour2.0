import type { ReactNode } from "react";

type DisclaimerBoxProps = {
  title?: string;
  children: ReactNode;
};

export function DisclaimerBox({ title = "Important note", children }: DisclaimerBoxProps) {
  return (
    <aside className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <p className="font-semibold">{title}</p>
      <div className="mt-1">{children}</div>
    </aside>
  );
}
