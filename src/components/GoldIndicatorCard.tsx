import type { GoldIndicator } from "@/lib/types";

const SIGNAL_STYLE: Record<GoldIndicator["signal"], string> = {
  bullish: "text-up",
  bearish: "text-down",
  neutral: "text-text-muted",
};

const SIGNAL_DOT: Record<GoldIndicator["signal"], string> = {
  bullish: "●",
  bearish: "●",
  neutral: "○",
};

export function GoldIndicatorCard({ indicator }: { indicator: GoldIndicator }) {
  return (
    <article className="border border-line bg-bg-panel p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium text-text">{indicator.name}</h3>
        <span className={`tabular text-xs font-medium ${SIGNAL_STYLE[indicator.signal]}`}>
          <span aria-hidden="true">{SIGNAL_DOT[indicator.signal]}</span> {indicator.signalLabel}
        </span>
      </div>
      <p className="tabular mt-2 font-numeral text-sm text-text">{indicator.value}</p>
      <p className="mt-2 text-xs leading-relaxed text-text-muted">{indicator.description}</p>
    </article>
  );
}
