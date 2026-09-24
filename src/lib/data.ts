// ข้อมูลตัวอย่าง (demo/placeholder) สำหรับ MVP — ยังไม่ได้ต่อ API จริง
// แทนที่ด้วยข้อมูลที่คิวเรตจริงหรือดึงจาก backend ก่อนใช้งานจริง
import type {
  DividendStock,
  MarketSnapshot,
  SparklinePoint,
  StockDetail,
  WatchStock,
} from "./types";

export const DEMO_SOURCE_NOTE = "ทีมบรรณาธิการเข็มทิศหุ้นไทย (ข้อมูลตัวอย่างสำหรับสาธิต)";

export const marketSnapshot: MarketSnapshot = {
  indexName: "SET Index",
  value: 1610.7,
  changeAbs: 6.26,
  changePct: 0.39,
  closedAtLabel: "ปิดตลาด 23 ก.ย. 2569",
  turnoverLabel: "มูลค่าซื้อขาย 64,410 ลบ.",
  asOfLabel: "ข้อมูล ณ 23 ก.ย. 2569 17:30 น. · ไม่ใช่เรียลไทม์",
};

export const sparkline7w: SparklinePoint[] = [
  { label: "สัปดาห์ที่ 1", value: 1552.1 },
  { label: "สัปดาห์ที่ 2", value: 1568.4 },
  { label: "สัปดาห์ที่ 3", value: 1560.9 },
  { label: "สัปดาห์ที่ 4", value: 1583.2 },
  { label: "สัปดาห์ที่ 5", value: 1591.6 },
  { label: "สัปดาห์ที่ 6", value: 1604.4 },
  { label: "สัปดาห์ที่ 7", value: 1610.7 },
];

export const marketDirectionParagraphs: string[] = [
  "ตลาดหุ้นไทยวันนี้ปิดบวกเล็กน้อย โดยได้แรงหนุนจากกลุ่มพลังงานและกลุ่มธนาคาร ขณะที่นักลงทุนต่างชาติยังคงซื้อสุทธิต่อเนื่องเป็นวันที่สาม (ตัวอย่างเนื้อหาสรุปข่าว)",
  "ปัจจัยต่างประเทศที่ต้องติดตามคือทิศทางดอกเบี้ยสหรัฐฯ และราคาน้ำมันดิบ ซึ่งอาจส่งผลต่อกลุ่มพลังงานและกลุ่มนำเข้า-ส่งออกในสัปดาห์หน้า",
];

export const watchStocks: WatchStock[] = [
  {
    ticker: "DELTA",
    name: "เดลต้า อีเลคโทรนิคส์",
    price: 92.5,
    changePct: 1.65,
    note: "ได้รับความสนใจจากกระแสการลงทุนในกลุ่มเทคโนโลยี AI และศูนย์ข้อมูล (ตัวอย่างบทสรุป ไม่ใช่คำแนะนำซื้อขาย)",
    source: DEMO_SOURCE_NOTE,
    publishedAtLabel: "เผยแพร่ 23 ก.ย. 2569",
  },
  {
    ticker: "PTT",
    name: "ปตท.",
    price: 33.75,
    changePct: -0.74,
    note: "ราคาน้ำมันดิบผันผวนตามสถานการณ์อุปทานโลก นักวิเคราะห์ติดตามผลประกอบการไตรมาสถัดไป (ตัวอย่างบทสรุป ไม่ใช่คำแนะนำซื้อขาย)",
    source: DEMO_SOURCE_NOTE,
    publishedAtLabel: "เผยแพร่ 23 ก.ย. 2569",
  },
  {
    ticker: "ADVANC",
    name: "แอดวานซ์ อินโฟร์ เซอร์วิส",
    price: 288.0,
    changePct: 0.35,
    note: "กลุ่มสื่อสารยังคงเป็นหุ้นปันผลที่นักลงทุนสถาบันถือครองต่อเนื่อง (ตัวอย่างบทสรุป ไม่ใช่คำแนะนำซื้อขาย)",
    source: DEMO_SOURCE_NOTE,
    publishedAtLabel: "เผยแพร่ 22 ก.ย. 2569",
  },
  {
    ticker: "CPALL",
    name: "ซีพี ออลล์",
    price: 62.25,
    changePct: 0.81,
    note: "ยอดขายสาขาเดิมฟื้นตัวตามการบริโภคในประเทศ (ตัวอย่างบทสรุป ไม่ใช่คำแนะนำซื้อขาย)",
    source: DEMO_SOURCE_NOTE,
    publishedAtLabel: "เผยแพร่ 22 ก.ย. 2569",
  },
];

export const dividendStocks: DividendStock[] = [
  { ticker: "KTB", name: "ธนาคารกรุงไทย", sector: "ธนาคาร", price: 22.4, dividendYieldPct: 7.2, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 15 มี.ค. 2569" },
  { ticker: "INTUCH", name: "อินทัช โฮลดิ้งส์", sector: "สื่อสาร", price: 92.5, dividendYieldPct: 6.4, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 10 มี.ค. 2569" },
  { ticker: "LH", name: "แลนด์แอนด์เฮ้าส์", sector: "อสังหาริมทรัพย์", price: 6.55, dividendYieldPct: 6.1, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 28 ก.พ. 2569" },
  { ticker: "TISCO", name: "ทิสโก้ไฟแนนเชียลกรุ๊ป", sector: "ธนาคาร", price: 99.0, dividendYieldPct: 8.0, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 5 มี.ค. 2569" },
  { ticker: "AP", name: "เอพี (ไทยแลนด์)", sector: "อสังหาริมทรัพย์", price: 7.9, dividendYieldPct: 7.9, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 20 มี.ค. 2569" },
  { ticker: "SCC", name: "ปูนซิเมนต์ไทย", sector: "วัสดุก่อสร้าง", price: 168.0, dividendYieldPct: 5.4, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 12 มี.ค. 2569" },
  { ticker: "SPALI", name: "ศุภาลัย", sector: "อสังหาริมทรัพย์", price: 15.9, dividendYieldPct: 12.8, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 8 มี.ค. 2569", highYieldCaution: true },
  { ticker: "TVO", name: "น้ำมันพืชไทย", sector: "เกษตร/อาหาร", price: 22.1, dividendYieldPct: 11.9, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 2 มี.ค. 2569", highYieldCaution: true },
];

export const stockDetails: Record<string, StockDetail> = {
  DELTA: {
    ticker: "DELTA",
    name: "เดลต้า อีเลคโทรนิคส์ (ประเทศไทย)",
    sector: "ชิ้นส่วนอิเล็กทรอนิกส์",
    price: 92.5,
    changeAbs: 1.5,
    changePct: 1.65,
    peRatio: 45.2,
    dividendYieldPct: 0.6,
    asOfLabel: "ข้อมูล ณ 23 ก.ย. 2569 17:30 น. · ไม่ใช่เรียลไทม์",
    about: "ผู้ผลิตชิ้นส่วนอิเล็กทรอนิกส์และอุปกรณ์จ่ายไฟ รายได้ส่วนใหญ่มาจากตลาดส่งออก",
  },
  PTT: {
    ticker: "PTT",
    name: "บริษัท ปตท. จำกัด (มหาชน)",
    sector: "พลังงาน",
    price: 33.75,
    changeAbs: -0.25,
    changePct: -0.74,
    peRatio: 8.9,
    dividendYieldPct: 5.8,
    asOfLabel: "ข้อมูล ณ 23 ก.ย. 2569 17:30 น. · ไม่ใช่เรียลไทม์",
    about: "กลุ่มบริษัทพลังงานแห่งชาติ ครอบคลุมธุรกิจสำรวจ ผลิต และจำหน่ายพลังงาน",
  },
  ADVANC: {
    ticker: "ADVANC",
    name: "บริษัท แอดวานซ์ อินโฟร์ เซอร์วิส จำกัด (มหาชน)",
    sector: "สื่อสารโทรคมนาคม",
    price: 288.0,
    changeAbs: 1.0,
    changePct: 0.35,
    peRatio: 22.1,
    dividendYieldPct: 4.1,
    asOfLabel: "ข้อมูล ณ 23 ก.ย. 2569 17:30 น. · ไม่ใช่เรียลไทม์",
    about: "ผู้ให้บริการเครือข่ายโทรศัพท์เคลื่อนที่รายใหญ่ของไทย",
  },
  CPALL: {
    ticker: "CPALL",
    name: "บริษัท ซีพี ออลล์ จำกัด (มหาชน)",
    sector: "ค้าปลีก",
    price: 62.25,
    changeAbs: 0.5,
    changePct: 0.81,
    peRatio: 26.4,
    dividendYieldPct: 2.3,
    asOfLabel: "ข้อมูล ณ 23 ก.ย. 2569 17:30 น. · ไม่ใช่เรียลไทม์",
    about: "ผู้ดำเนินธุรกิจร้านสะดวกซื้อเซเว่นอีเลฟเว่นในประเทศไทย",
  },
};

export const liveCheckLinks = [
  { label: "SET (ตลาดหลักทรัพย์ฯ)", href: "https://www.set.or.th" },
  { label: "Settrade", href: "https://www.settrade.com" },
  { label: "TradingView", href: "https://www.tradingview.com/symbols/SET-SET/" },
];

export const dataSources = [
  { name: "ตลาดหลักทรัพย์แห่งประเทศไทย (SET)", href: "https://www.set.or.th" },
  { name: "Settrade", href: "https://www.settrade.com" },
  { name: "TradingView", href: "https://www.tradingview.com" },
  { name: "ข้อมูลตัวอย่างที่คิวเรตโดยทีมบรรณาธิการเว็บไซต์ (สำหรับสาธิต MVP)", href: undefined },
];
