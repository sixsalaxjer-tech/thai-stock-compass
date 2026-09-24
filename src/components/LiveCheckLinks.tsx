import type { liveCheckLinks as LiveCheckLinksType } from "@/lib/data";

export function LiveCheckLinks({
  links,
}: {
  links: typeof LiveCheckLinksType;
}) {
  return (
    <section className="border-y border-line py-6" aria-label="เช็คราคาสด">
      <h2 className="text-base font-medium">เช็คราคาสด</h2>
      <p className="mt-1 text-sm text-text-muted">
        ข้อมูลในหน้านี้อาจดีเลย์ 15-20 นาที ตรวจสอบราคาปัจจุบันได้ที่แหล่งข้อมูลต่อไปนี้
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-line px-4 py-2 text-sm text-text hover:border-gold hover:text-gold"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </section>
  );
}
