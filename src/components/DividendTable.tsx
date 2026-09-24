"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DividendStock } from "@/lib/types";

type SortKey = "ticker" | "price" | "dividendYieldPct";

const HIGH_YIELD_THRESHOLD = 10;

export function DividendTable({ stocks }: { stocks: DividendStock[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("dividendYieldPct");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q
      ? stocks.filter(
          (s) =>
            s.ticker.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q) ||
            s.sector.toLowerCase().includes(q)
        )
      : stocks;

    const sorted = [...rows].sort((a, b) => {
      let diff = 0;
      if (sortKey === "ticker") diff = a.ticker.localeCompare(b.ticker);
      else diff = a[sortKey] - b[sortKey];
      return sortDir === "asc" ? diff : -diff;
    });
    return sorted;
  }, [stocks, query, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const hasHighYield = filtered.some(
    (s) => s.highYieldCaution || s.dividendYieldPct >= HIGH_YIELD_THRESHOLD
  );

  return (
    <div>
      <label className="block text-sm text-text-muted" htmlFor="dividend-search">
        ค้นหาหุ้น (ชื่อ, ตัวย่อ, หมวดธุรกิจ)
      </label>
      <input
        id="dividend-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="เช่น KTB, ธนาคาร"
        className="mt-1 w-full max-w-xs border border-line bg-bg px-3 py-2 text-sm outline-none focus-visible:border-gold"
      />

      <div className="mt-4 overflow-x-auto border border-line">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-bg-panel text-left">
            <tr>
              <Th onClick={() => toggleSort("ticker")} active={sortKey === "ticker"} dir={sortDir}>
                หุ้น
              </Th>
              <th className="px-3 py-2 font-medium">หมวดธุรกิจ</th>
              <Th onClick={() => toggleSort("price")} active={sortKey === "price"} dir={sortDir} align="right">
                ราคา
              </Th>
              <Th
                onClick={() => toggleSort("dividendYieldPct")}
                active={sortKey === "dividendYieldPct"}
                dir={sortDir}
                align="right"
              >
                Div. Yield
              </Th>
              <th className="px-3 py-2 font-medium">รอบจ่าย</th>
              <th className="px-3 py-2 font-medium">XD ล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.ticker} className="border-t border-line">
                <td className="px-3 py-2">
                  <Link href={`/stock/${s.ticker}`} className="font-numeral font-medium text-text hover:text-gold">
                    {s.ticker}
                  </Link>
                  <div className="text-xs text-text-muted">{s.name}</div>
                </td>
                <td className="px-3 py-2 text-text-muted">{s.sector}</td>
                <td className="tabular px-3 py-2 text-right">
                  {s.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </td>
                <td className="tabular px-3 py-2 text-right">
                  <span
                    className={
                      s.highYieldCaution || s.dividendYieldPct >= HIGH_YIELD_THRESHOLD
                        ? "text-gold font-medium"
                        : ""
                    }
                  >
                    {s.dividendYieldPct.toFixed(1)}%
                  </span>
                </td>
                <td className="px-3 py-2 text-text-muted">{s.payoutFreq}</td>
                <td className="px-3 py-2 text-text-muted">{s.lastXdLabel}</td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-text-muted">
                  ไม่พบหุ้นที่ตรงกับคำค้นหา
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {hasHighYield ? (
        <p className="mt-3 text-xs text-text-muted">
          <span className="text-gold">●</span> Div. Yield สูงผิดปกติ (≥ {HIGH_YIELD_THRESHOLD}%) อาจเกิดจากราคาหุ้นปรับตัวลงแรงหรือเป็นเงินปันผลพิเศษ ควรตรวจสอบที่มาก่อนตัดสินใจ
        </p>
      ) : null}
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  dir,
  align = "left",
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: "asc" | "desc";
  align?: "left" | "right";
}) {
  return (
    <th className="px-3 py-2 font-medium">
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1 hover:text-gold ${
          align === "right" ? "ml-auto flex-row-reverse" : ""
        } ${active ? "text-gold" : ""}`}
      >
        {children}
        <span aria-hidden="true" className="text-xs">
          {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
}
