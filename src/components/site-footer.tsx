import Link from "next/link";

import {
  accountRoutes,
  adminRoutes,
  dashboardRoutes,
  publicRoutes,
  secondaryPublicRoutes,
} from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[#eee6d9]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <section>
          <Link href="/" className="text-lg font-semibold text-stone-950">
            KinHarbour
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone-700">
            A calm decision platform for Australian families navigating aged care options,
            urgent decisions, provider shortlists, and family coordination.
          </p>
          <div className="mt-5 rounded-lg border border-stone-300 bg-[#fbf8f2] p-4 text-xs leading-5 text-stone-700">
            <p>KinHarbour provides general navigation support.</p>
            <p>It does not determine eligibility.</p>
            <p>
              It does not replace My Aged Care, medical, legal, or financial advice.
            </p>
          </div>
        </section>

        <nav className="grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4" aria-label="Footer navigation">
          <FooterGroup title="Explore" links={[{ href: "/", label: "Home" }, ...publicRoutes]} />
          <FooterGroup title="Company" links={secondaryPublicRoutes} />
          <FooterGroup title="Account" links={[...accountRoutes, ...adminRoutes]} />
          <FooterGroup title="Dashboard" links={dashboardRoutes.slice(0, 6)} />
        </nav>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase text-stone-500">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-stone-700 transition hover:text-[#146c60]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
