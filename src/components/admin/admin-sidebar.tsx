import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/providers", label: "Providers" },
  { href: "/admin/resources", label: "Resources" },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-lg border border-stone-800 bg-stone-950 p-4 text-white shadow-sm lg:min-h-[calc(100vh-8rem)]">
      <Link href="/admin" className="block rounded-md bg-white/10 px-3 py-3">
        <span className="block text-sm font-semibold uppercase text-emerald-200">KinHarbour</span>
        <span className="mt-1 block text-lg font-semibold">Admin</span>
      </Link>

      <nav className="mt-6 grid gap-2">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/10"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-md bg-white/10 p-3 text-xs leading-5 text-stone-200">
        Admin content is informational only. KinHarbour does not endorse providers.
      </div>
    </aside>
  );
}
