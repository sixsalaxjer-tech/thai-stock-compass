import Link from "next/link";
import type { WatchStock } from "@/lib/types";
import { upsideFromTarget } from "@/lib/stockMath";

function formatBaht(value: number) {
  return value.toLocaleString("th-TH", { minimumFractionDigits: 2 });
}

function UpsideBadge({ upsidePct }: { upsidePct: number }) {
  const isUp = upsidePct > 0;
  const isDown = upsidePct < 0;
  const color = isUp ? "text-up" : isDown ? "text-down" : "text-text-muted";
  const arrow = isUp ? "▲" : isDown ? "▼" : "―";
  return (
    <span className={`tabular text-sm font-medium ${color}`}>
      {arrow} {upsidePct > 0 ? "+" : ""}
      {upsidePct.toFixed(1)}% upside
    </span>
  );
}

export function StockWatchCard({ stock }: { stock: WatchStock }) {
  const { priceDiff, upsidePct } = upsideFromTarget(stock.price, stock.targetPrice);

  return (
    <article className="border border-line bg-bg-panel p-4">
      <div className="flex items-baseline justify-between gap-2">
        <Link
          href={`/stock/${stock.ticker}`}
          className="font-numeral text-lg font-semibold text-text hover:text-gold"
        >
          {stock.ticker}
        </Link>
        <UpsideBadge upsidePct={upsidePct} />
      </div>
      <p className="text-sm text-text-muted">
        {stock.name} · {stock.sector}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border border-line bg-bg p-3 text-sm">
        <div>
          <dt className="text-xs text-text-muted">จุดแนะนำเข้าซื้อ (ราคาปัจจุบัน)</dt>
          <dd className="tabular font-numeral text-base">{formatBaht(stock.price)}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">ราคาเป้าหมายนักวิเคราะห์</dt>
          <dd className="tabular font-numeral text-base">{formatBaht(stock.targetPrice)}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">ส่วนต่างที่จะได้</dt>
          <dd className={`tabular font-numeral text-base ${priceDiff >= 0 ? "text-up" : "text-down"}`}>
            {priceDiff > 0 ? "+" : ""}
            {formatBaht(priceDiff)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">Upside</dt>
          <dd className={`tabular font-numeral text-base ${upsidePct >= 0 ? "text-up" : "text-down"}`}>
            {upsidePct > 0 ? "+" : ""}
            {upsidePct.toFixed(1)}%
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-sm leading-relaxed text-text">{stock.note}</p>
      <p className="mt-3 text-xs text-text-muted">
        ราคา: {stock.priceSource} ({stock.priceAsOfLabel}) · เป้าหมาย: {stock.targetSource} ({stock.targetAsOfLabel})
      </p>
      <p className="mt-1 text-xs text-text-muted">
        ข่าว/บทวิเคราะห์: {stock.source} · {stock.publishedAtLabel}
      </p>
    </article>
  );
}
