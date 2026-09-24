import type { Metadata } from "next";
import { StockWatchCard } from "@/components/StockWatchCard";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { marketSnapshot, watchStocks } from "@/lib/data";

export const metadata: Metadata = {
  title: "หุ้นน่าจับตา",
  description: "หุ้นที่นักวิเคราะห์และสื่อการเงินพูดถึง พร้อมแหล่งอ้างอิงและวันที่เผยแพร่",
};

export default function WatchlistPage() {
  return (
    <div className="py-8 pb-12">
      <h1 className="text-xl font-medium">หุ้นที่นักวิเคราะห์จับตา</h1>
      <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-text-muted">
        สรุปความเห็น/บทวิเคราะห์จากสื่อการเงินและนักวิเคราะห์ แต่ละรายการระบุแหล่งที่มาและวันที่เผยแพร่กำกับไว้เสมอ
        เนื้อหาเหล่านี้เป็นความเห็นของแหล่งข่าวนั้น ๆ ไม่ใช่คำแนะนำของเว็บไซต์
      </p>
      <div className="mt-4">
        <DataFreshnessBadge label={marketSnapshot.asOfLabel} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {watchStocks.map((stock) => (
          <StockWatchCard key={stock.ticker} stock={stock} />
        ))}
      </div>
    </div>
  );
}
