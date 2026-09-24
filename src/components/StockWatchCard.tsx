import Link from "next/link";
import type { WatchStock } from "@/lib/types";

function PctBadge({ changePct }: { changePct: number }) {
  const isUp = changePct > 0;
  const isDown = changePct < 0;
  const color = isUp ? "text-up" : isDown ? "text-down" : "text-text-muted";
  const arrow = isUp ? "▲" : isDown ? "▼" : "―";
  return (
    <span className={`tabular text-sm font-medium ${color}`}>
      {arrow} {changePct > 0 ? "+" : ""}
      {changePct.toFixed(2)}%
    </span>
  );
}

export function StockWatchCard({ stock }: { stock: WatchStock }) {
  return (
    <article className="border border-line bg-bg-panel p-4">
      <div className="flex items-baseline justify-between gap-2">
        <Link
          href={`/stock/${stock.ticker}`}
          className="font-numeral text-lg font-semibold text-text hover:text-gold"
        >
          {stock.ticker}
        </Link>
        <PctBadge changePct={stock.changePct} />
      </div>
      <p className="text-sm text-text-muted">{stock.name}</p>
      <p className="tabular mt-2 text-xl font-numeral">
        {stock.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-text">{stock.note}</p>
      <p className="mt-3 text-xs text-text-muted">
        แหล่งที่มา: {stock.source} · {stock.publishedAtLabel}
      </p>
    </article>
  );
}
