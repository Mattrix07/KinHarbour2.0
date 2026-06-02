export function PublishStatusBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      className={
        isPublished
          ? "rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-900"
          : "rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-900"
      }
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
