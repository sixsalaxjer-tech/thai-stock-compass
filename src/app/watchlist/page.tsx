import type { Metadata } from "next";
import { StockWatchCard } from "@/components/StockWatchCard";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { CautionCallout } from "@/components/CautionCallout";
import { watchStocks } from "@/lib/data";
import type { WatchStock } from "@/lib/types";

export const metadata: Metadata = {
  title: "หุ้นแนะนำแยกตามกลุ่ม",
  description: "หุ้นแนะนำแยกตามกลุ่มอุตสาหกรรม พร้อมราคาปัจจุบัน ราคาเป้าหมายนักวิเคราะห์ และ upside",
};

function groupBySector(stocks: WatchStock[]) {
  const groups = new Map<string, WatchStock[]>();
  for (const stock of stocks) {
    const list = groups.get(stock.sector) ?? [];
    list.push(stock);
    groups.set(stock.sector, list);
  }
  return groups;
}

export default function WatchlistPage() {
  const groups = groupBySector(watchStocks);

  return (
    <div className="py-8 pb-12">
      <h1 className="text-xl font-medium">หุ้นแนะนำแยกตามกลุ่ม</h1>
      <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-text-muted">
        ราคาปัจจุบันอ้างอิงราคาซื้อขายบน SET (ตลาดหลักทรัพย์แห่งประเทศไทย) ส่วนราคาเป้าหมายอ้างอิงฉันทามติ (consensus)
        ของนักวิเคราะห์ แต่ละรายการระบุแหล่งที่มาและวันที่กำกับไว้เสมอ
      </p>
      <div className="mt-4">
        <DataFreshnessBadge label="ราคาปิด 24 ก.ย. 2569 · เป้าหมายนักวิเคราะห์ปรับปรุง 24 ก.ย. 2569" />
      </div>

      <div className="mt-6">
        <CautionCallout>
          &ldquo;จุดแนะนำเข้าซื้อ&rdquo; ในที่นี้คือราคาซื้อขายปัจจุบัน ส่วน &ldquo;ราคาเป้าหมาย&rdquo; และ upside มาจากฉันทามติเฉลี่ยของนักวิเคราะห์
          ซึ่งเป็นเพียงมุมมองคาดการณ์ ไม่ใช่คำแนะนำการลงทุนของเว็บไซต์ และไม่ได้รับประกันว่าราคาจะไปถึงเป้าหมายจริง
          ควรตรวจสอบราคาล่าสุดและศึกษาข้อมูลเพิ่มเติมก่อนตัดสินใจลงทุนเสมอ
        </CautionCallout>
      </div>

      {Array.from(groups.entries()).map(([sector, stocks]) => (
        <section key={sector} className="mt-10" aria-label={`หุ้นแนะนำกลุ่ม${sector}`}>
          <h2 className="border-b border-line pb-2 text-base font-medium">{sector}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {stocks.map((stock) => (
              <StockWatchCard key={stock.ticker} stock={stock} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
