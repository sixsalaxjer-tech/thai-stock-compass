import Link from "next/link";
import { dataSources } from "@/lib/data";

export function SourceFooter() {
  return (
    <footer className="mt-auto border-t border-line py-8 text-sm text-text-muted">
      <div className="mx-auto max-w-[920px] px-4">
        <h2 className="text-xs font-medium uppercase tracking-wide text-text">
          แหล่งอ้างอิงข้อมูล
        </h2>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {dataSources.map((source) => (
            <li key={source.name}>
              {source.href ? (
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold"
                >
                  {source.name}
                </a>
              ) : (
                source.name
              )}
            </li>
          ))}
        </ul>

        <p className="mt-3">
          <a
            href="https://github.com/sixsalaxjer-tech/thai-stock-compass/actions/workflows/refresh-data.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold"
          >
            รีเฟรชราคาล่าสุดตอนนี้ (GitHub Actions, ต้องล็อกอิน GitHub ของเจ้าของเว็บ) →
          </a>
        </p>

        <p className="mt-4 leading-relaxed">
          เว็บไซต์นี้จัดทำขึ้นเพื่อเป็นข้อมูลประกอบการตัดสินใจเท่านั้น{" "}
          <strong className="text-text">ไม่ใช่คำแนะนำการลงทุน</strong>{" "}
          ผู้จัดทำไม่ใช่ที่ปรึกษาการเงินที่มีใบอนุญาต การลงทุนมีความเสี่ยง
          ผู้ลงทุนควรศึกษาข้อมูลให้รอบด้านก่อนตัดสินใจ อ่านเพิ่มเติมที่{" "}
          <Link href="/disclaimer" className="underline hover:text-gold">
            ข้อจำกัดความรับผิดชอบฉบับเต็ม
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
