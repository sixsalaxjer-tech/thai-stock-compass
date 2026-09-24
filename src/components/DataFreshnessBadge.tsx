export function DataFreshnessBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-panel px-3 py-1 text-xs text-text-muted">
      <span aria-hidden="true" className="text-gold">
        ●
      </span>
      {label}
    </span>
  );
}
