import type {
  DividendStock,
  GoldAnalysis,
  MarketSnapshot,
  SparklinePoint,
  StockDetail,
  WatchStock,
} from "./types";
import marketData from "./marketData.json";
import dividendData from "./dividendData.json";
import goldData from "./goldData.json";

// ราคาทองคำและ indicator ทั้งหมดคำนวณจากราคาย้อนหลังจริงของ GC=F (COMEX Gold
// Futures) ผ่าน Yahoo Finance โดย scripts/refresh-gold-data.mjs — เป็นสูตรคำนวณ
// ปกติ (SMA/EMA/RSI/MACD/Bollinger/Stochastic/ATR/Fibonacci/Pivot) ไม่ใช่ AI
// คาดเดา แต่จุดซื้อ/ขายที่ได้เป็นเพียงระดับทางเทคนิค ไม่ใช่การรับประกันราคา
export const goldAnalysis: GoldAnalysis = goldData as GoldAnalysis;

// ราคาปัจจุบันของหุ้นแต่ละตัวอ้างอิงราคาซื้อขายบน SET (ตลาดหลักทรัพย์แห่งประเทศไทย)
// ผ่าน Yahoo Finance (set.or.th ปิดกั้นการดึงข้อมูลอัตโนมัติ) — ราคาถูกรีเฟรชอัตโนมัติ
// ทุกสัปดาห์ (หรือกดรันเองได้) ผ่าน scripts/refresh-market-data.mjs ดูปุ่มอัปเดตท้ายเว็บ
// ราคาเป้าหมายอ้างอิงฉันทามติ (consensus) ของนักวิเคราะห์จากหน้า Settrade IAA Consensus
// (อัปเดตด้วยมือเป็นระยะ เนื่องจากไม่มีแหล่งข้อมูลฟรีที่ดึงอัตโนมัติได้อย่างน่าเชื่อถือ)
// ข้อมูลเป็นภาพรวม ณ วันที่ระบุ ไม่ใช่เรียลไทม์ และไม่ใช่คำแนะนำการลงทุน — ควรตรวจสอบราคาล่าสุดก่อนตัดสินใจเสมอ
const SET_PRICE_SOURCE = "SET ผ่าน Yahoo Finance";
const ANALYST_TARGET_SOURCE = "ฉันทามตินักวิเคราะห์ · Settrade IAA Consensus";
const PRICE_AS_OF = `ราคาปิด ${marketData.updatedAtLabel}`;
const TARGET_AS_OF = "ปรับปรุงฉันทามติ 24 ก.ย. 2569";

export const marketSnapshot: MarketSnapshot = {
  indexName: "SET Index",
  value: 1610.7,
  changeAbs: 6.26,
  changePct: 0.39,
  closedAtLabel: "ปิดตลาด 23 ก.ย. 2569",
  turnoverLabel: "มูลค่าซื้อขาย 64,410 ลบ.",
  asOfLabel: "ข้อมูล ณ 23 ก.ย. 2569 17:30 น. · ไม่ใช่เรียลไทม์ (ตัวอย่างสาธิต)",
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

const watchStocksBase: WatchStock[] = [
  {
    ticker: "PTT",
    name: "ปตท.",
    sector: "พลังงาน",
    price: 43.25,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 44.63,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 16 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "ปตท. ประกาศจ่ายเงินปันผลระหว่างกาล 1.40 บาท/หุ้น ขึ้นเครื่องหมาย XD วันที่ 7 ต.ค. 2569 พร้อมอนุมัติซื้อหุ้นคืน 238.66 ล้านหุ้น สะท้อนฐานะการเงินแข็งแกร่ง",
    source: "Posttoday",
    publishedAtLabel: "เผยแพร่ 24 ก.ย. 2569",
  },
  {
    ticker: "PTTEP",
    name: "ปตท.สำรวจและผลิตปิโตรเลียม",
    sector: "พลังงาน",
    price: 150.5,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 164.75,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 20 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "PTTEP เดินหน้าตัดสินใจลงทุนขั้นสุดท้าย (FID) พัฒนาแหล่งก๊าซบงกช โครงการ G3/65 เตรียมเพิ่มกำลังผลิตก๊าซธรรมชาติในปี 2570",
    source: "ข่าวตลาดทุน (Infoquest)",
    publishedAtLabel: "เผยแพร่ ~22 ก.ย. 2569",
  },
  {
    ticker: "KBANK",
    name: "ธนาคารกสิกรไทย",
    sector: "ธนาคาร",
    price: 251.0,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 266.17,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 18 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "บล.กรุงศรีปรับราคาเป้าหมายขึ้นเป็น 260 บาท หลัง KBANK รายงานกำไรสุทธิไตรมาส 2/2569 ที่ 1.33 หมื่นล้านบาท โต 6% YoY",
    source: "Share2Trade",
    publishedAtLabel: "เผยแพร่ ก.ย. 2569",
  },
  {
    ticker: "SCB",
    name: "เอสซีบี เอกซ์",
    sector: "ธนาคาร",
    price: 156.0,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 159.94,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 17 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "บล.กสิกรไทยปรับราคาเป้าหมายขึ้นเป็น 126 บาท ขณะที่บล.ภัทรแนะนำ 'ซื้อ' เป้า 146 บาท ชูจุดเด่นเงินปันผลคาดผลตอบแทนสูงถึง 8.3%",
    source: "Kasikorn Securities",
    publishedAtLabel: "เผยแพร่ ม.ค. 2569",
  },
  {
    ticker: "CPALL",
    name: "ซีพี ออลล์",
    sector: "ค้าปลีก",
    price: 44.25,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 61.35,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 19 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "บล.ดาโอแนะนำ 'ซื้อ' ราคาเป้าหมาย 63 บาท ชี้กระแสเงินสดอิสระแข็งแกร่งกว่า 3.7 หมื่นล้านบาท หนุนโอกาสเพิ่มเงินปันผล",
    source: "Kaohoon",
    publishedAtLabel: "เผยแพร่ ก.ย. 2569",
  },
  {
    ticker: "HMPRO",
    name: "โฮมโปรดักส์ เซ็นเตอร์",
    sector: "ค้าปลีก",
    price: 6.2,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 7.52,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 15 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "บล.เคจีไอปรับราคาเป้าหมายขึ้นเป็น 7.10 บาท หลังคาดกำไรครึ่งหลังปี 2569 ของ HMPRO จะเติบโตแข็งแกร่งกว่าปีก่อน",
    source: "ทันหุ้น",
    publishedAtLabel: "เผยแพร่ ก.ย. 2569",
  },
  {
    ticker: "ADVANC",
    name: "แอดวานซ์ อินโฟร์ เซอร์วิส",
    sector: "สื่อสารโทรคมนาคม",
    price: 345.0,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 404.9,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 17 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "มีรายการซื้อขายบิ๊กล็อต ADVANC มูลค่า 431.35 ล้านบาท ที่ราคาเฉลี่ย 350.13 บาท สูงกว่าราคากระดาน สะท้อนแรงสะสมหุ้นจากนักลงทุนสถาบัน",
    source: "Kaohoon / Infoquest",
    publishedAtLabel: "เผยแพร่ ~17 ก.ย. 2569",
  },
  {
    ticker: "DELTA",
    name: "เดลต้า อีเลคโทรนิคส์",
    sector: "ชิ้นส่วนอิเล็กทรอนิกส์",
    price: 255.0,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 318.53,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 19 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "หุ้นกลุ่มอิเล็กทรอนิกส์บวกยกแผงรับธีม AI โดยโบรกชู DELTA เป็นหุ้นเด่น คาดกำไรไตรมาส 3/2569 เติบโตถึง 45%",
    source: "Kaohoon",
    publishedAtLabel: "เผยแพร่ 22 ก.ย. 2569",
  },
  {
    ticker: "SCC",
    name: "ปูนซิเมนต์ไทย",
    sector: "วัสดุก่อสร้าง",
    price: 267.0,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 280.5,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 14 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "ราคาหุ้น SCC เด้งขึ้นกว่า 3% รับข่าวโรงงาน ROC (โอเลฟินส์ระยอง) กลับมาเดินเครื่องผลิตอีกครั้ง หนุนมุมมองวัฏจักรปิโตรเคมีฟื้นตัว",
    source: "Kaohoon",
    publishedAtLabel: "เผยแพร่ ก.ย. 2569",
  },
  {
    ticker: "AP",
    name: "เอพี (ไทยแลนด์)",
    sector: "อสังหาริมทรัพย์",
    price: 7.9,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 10.24,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 16 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "บล.กรุงศรีคงคำแนะนำ 'ซื้อ' ราคาเป้าหมาย 10.10 บาท หลัง AP รายงานกำไรไตรมาส 2/2569 ที่ 1,060 ล้านบาท โต 6%",
    source: "Kaohoon / TrueID",
    publishedAtLabel: "เผยแพร่ ก.ย. 2569",
  },
  {
    ticker: "BDMS",
    name: "กรุงเทพดุสิตเวชการ",
    sector: "โรงพยาบาล/การแพทย์",
    price: 20.0,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 24.33,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 22 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "บล.ทิสโก้ปรับเพิ่มราคาเป้าหมายเป็น 24.50 บาท ขณะที่ FSS แนะนำ 'ซื้อ' ให้เป้า 28.75 บาท คาดกำไรไตรมาส 3/2569 เติบโตเด่น",
    source: "Kaohoon",
    publishedAtLabel: "เผยแพร่ ก.ย. 2569",
  },
  {
    ticker: "BH",
    name: "โรงพยาบาลบำรุงราษฎร์",
    sector: "โรงพยาบาล/การแพทย์",
    price: 196.0,
    priceAsOfLabel: PRICE_AS_OF,
    priceSource: SET_PRICE_SOURCE,
    targetPrice: 216.64,
    targetSource: `${ANALYST_TARGET_SOURCE} (เฉลี่ยจาก 22 โบรกเกอร์)`,
    targetAsOfLabel: TARGET_AS_OF,
    note: "หลังความตึงเครียดในตะวันออกกลางคลี่คลาย โบรกมองผู้ป่วยต่างชาติกลุ่มตะวันออกกลางจะกลับมาใช้บริการเพิ่มขึ้น CGSI แนะนำ 'ซื้อ' เป้า 212 บาท",
    source: "Kaohoon / TrueID",
    publishedAtLabel: "เผยแพร่ ก.ย. 2569",
  },
];

// ผสานราคาสดจาก marketData.json (รีเฟรชโดย scripts/refresh-market-data.mjs) เข้ากับ
// ข้อมูลเชิงบรรณาธิการด้านบน — ฟิลด์อื่น (เป้าหมาย/ข่าว/แหล่งข่าว) ไม่ถูกแตะต้องโดยสคริปต์
export const watchStocks: WatchStock[] = watchStocksBase.map((stock) => {
  const live = (marketData.stocks as Record<string, { price: number } | undefined>)[stock.ticker];
  return live ? { ...stock, price: live.price, priceAsOfLabel: PRICE_AS_OF } : stock;
});

// ราคาอ้างอิงราคาซื้อขายบน SET ผ่าน Yahoo Finance (รีเฟรชอัตโนมัติ), Dividend Yield/
// รอบจ่าย/XD อ้างอิง StockAnalysis.com (ข้อมูลจาก S&P Global Market Intelligence,
// อัปเดตด้วยมือเป็นระยะ) — ดูหมายเหตุแหล่งที่มาในหน้าเว็บ
// หมายเหตุ: INTUCH เพิกถอนออกจากตลาดแล้ว (รวมกิจการกับ GULF เม.ย. 2568) จึงตัดออกจากรายการนี้
export const DIVIDEND_PRICE_SOURCE = "SET ผ่าน Yahoo Finance";
export const DIVIDEND_YIELD_SOURCE = "StockAnalysis.com (ข้อมูลจาก S&P Global Market Intelligence)";
export const DIVIDEND_AS_OF = `ราคาปิด ${dividendData.updatedAtLabel} · Dividend Yield แบบ TTM`;

const dividendStocksBase: DividendStock[] = [
  { ticker: "KTB", name: "ธนาคารกรุงไทย", sector: "ธนาคาร", price: 44.75, dividendYieldPct: 4.63, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 22 ก.ย. 2569" },
  { ticker: "LH", name: "แลนด์แอนด์เฮ้าส์", sector: "อสังหาริมทรัพย์", price: 3.6, dividendYieldPct: 6.91, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 29 เม.ย. 2569" },
  { ticker: "TISCO", name: "ทิสโก้ไฟแนนเชียลกรุ๊ป", sector: "ธนาคาร", price: 127.5, dividendYieldPct: 6.08, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 7 ก.ย. 2569" },
  { ticker: "AP", name: "เอพี (ไทยแลนด์)", sector: "อสังหาริมทรัพย์", price: 7.9, dividendYieldPct: 6.58, payoutFreq: "ปีละ 1 ครั้ง", lastXdLabel: "XD ล่าสุด 6 พ.ค. 2569" },
  { ticker: "SCC", name: "ปูนซิเมนต์ไทย", sector: "วัสดุก่อสร้าง", price: 267.0, dividendYieldPct: 2.62, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 5 ส.ค. 2569" },
  { ticker: "SPALI", name: "ศุภาลัย", sector: "อสังหาริมทรัพย์", price: 16.0, dividendYieldPct: 7.81, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 25 ส.ค. 2569" },
  { ticker: "TVO", name: "น้ำมันพืชไทย", sector: "เกษตร/อาหาร", price: 29.0, dividendYieldPct: 6.79, payoutFreq: "ปีละ 2 ครั้ง", lastXdLabel: "XD ล่าสุด 27 ส.ค. 2569" },
];

export const dividendStocks: DividendStock[] = dividendStocksBase.map((stock) => {
  const live = (dividendData.stocks as Record<string, { price: number } | undefined>)[stock.ticker];
  return live ? { ...stock, price: live.price } : stock;
});

function watchStockToDetail(stock: WatchStock, sector: string, about: string): StockDetail {
  return {
    ticker: stock.ticker,
    name: stock.name,
    sector,
    price: stock.price,
    asOfLabel: stock.priceAsOfLabel,
    priceSource: stock.priceSource,
    targetPrice: stock.targetPrice,
    targetSource: stock.targetSource,
    targetAsOfLabel: stock.targetAsOfLabel,
    about,
  };
}

const stockAbout: Record<string, string> = {
  PTT: "กลุ่มบริษัทพลังงานแห่งชาติ ครอบคลุมธุรกิจสำรวจ ผลิต และจำหน่ายพลังงานทั้งในและต่างประเทศ",
  PTTEP: "บริษัทในกลุ่ม ปตท. ดำเนินธุรกิจสำรวจและผลิตปิโตรเลียมทั้งในและต่างประเทศ",
  KBANK: "หนึ่งในธนาคารพาณิชย์ขนาดใหญ่ของไทย ให้บริการทางการเงินครบวงจรทั้งรายย่อยและรายใหญ่",
  SCB: "บริษัทโฮลดิ้งของกลุ่มธนาคารไทยพาณิชย์ ขยายธุรกิจสู่ฟินเทคและบริการทางการเงินดิจิทัล",
  CPALL: "ผู้ดำเนินธุรกิจร้านสะดวกซื้อเซเว่นอีเลฟเว่นในประเทศไทย",
  HMPRO: "ผู้ดำเนินธุรกิจค้าปลีกสินค้าตกแต่งและซ่อมแซมบ้านรายใหญ่ของไทย",
  ADVANC: "ผู้ให้บริการเครือข่ายโทรศัพท์เคลื่อนที่รายใหญ่ของไทย",
  DELTA: "ผู้ผลิตชิ้นส่วนอิเล็กทรอนิกส์และอุปกรณ์จ่ายไฟ รายได้ส่วนใหญ่มาจากตลาดส่งออก",
  SCC: "กลุ่มธุรกิจปูนซีเมนต์ วัสดุก่อสร้าง เคมีภัณฑ์ และบรรจุภัณฑ์รายใหญ่ของไทย",
  AP: "ผู้พัฒนาอสังหาริมทรัพย์ที่อยู่อาศัย ทั้งบ้านจัดสรรและคอนโดมิเนียม",
  BDMS: "เครือโรงพยาบาลเอกชนรายใหญ่ที่สุดของไทย ให้บริการทั้งผู้ป่วยไทยและต่างชาติ",
  BH: "โรงพยาบาลเอกชนที่เน้นกลุ่มผู้ป่วยต่างชาติและบริการทางการแพทย์ระดับพรีเมียม",
};

export const stockDetails: Record<string, StockDetail> = Object.fromEntries(
  watchStocks.map((stock) => [
    stock.ticker,
    watchStockToDetail(stock, stock.sector, stockAbout[stock.ticker] ?? ""),
  ])
);

export const liveCheckLinks = [
  { label: "SET (ตลาดหลักทรัพย์ฯ)", href: "https://www.set.or.th" },
  { label: "Settrade", href: "https://www.settrade.com" },
  { label: "TradingView", href: "https://www.tradingview.com/symbols/SET-SET/" },
];

export const dataSources = [
  { name: "ตลาดหลักทรัพย์แห่งประเทศไทย (SET)", href: "https://www.set.or.th" },
  { name: "Yahoo Finance (ราคาซื้อขายบน SET, รีเฟรชอัตโนมัติ)", href: "https://finance.yahoo.com" },
  { name: "Settrade IAA Consensus (ราคาเป้าหมายเฉลี่ยนักวิเคราะห์)", href: "https://www.settrade.com" },
  { name: "StockAnalysis.com (Dividend Yield/รอบจ่าย/XD)", href: "https://stockanalysis.com" },
  { name: "COMEX Gold Futures (GC=F) ผ่าน Yahoo Finance — ราคาทองคำและ indicator", href: "https://finance.yahoo.com/quote/GC=F/" },
  { name: "TradingView", href: "https://www.tradingview.com" },
  { name: "ดัชนี SET ภาพรวมและสรุปข่าวหน้าแรก: ข้อมูลตัวอย่างที่คิวเรตโดยทีมบรรณาธิการเว็บไซต์ (สำหรับสาธิต MVP)", href: undefined },
];
