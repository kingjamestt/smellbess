export function DraftBadge({ className = "" }: { className?: string }) {
  return (
    <span
      title="Draft copy: we'll rewrite this in our own words"
      className={`label-caps inline-flex items-center rounded-sm border border-dashed border-muted px-1.5 py-0.5 text-[0.625rem] text-muted ${className}`}
    >
      DRAFT
    </span>
  );
}

