import Link from "next/link";
import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  body: string;
  eyebrow?: string;
  href?: string;
  cta?: string;
  children?: ReactNode;
};

export function DashboardCard({ title, body, eyebrow, href, cta, children }: DashboardCardProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-normal text-[#146c60]">{eyebrow}</p>
      ) : null}
      <h2 className={eyebrow ? "mt-2 text-xl font-semibold text-stone-950" : "text-xl font-semibold text-stone-950"}>
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-stone-700">{body}</p>
      {children ? <div className="mt-4">{children}</div> : null}
      {href && cta ? (
        <Link
          href={href}
          className="mt-5 inline-flex rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
        >
          {cta}
        </Link>
      ) : null}
    </article>
  );
}
