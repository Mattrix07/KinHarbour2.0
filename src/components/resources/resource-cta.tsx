import Link from "next/link";

import type { ResourceRelatedLink } from "@/lib/resources/types";

export function ResourceCta({
  title = "Helpful next steps in KinHarbour",
  links,
}: {
  title?: string;
  links: ResourceRelatedLink[];
}) {
  return (
    <section className="rounded-lg border border-stone-200 bg-[#f1eadf] p-5">
      <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#146c60] hover:shadow-md"
          >
            <span className="text-base font-semibold text-stone-950">{link.label}</span>
            <span className="mt-2 block text-sm leading-6 text-stone-600">
              {link.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
