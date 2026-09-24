import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { PriceChange } from "@/components/PriceChange";
import { LiveCheckLinks } from "@/components/LiveCheckLinks";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { liveCheckLinks, stockDetails } from "@/lib/data";

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
        <PriceChange changeAbs={stock.changeAbs} changePct={stock.changePct} size="lg" />
      </div>

      <div className="mt-4">
        <DataFreshnessBadge label={stock.asOfLabel} />
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 border border-line bg-bg-panel p-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-text-muted">P/E Ratio</dt>
          <dd className="tabular mt-1 text-lg font-numeral">{stock.peRatio.toFixed(1)}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Dividend Yield</dt>
          <dd className="tabular mt-1 text-lg font-numeral">{stock.dividendYieldPct.toFixed(1)}%</dd>
        </div>
        <div>
          <dt className="text-text-muted">กลุ่มอุตสาหกรรม</dt>
          <dd className="mt-1 text-lg">{stock.sector}</dd>
        </div>
      </dl>

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
