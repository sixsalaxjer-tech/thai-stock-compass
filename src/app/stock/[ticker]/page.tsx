import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { LiveCheckLinks } from "@/components/LiveCheckLinks";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { liveCheckLinks, stockDetails } from "@/lib/data";
import { upsideFromTarget } from "@/lib/stockMath";

type Params = { ticker: string };

export function generateStaticParams(): Params[] {
  return Object.keys(stockDetails).map((ticker) => ({ ticker }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const stock = stockDetails[ticker.toUpperCase()];
  if (!stock) return { title: "ไม่พบข้อมูลหุ้น" };
  return {
    title: `${stock.ticker} — ${stock.name}`,
    description: `ราคา, ปันผล, PE และกราฟของหุ้น ${stock.ticker}`,
  };
}

export default async function StockDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { ticker } = await params;
  const stock = stockDetails[ticker.toUpperCase()];
  if (!stock) notFound();

  const { priceDiff, upsidePct } = upsideFromTarget(stock.price, stock.targetPrice);

  return (
    <div className="py-8 pb-12">
      <p className="text-sm text-text-muted">{stock.sector}</p>
      <h1 className="mt-1 text-2xl font-medium">
        <span className="font-numeral">{stock.ticker}</span>{" "}
        <span className="text-text-muted">· {stock.name}</span>
      </h1>

      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <span className="font-numeral tabular text-3xl font-semibold">
          {stock.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
        </span>
        <span className={`tabular text-base font-medium ${upsidePct >= 0 ? "text-up" : "text-down"}`}>
          {upsidePct > 0 ? "+" : ""}
          {upsidePct.toFixed(1)}% upside ถึงราคาเป้าหมาย
        </span>
      </div>

      <div className="mt-4">
        <DataFreshnessBadge label={stock.asOfLabel} />
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 border border-line bg-bg-panel p-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-text-muted">จุดแนะนำเข้าซื้อ</dt>
          <dd className="tabular mt-1 text-lg font-numeral">
            {stock.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">ราคาเป้าหมาย</dt>
          <dd className="tabular mt-1 text-lg font-numeral">
            {stock.targetPrice.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">ส่วนต่างที่จะได้</dt>
          <dd className={`tabular mt-1 text-lg font-numeral ${priceDiff >= 0 ? "text-up" : "text-down"}`}>
            {priceDiff > 0 ? "+" : ""}
            {priceDiff.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">กลุ่มอุตสาหกรรม</dt>
          <dd className="mt-1 text-lg">{stock.sector}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-text-muted">
        ราคา: {stock.priceSource} · เป้าหมาย: {stock.targetSource} ({stock.targetAsOfLabel})
      </p>

      <section className="mt-8" aria-label={`กราฟราคาหุ้น ${stock.ticker}`}>
        <h2 className="text-base font-medium">กราฟราคา</h2>
        <div className="mt-4">
          <TradingViewWidget symbol={stock.ticker} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-base font-medium">เกี่ยวกับบริษัท</h2>
        <p className="mt-2 text-sm leading-relaxed text-text">{stock.about}</p>
      </section>

      <div className="mt-8">
        <LiveCheckLinks links={liveCheckLinks} />
      </div>
    </div>
  );
}
