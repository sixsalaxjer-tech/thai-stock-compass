import type { Metadata } from "next";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { CautionCallout } from "@/components/CautionCallout";
import { GoldIndicatorCard } from "@/components/GoldIndicatorCard";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { goldAnalysis } from "@/lib/data";

export const metadata: Metadata = {
  title: "ทองคำ (Gold)",
  description: "ราคาทองคำ (USD/oz), จุดแนะนำเข้าซื้อ-ขาย และ indicator ทางเทคนิคที่ใช้วิเคราะห์",
};

export default function GoldPage() {
  const { price, trendLabel, buyZone, sellZone, indicators } = goldAnalysis;

  return (
    <div className="py-8 pb-12">
      <h1 className="text-xl font-medium">ทองคำ (Gold) — USD/oz</h1>
      <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-text-muted">
        ราคาทองคำล่วงหน้า COMEX (GC=F) หน่วยดอลลาร์สหรัฐต่อออนซ์ พร้อมจุดแนะนำเข้าซื้อ/ขาย
        ที่คำนวณจาก indicator ทางเทคนิคด้านล่างโดยอัตโนมัติ — เป็นระดับทางเทคนิคจากราคาย้อนหลังจริง
        ไม่ใช่การคาดการณ์หรือคำแนะนำการลงทุน
      </p>
      <div className="mt-4">
        <DataFreshnessBadge label={`${goldAnalysis.priceAsOfLabel} · ${goldAnalysis.trendLabel}`} />
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <span className="font-numeral tabular text-3xl font-semibold">
          {price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        <span className="text-sm text-text-muted">USD / ออนซ์ · {trendLabel}</span>
      </div>

      <section className="mt-8" aria-label="กราฟราคาทองคำ">
        <TradingViewWidget symbol="TVC:GOLD" label="ทองคำ (Gold)" />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="จุดแนะนำเข้าซื้อและขาย">
        <div className="border border-up/60 bg-up/10 p-4">
          <h2 className="text-sm font-medium text-text">จุดแนะนำเข้าซื้อ (แนวรับ)</h2>
          <p className="tabular mt-1 font-numeral text-2xl text-up">
            {buyZone.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-text-muted">{buyZone.rationale}</p>
        </div>
        <div className="border border-down/60 bg-down/10 p-4">
          <h2 className="text-sm font-medium text-text">จุดแนะนำขาย/ทำกำไร (แนวต้าน)</h2>
          <p className="tabular mt-1 font-numeral text-2xl text-down">
            {sellZone.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-text-muted">{sellZone.rationale}</p>
        </div>
      </section>

      <section className="mt-10" aria-label="Indicator ที่ใช้วิเคราะห์">
        <h2 className="border-b border-line pb-2 text-base font-medium">
          Indicator ที่ใช้วิเคราะห์ ({indicators.length} ตัว)
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {indicators.map((indicator) => (
            <GoldIndicatorCard key={indicator.key} indicator={indicator} />
          ))}
        </div>
      </section>

      <div className="mt-8">
        <CautionCallout>
          จุดแนะนำเข้าซื้อ/ขายด้านบนคำนวณจากระดับแนวรับ-แนวต้านทางเทคนิค (Bollinger Bands, Fibonacci,
          Pivot Points) ของราคาย้อนหลังจริงเท่านั้น ไม่ใช่การพยากรณ์อนาคตและไม่ใช่คำแนะนำการลงทุน
          การซื้อขายทองคำล่วงหน้า/สัญญาส่วนต่าง (CFD) มักมีเลเวอเรจสูงและมีความเสี่ยงสูญเสียเงินต้นทั้งหมด
          ควรศึกษาข้อมูลรอบด้านและบริหารความเสี่ยงก่อนตัดสินใจเสมอ
        </CautionCallout>
      </div>

      <p className="mt-4 text-xs text-text-muted">
        ราคา: {goldAnalysis.priceSource} · indicator คำนวณจากราคาปิดย้อนหลัง 1 ปี
      </p>
    </div>
  );
}
