import Link from "next/link";
import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  links?: {
    href: string;
    label: string;
    description: string;
  }[];
};

export function PageShell({ eyebrow, title, description, children, links }: PageShellProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase text-[#146c60]">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-stone-700">{description}</p>
      </section>

      {children ? <div className="mt-10">{children}</div> : null}

      {links && links.length > 0 ? (
        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#146c60] hover:shadow-md"
            >
              <span className="text-base font-semibold text-stone-950">{link.label}</span>
              <span className="mt-2 block text-sm leading-6 text-stone-600">{link.description}</span>
            </Link>
          ))}
        </section>
      ) : null}
    </main>
  );
}
