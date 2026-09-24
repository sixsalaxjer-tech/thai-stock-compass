#!/usr/bin/env node
// Refreshes src/lib/marketData.json and src/lib/dividendData.json with the
// current SET price for each ticker, pulled from Yahoo Finance's public chart
// endpoint (no API key). Thai tickers use the ".BK" suffix; Yahoo's own chart
// metadata reports exchangeName "SET" and currency "THB" for these, i.e. it's
// relaying the SET-quoted price via Yahoo's aggregation (set.or.th itself
// blocks automated requests with a 403, and Yahoo's other endpoints that
// carry analyst target price / dividend yield require a session cookie Yahoo
// won't reliably hand out to a script, so this intentionally only refreshes
// price).
//
// Everything else — analyst target price, dividend yield, payout frequency,
// news notes, sector, company info — lives in src/lib/data.ts and is not
// touched here; those need a human (or a research pass) to refresh, not a
// scraper.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MARKET_DATA_PATH = path.join(__dirname, "../src/lib/marketData.json");
const DIVIDEND_DATA_PATH = path.join(__dirname, "../src/lib/dividendData.json");

const WATCH_TICKERS = [
  "PTT", "PTTEP", "KBANK", "SCB", "CPALL", "HMPRO",
  "ADVANC", "DELTA", "SCC", "AP", "BDMS", "BH",
];
const DIVIDEND_TICKERS = ["KTB", "LH", "TISCO", "AP", "SCC", "SPALI", "TVO"];

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

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return { updatedAtLabel: "", stocks: {} };
  }
}

async function fetchChartPrice(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.BK?interval=1d&range=1d`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  const price = meta?.regularMarketPrice;
  if (typeof price !== "number") throw new Error("no regularMarketPrice in response");
  return price;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const today = new Date();
  const asOfLabel = toThaiDateLabel(today);

  const prevMarketData = await readJson(MARKET_DATA_PATH);
  const prevDividendData = await readJson(DIVIDEND_DATA_PATH);

  const marketData = { updatedAtLabel: asOfLabel, stocks: { ...prevMarketData.stocks } };
  const dividendData = { updatedAtLabel: asOfLabel, stocks: { ...prevDividendData.stocks } };
  const skipped = [];
  const updated = [];

  const allTickers = Array.from(new Set([...WATCH_TICKERS, ...DIVIDEND_TICKERS]));

  for (const ticker of allTickers) {
    try {
      const price = await fetchChartPrice(ticker);
      if (WATCH_TICKERS.includes(ticker)) marketData.stocks[ticker] = { price };
      if (DIVIDEND_TICKERS.includes(ticker)) {
        dividendData.stocks[ticker] = { ...dividendData.stocks[ticker], price };
      }
      updated.push(ticker);
    } catch (err) {
      skipped.push(`${ticker} (fetch failed: ${err.message})`);
    }
    await sleep(250);
  }

  await writeFile(MARKET_DATA_PATH, JSON.stringify(marketData, null, 2) + "\n");
  await writeFile(DIVIDEND_DATA_PATH, JSON.stringify(dividendData, null, 2) + "\n");

  console.log(`Updated price for: ${updated.join(", ")}`);
  console.log(`Wrote ${MARKET_DATA_PATH}`);
  console.log(`Wrote ${DIVIDEND_DATA_PATH}`);
  if (skipped.length > 0) {
    console.log("\nSkipped (kept previous price):");
    for (const line of skipped) console.log(`  - ${line}`);
  }

  if (process.env.GITHUB_OUTPUT) {
    await writeFile(
      process.env.GITHUB_OUTPUT,
      `skipped<<EOF\n${skipped.join("\n")}\nEOF\n`,
      { flag: "a" }
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
