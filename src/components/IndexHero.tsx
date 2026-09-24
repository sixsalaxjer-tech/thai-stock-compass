import type { MarketSnapshot } from "@/lib/types";
import { PriceChange } from "./PriceChange";
import { DataFreshnessBadge } from "./DataFreshnessBadge";

export function IndexHero({ snapshot }: { snapshot: MarketSnapshot }) {
  return (
    <section className="border-b border-line py-8" aria-label="ภาพรวม SET Index">
      <p className="text-sm text-text-muted">ภาพรวมตลาดหุ้นไทย</p>
      <h1 className="mt-1 text-lg font-medium text-text">
        แผนที่หุ้นเด่นและหุ้นปันผล ก่อนไปศึกษาเชิงลึกที่แหล่งทางการ
      </h1>

      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        <span className="font-numeral tabular text-4xl font-semibold sm:text-5xl">
          {snapshot.value.toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <PriceChange
          changeAbs={snapshot.changeAbs}
          changePct={snapshot.changePct}
          size="lg"
        />
      </div>

      <p className="mt-2 text-sm text-text-muted">
        {snapshot.closedAtLabel} · {snapshot.turnoverLabel}
      </p>

      <div className="mt-4">
        <DataFreshnessBadge label={snapshot.asOfLabel} />
      </div>
    </section>
  );
}
