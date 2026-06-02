import Link from "next/link";

import { accountRoutes, publicRoutes } from "@/lib/routes";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fbf8f2]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md text-stone-950"
            aria-label="KinHarbour home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#146c60] text-base font-semibold text-white shadow-sm">
              KH
            </span>
            <span>
              <span className="block text-lg font-semibold leading-tight">KinHarbour</span>
              <span className="block text-xs font-medium uppercase text-stone-500">
                Aged care navigation
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-[#146c60] hover:text-[#146c60]"
            >
              Dashboard
            </Link>
            <Link
              href="/assessment"
              className="rounded-md bg-[#146c60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148]"
            >
              Start assessment
            </Link>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-stone-700" aria-label="Main navigation">
          {publicRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="rounded-sm transition hover:text-[#146c60]">
              {route.label}
            </Link>
          ))}
          {accountRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="rounded-sm text-stone-500 transition hover:text-[#146c60]">
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
