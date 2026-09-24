#!/usr/bin/env node
// Refreshes src/lib/goldData.json: current gold price (USD/oz) and a set of
// technical indicators computed from real daily price history, all pulled
// from Yahoo Finance's public chart endpoint (no API key). Ticker is
// "GC=F" (COMEX Gold futures, continuous front-month) — Yahoo doesn't serve
// a working spot XAU/USD symbol any more, and GC=F is the standard USD/oz
// benchmark most retail sources track as "the gold price".
//
// Every indicator below is plain, documented technical-analysis math run on
// that real price series — nothing here is AI-generated or guessed. The
// suggested buy/sell zones are derived mechanically from the indicator
// levels (see deriveZones); they are not a prediction, and the page must
// keep saying so.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GOLD_DATA_PATH = path.join(__dirname, "../src/lib/goldData.json");

const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

function toThaiDateLabel(date) {
  const d = date.getUTCDate();
  const m = THAI_MONTHS[date.getUTCMonth()];
  const y = date.getUTCFullYear() + 543;
  return `${d} ${m} ${y}`;
}

function fmt(n, digits = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

// ---- indicator math -------------------------------------------------------

function sma(values, period, endIndex) {
  const start = endIndex - period + 1;
  if (start < 0) return null;
  let sum = 0;
  for (let i = start; i <= endIndex; i++) {
    if (values[i] == null) return null;
    sum += values[i];
  }
  return sum / period;
}

function smaSeries(values, period) {
  return values.map((_, i) => sma(values, period, i));
}

function emaSeries(values, period) {
  const out = new Array(values.length).fill(null);
  const k = 2 / (period + 1);
  let prevEma = null;
  for (let i = 0; i < values.length; i++) {
    if (values[i] == null) continue;
    if (prevEma == null) {
      const seed = sma(values, period, i);
      if (seed != null) {
        prevEma = seed;
        out[i] = prevEma;
      }
    } else {
      prevEma = values[i] * k + prevEma * (1 - k);
      out[i] = prevEma;
    }
  }
  return out;
}

function rsiSeries(values, period = 14) {
  const out = new Array(values.length).fill(null);
  let avgGain = null;
  let avgLoss = null;
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    if (i < period) continue;
    if (i === period) {
      let gainSum = 0;
      let lossSum = 0;
      for (let j = 1; j <= period; j++) {
        const c = values[j] - values[j - 1];
        if (c >= 0) gainSum += c;
        else lossSum -= c;
      }
      avgGain = gainSum / period;
      avgLoss = lossSum / period;
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

function macdSeries(values, fast = 12, slow = 26, signalPeriod = 9) {
  const emaFast = emaSeries(values, fast);
  const emaSlow = emaSeries(values, slow);
  const startIdx = slow - 1;
  const macdLine = new Array(values.length).fill(null);
  for (let i = startIdx; i < values.length; i++) {
    if (emaFast[i] != null && emaSlow[i] != null) macdLine[i] = emaFast[i] - emaSlow[i];
  }
  const macdSlice = macdLine.slice(startIdx);
  const signalSlice = emaSeries(macdSlice, signalPeriod);
  const signalLine = new Array(values.length).fill(null);
  for (let i = 0; i < signalSlice.length; i++) {
    if (signalSlice[i] != null) signalLine[startIdx + i] = signalSlice[i];
  }
  const histogram = macdLine.map((v, i) => (v != null && signalLine[i] != null ? v - signalLine[i] : null));
  return { macdLine, signalLine, histogram };
}

function bollingerBands(values, period = 20, mult = 2) {
  const mid = smaSeries(values, period);
  const upper = new Array(values.length).fill(null);
  const lower = new Array(values.length).fill(null);
  for (let i = period - 1; i < values.length; i++) {
    if (mid[i] == null) continue;
    let sumSq = 0;
    for (let j = i - period + 1; j <= i; j++) sumSq += (values[j] - mid[i]) ** 2;
    const sd = Math.sqrt(sumSq / period);
    upper[i] = mid[i] + mult * sd;
    lower[i] = mid[i] - mult * sd;
  }
  return { mid, upper, lower };
}

function stochasticOscillator(highs, lows, closes, period = 14, dPeriod = 3) {
  const k = new Array(closes.length).fill(null);
  for (let i = period - 1; i < closes.length; i++) {
    let hh = -Infinity;
    let ll = Infinity;
    for (let j = i - period + 1; j <= i; j++) {
      hh = Math.max(hh, highs[j]);
      ll = Math.min(ll, lows[j]);
    }
    k[i] = hh === ll ? 50 : ((closes[i] - ll) / (hh - ll)) * 100;
  }
  const d = smaSeries(k, dPeriod);
  return { k, d };
}

function atrSeries(highs, lows, closes, period = 14) {
  const tr = new Array(closes.length).fill(null);
  for (let i = 1; i < closes.length; i++) {
    tr[i] = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
  }
  const out = new Array(closes.length).fill(null);
  let prevAtr = null;
  for (let i = 1; i < closes.length; i++) {
    if (i === period) {
      let sum = 0;
      for (let j = 1; j <= period; j++) sum += tr[j];
      prevAtr = sum / period;
      out[i] = prevAtr;
    } else if (i > period) {
      prevAtr = (prevAtr * (period - 1) + tr[i]) / period;
      out[i] = prevAtr;
    }
  }
  return out;
}

function fibonacciLevels(highs, lows, isUptrend, lookback = 90) {
  const recentHighs = highs.slice(-lookback);
  const recentLows = lows.slice(-lookback);
  const swingHigh = Math.max(...recentHighs);
  const swingLow = Math.min(...recentLows);
  const diff = swingHigh - swingLow;
  const ratios = [0.236, 0.382, 0.5, 0.618, 0.786];
  const levels = {};
  for (const r of ratios) {
    // Uptrend: measuring a pullback down from the swing high.
    // Downtrend: measuring a bounce up from the swing low.
    levels[r] = isUptrend ? swingHigh - diff * r : swingLow + diff * r;
  }
  return { swingHigh, swingLow, levels };
}

function classicPivots(prevHigh, prevLow, prevClose) {
  const pivot = (prevHigh + prevLow + prevClose) / 3;
  const r1 = 2 * pivot - prevLow;
  const s1 = 2 * pivot - prevHigh;
  const r2 = pivot + (prevHigh - prevLow);
  const s2 = pivot - (prevHigh - prevLow);
  return { pivot, r1, s1, r2, s2 };
}

// ---- fetch ------------------------------------------------------------

async function fetchGoldHistory() {
  const url = "https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&range=1y";
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`chart GC=F: HTTP ${res.status}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error("chart GC=F: empty result");
  const quote = result.indicators.quote[0];
  return {
    price: result.meta.regularMarketPrice,
    closes: quote.close,
    highs: quote.high,
    lows: quote.low,
  };
}

// ---- build the indicator + zone output --------------------------------

function buildAnalysis({ price, closes, highs, lows }, asOfLabel) {
  const last = closes.length - 1;

  const sma50Series = smaSeries(closes, 50);
  const sma200Series = smaSeries(closes, 200);
  const sma50 = sma50Series[last];
  const sma200 = sma200Series[last];

  const ema20Series = emaSeries(closes, 20);
  const ema20 = ema20Series[last];

  const rsi14 = rsiSeries(closes, 14)[last];

  const { macdLine, signalLine, histogram } = macdSeries(closes, 12, 26, 9);
  const macd = macdLine[last];
  const macdSignal = signalLine[last];
  const macdHist = histogram[last];

  const bb = bollingerBands(closes, 20, 2);
  const bbUpper = bb.upper[last];
  const bbMid = bb.mid[last];
  const bbLower = bb.lower[last];

  const stoch = stochasticOscillator(highs, lows, closes, 14, 3);
  const stochK = stoch.k[last];
  const stochD = stoch.d[last];

  const atr14 = atrSeries(highs, lows, closes, 14)[last];

  const isUptrend = sma50 != null && sma200 != null ? sma50 > sma200 : closes[last] > closes[0];
  const fib = fibonacciLevels(highs, lows, isUptrend, 90);

  const pivots = classicPivots(highs[last - 1], lows[last - 1], closes[last - 1]);

  const trend = sma50 == null || sma200 == null ? "neutral" : sma50 > sma200 ? "uptrend" : "downtrend";
  const trendLabel = trend === "uptrend" ? "แนวโน้มขาขึ้น" : trend === "downtrend" ? "แนวโน้มขาลง" : "แนวโน้มไม่ชัดเจน";

  // --- support/resistance for buy/sell zones ---
  // Nearest level below price (support) and nearest above price (resistance)
  // out of every level this script computes, named so the rationale can say
  // exactly which indicator produced it instead of a generic blurb.
  const allLevels = [
    { name: "Bollinger Band ล่าง", value: bbLower },
    { name: "Bollinger Band บน", value: bbUpper },
    { name: "Fibonacci 23.6%", value: fib.levels[0.236] },
    { name: "Fibonacci 38.2%", value: fib.levels[0.382] },
    { name: "Fibonacci 50%", value: fib.levels[0.5] },
    { name: "Fibonacci 61.8%", value: fib.levels[0.618] },
    { name: "Fibonacci 78.6%", value: fib.levels[0.786] },
    { name: "Pivot R1", value: pivots.r1 },
    { name: "Pivot R2", value: pivots.r2 },
    { name: "Pivot S1", value: pivots.s1 },
    { name: "Pivot S2", value: pivots.s2 },
  ].filter((l) => typeof l.value === "number");

  const supportCandidates = allLevels.filter((l) => l.value < price);
  const resistanceCandidates = allLevels.filter((l) => l.value > price);

  const chosenSupport =
    supportCandidates.length > 0
      ? supportCandidates.reduce((a, b) => (a.value > b.value ? a : b))
      : { name: "จุดต่ำสุดในรอบ 90 วัน", value: fib.swingLow };
  const chosenResistance =
    resistanceCandidates.length > 0
      ? resistanceCandidates.reduce((a, b) => (a.value < b.value ? a : b))
      : { name: "จุดสูงสุดในรอบ 90 วัน", value: fib.swingHigh };

  const buyPrice = chosenSupport.value;
  const sellPrice = chosenResistance.value;

  const indicators = [
    {
      key: "movingAverage",
      name: "SMA 50 / SMA 200",
      value: `SMA50 ${fmt(sma50)} · SMA200 ${fmt(sma200)}`,
      signal: trend === "uptrend" ? "bullish" : trend === "downtrend" ? "bearish" : "neutral",
      signalLabel: trend === "uptrend" ? "Golden Cross โซนขาขึ้น" : trend === "downtrend" ? "Death Cross โซนขาลง" : "เป็นกลาง",
      description: "เปรียบเทียบเส้นค่าเฉลี่ยเคลื่อนที่ระยะสั้น (50 วัน) กับระยะยาว (200 วัน) เพื่อดูทิศทางแนวโน้มหลัก",
    },
    {
      key: "ema20",
      name: "EMA 20",
      value: fmt(ema20),
      signal: price > ema20 ? "bullish" : price < ema20 ? "bearish" : "neutral",
      signalLabel: price > ema20 ? "ราคาอยู่เหนือ EMA 20" : "ราคาอยู่ใต้ EMA 20",
      description: "ค่าเฉลี่ยเคลื่อนที่แบบถ่วงน้ำหนัก 20 วัน ใช้ดูแนวโน้มระยะสั้น",
    },
    {
      key: "rsi",
      name: "RSI (14)",
      value: fmt(rsi14, 1),
      signal: rsi14 >= 70 ? "bearish" : rsi14 <= 30 ? "bullish" : "neutral",
      signalLabel: rsi14 >= 70 ? "Overbought (ซื้อมากเกินไป)" : rsi14 <= 30 ? "Oversold (ขายมากเกินไป)" : "เป็นกลาง",
      description: "ดัชนีความแข็งแกร่งสัมพัทธ์ วัดภาวะซื้อ/ขายมากเกินไปในรอบ 14 วัน",
    },
    {
      key: "macd",
      name: "MACD (12,26,9)",
      value: `MACD ${fmt(macd)} · Signal ${fmt(macdSignal)} · Hist ${fmt(macdHist)}`,
      signal: macdHist > 0 ? "bullish" : macdHist < 0 ? "bearish" : "neutral",
      signalLabel: macdHist > 0 ? "โมเมนตัมเป็นบวก" : macdHist < 0 ? "โมเมนตัมเป็นลบ" : "เป็นกลาง",
      description: "วัดโมเมนตัมจากส่วนต่างเส้นค่าเฉลี่ยเคลื่อนที่แบบเอ็กซ์โพเนนเชียล 12 และ 26 วัน",
    },
    {
      key: "bollinger",
      name: "Bollinger Bands (20,2)",
      value: `บน ${fmt(bbUpper)} · กลาง ${fmt(bbMid)} · ล่าง ${fmt(bbLower)}`,
      signal: price >= bbUpper ? "bearish" : price <= bbLower ? "bullish" : "neutral",
      signalLabel: price >= bbUpper ? "ราคาชนกรอบบน" : price <= bbLower ? "ราคาชนกรอบล่าง" : "อยู่ในกรอบ",
      description: "กรอบเบี่ยงเบนมาตรฐาน 2 เท่ารอบค่าเฉลี่ย 20 วัน ใช้ดูความผันผวนและจุดกลับตัว",
    },
    {
      key: "stochastic",
      name: "Stochastic Oscillator (14,3)",
      value: `%K ${fmt(stochK, 1)} · %D ${fmt(stochD, 1)}`,
      signal: stochK >= 80 ? "bearish" : stochK <= 20 ? "bullish" : "neutral",
      signalLabel: stochK >= 80 ? "Overbought" : stochK <= 20 ? "Oversold" : "เป็นกลาง",
      description: "เปรียบเทียบราคาปิดล่าสุดกับช่วงราคาสูงสุด-ต่ำสุดในรอบ 14 วัน",
    },
    {
      key: "atr",
      name: "ATR (14)",
      value: `${fmt(atr14)} (~${fmt((atr14 / price) * 100, 1)}% ของราคา)`,
      signal: "neutral",
      signalLabel: "ข้อมูลความผันผวน ไม่ใช่สัญญาณซื้อขาย",
      description: "ช่วงเฉลี่ยที่ราคาแกว่งต่อวัน ใช้ประกอบการตั้งจุดตัดขาดทุน (stop-loss)",
    },
    {
      key: "fibonacci",
      name: "Fibonacci Retracement",
      value: `61.8% ${fmt(fib.levels[0.618])} · 50% ${fmt(fib.levels[0.5])} · 38.2% ${fmt(fib.levels[0.382])}`,
      signal: "neutral",
      signalLabel: isUptrend ? "วัดแนวรับจากการย่อตัวในขาขึ้น" : "วัดแนวต้านจากการเด้งในขาลง",
      description: "ระดับแนวรับ/แนวต้านตามอัตราส่วนฟีโบนักชี จากจุดสูงสุด-ต่ำสุดในรอบ 90 วัน",
    },
    {
      key: "pivot",
      name: "Pivot Points (Classic)",
      value: `P ${fmt(pivots.pivot)} · R1 ${fmt(pivots.r1)} · S1 ${fmt(pivots.s1)}`,
      signal: price > pivots.pivot ? "bullish" : price < pivots.pivot ? "bearish" : "neutral",
      signalLabel: price > pivots.pivot ? "ราคาอยู่เหนือจุดหมุน" : "ราคาอยู่ใต้จุดหมุน",
      description: "จุดหมุนคลาสสิกคำนวณจากราคาสูงสุด/ต่ำสุด/ปิดของวันก่อนหน้า",
    },
  ];

  return {
    priceAsOfLabel: `ราคาปิด ${asOfLabel}`,
    price,
    priceSource: "COMEX Gold Futures (GC=F) ผ่าน Yahoo Finance",
    trend,
    trendLabel,
    buyZone: {
      price: buyPrice,
      rationale: `แนวรับที่ใกล้ราคาปัจจุบันที่สุดจากทุก indicator ด้านล่าง คือ ${chosenSupport.name} (${fmt(chosenSupport.value)})`,
    },
    sellZone: {
      price: sellPrice,
      rationale: `แนวต้านที่ใกล้ราคาปัจจุบันที่สุดจากทุก indicator ด้านล่าง คือ ${chosenResistance.name} (${fmt(chosenResistance.value)})`,
    },
    indicators,
  };
}

async function main() {
  const { price, closes, highs, lows } = await fetchGoldHistory();
  const asOfLabel = toThaiDateLabel(new Date());
  const analysis = buildAnalysis({ price, closes, highs, lows }, asOfLabel);
  await writeFile(GOLD_DATA_PATH, JSON.stringify(analysis, null, 2) + "\n");
  console.log(`Wrote ${GOLD_DATA_PATH}`);
  console.log(`Gold price: ${fmt(price)} USD/oz, trend: ${analysis.trendLabel}`);
  console.log(`Buy zone: ${fmt(analysis.buyZone.price)}, Sell zone: ${fmt(analysis.sellZone.price)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
