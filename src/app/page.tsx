import Link from "next/link";
import { IndexHero } from "@/components/IndexHero";
import { Sparkline } from "@/components/Sparkline";
import { StockWatchCard } from "@/components/StockWatchCard";
import { DividendTable } from "@/components/DividendTable";
import { CautionCallout } from "@/components/CautionCallout";
import { LiveCheckLinks } from "@/components/LiveCheckLinks";
import {
  dividendStocks,
  liveCheckLinks,
  marketDirectionParagraphs,
  marketSnapshot,
  sparkline7w,
  watchStocks,
} from "@/lib/data";

export default function Home() {
  return (
    <div className="pb-12">
      <IndexHero snapshot={marketSnapshot} />

      <section className="border-b border-line py-8" aria-label="กราฟแนวโน้ม 7 สัปดาห์">
        <h2 className="text-base font-medium">กราฟแนวโน้ม 7 สัปดาห์</h2>
        <div className="mt-4">
          <Sparkline points={sparkline7w} ariaLabel="กราฟแนวโน้ม SET Index ย้อนหลัง 7 สัปดาห์" />
        </div>
      </section>

      <section className="border-b border-line py-8" aria-label="ทิศทางตลาดวันนี้">
        <h2 className="text-base font-medium">ทิศทางตลาดวันนี้</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-text">
          {marketDirectionParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="border-b border-line py-8" aria-label="หุ้นที่นักวิเคราะห์จับตา">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-medium">หุ้นที่นักวิเคราะห์จับตา</h2>
          <Link href="/watchlist" className="text-sm text-gold hover:underline">
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {watchStocks.map((stock) => (
            <StockWatchCard key={stock.ticker} stock={stock} />
          ))}
        </div>
      </section>

      <section className="border-b border-line py-8" aria-label="เข็มทิศหุ้นปันผล">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-medium">เข็มทิศหุ้นปันผล</h2>
          <Link href="/dividends" className="text-sm text-gold hover:underline">
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="mt-4">
          <DividendTable stocks={dividendStocks} />
        </div>
      </section>

      <section className="border-b border-line py-8">
        <CautionCallout>
          ตัวเลข Dividend Yield คำนวณจากราคาปัจจุบันและเงินปันผลย้อนหลัง อัตราที่สูงผิดปกติอาจสะท้อนความเสี่ยงของธุรกิจ
          หรือเงินปันผลพิเศษที่ไม่เกิดขึ้นซ้ำ ไม่ควรใช้เป็นเกณฑ์ตัดสินใจเพียงอย่างเดียว
        </CautionCallout>
      </section>

      <LiveCheckLinks links={liveCheckLinks} />
    </div>
  );
}
