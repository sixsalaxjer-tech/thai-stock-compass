import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "หน้าแรก" },
  { href: "/dividends", label: "หุ้นปันผล" },
  { href: "/watchlist", label: "หุ้นน่าจับตา" },
  { href: "/about", label: "เกี่ยวกับเว็บ" },
];

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[920px] items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span aria-hidden="true" className="text-xl text-gold">
            🧭
          </span>
          <span className="font-numeral text-lg font-semibold text-text">
            เข็มทิศหุ้นไทย
          </span>
        </Link>
        <nav aria-label="เมนูหลัก" className="hidden gap-5 text-sm sm:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-text hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
      <nav aria-label="เมนูหลัก (มือถือ)" className="flex gap-4 overflow-x-auto px-4 pb-3 text-sm sm:hidden">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap text-text hover:text-gold">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
