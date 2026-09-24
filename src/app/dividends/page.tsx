import type { Metadata } from "next";
import { DividendTable } from "@/components/DividendTable";
import { CautionCallout } from "@/components/CautionCallout";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { dividendStocks, marketSnapshot } from "@/lib/data";

export const metadata: Metadata = {
  title: "หุ้นปันผล",
  description: "คัดกรองและเรียงลำดับหุ้นปันผลเด่นในตลาดหุ้นไทย",
};

export default function DividendsPage() {
  return (
    <div className="py-8 pb-12">
      <h1 className="text-xl font-medium">เข็มทิศหุ้นปันผล</h1>
      <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-text-muted">
        รายชื่อหุ้นปันผลที่คิวเรตไว้เป็นข้อมูลประกอบการตัดสินใจเท่านั้น ไม่ใช่คำแนะนำการลงทุน
        ตัวเลข Dividend Yield คำนวณจากข้อมูลย้อนหลังและอาจเปลี่ยนแปลงได้
      </p>
      <div className="mt-4">
        <DataFreshnessBadge label={marketSnapshot.asOfLabel} />
      </div>

      <div className="mt-8">
        <DividendTable stocks={dividendStocks} />
      </div>

      <div className="mt-8">
        <CautionCallout>
          หุ้นที่มี Dividend Yield สูงผิดปกติ (≥ 10%) มักมาพร้อมความเสี่ยงเชิงธุรกิจหรือราคาหุ้นที่ปรับตัวลงแรงในอดีต
          ควรตรวจสอบงบการเงินและนโยบายจ่ายปันผลก่อนตัดสินใจลงทุน
        </CautionCallout>
      </div>
    </div>
  );
}
