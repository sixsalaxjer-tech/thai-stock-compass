import type { Metadata, Viewport } from "next";
import { Taviraj, Sarabun } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { SourceFooter } from "@/components/SourceFooter";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { basePath } from "@/lib/basePath";

const taviraj = Taviraj({
  variable: "--font-taviraj",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "เข็มทิศหุ้นไทย — จุดเริ่มต้นสำรวจหุ้นไทย",
    template: "%s · เข็มทิศหุ้นไทย",
  },
  description:
    "ภาพรวมตลาดหุ้นไทย (SET Index), หุ้นน่าจับตาจากมุมมองนักวิเคราะห์/สื่อการเงิน และหุ้นปันผลเด่น พร้อมกลไกเช็คราคาล่าสุด — ไม่ใช่คำแนะนำการลงทุน",
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "เข็มทิศหุ้นไทย",
  },
  icons: {
    icon: [
      { url: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${basePath}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1eee2" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1815" },
  ],
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${taviraj.variable} ${sarabun.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <ServiceWorkerRegister />
        <Header />
        <main className="mx-auto w-full max-w-[920px] flex-1 px-4">{children}</main>
        <SourceFooter />
      </body>
    </html>
  );
}
