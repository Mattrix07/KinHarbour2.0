export function CostExplainer() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-stone-950">What is a RAD?</h2>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          A Refundable Accommodation Deposit, often shortened to RAD, is one way a
          residential aged care accommodation price may be shown. Some families may choose
          to pay all, part, or none of this amount as a lump sum.
        </p>
      </article>

      <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-stone-950">What is a DAP?</h2>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          A Daily Accommodation Payment, or DAP, is an estimated daily amount connected to
          the unpaid part of the RAD. This calculator uses your interest rate assumption to
          show how the daily and monthly estimate changes.
        </p>
      </article>

      <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-stone-950">Why this is indicative</h2>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Actual costs may differ based on provider pricing, government rules, means
          assessment, optional services, and personal circumstances. Consider seeking
          independent financial advice before making aged care payment decisions.
        </p>
      </article>
    </section>
  );
}
