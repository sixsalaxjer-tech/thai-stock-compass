export function CautionCallout({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="note"
      className="flex gap-3 border border-gold/60 bg-gold/10 px-4 py-3 text-sm text-text"
    >
      <span aria-hidden="true" className="text-gold">
        ⚠
      </span>
      <div>{children}</div>
    </div>
  );
}
