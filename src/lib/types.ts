export type MarketSnapshot = {
  indexName: string;
  value: number;
  changeAbs: number;
  changePct: number;
  closedAtLabel: string;
  turnoverLabel: string;
  asOfLabel: string;
};

export type SparklinePoint = {
  label: string;
  value: number;
};

export type WatchStock = {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
  note: string;
  source: string;
  publishedAtLabel: string;
};

export type DividendStock = {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  dividendYieldPct: number;
  payoutFreq: string;
  lastXdLabel: string;
  highYieldCaution?: boolean;
};

export type StockDetail = {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  changeAbs: number;
  changePct: number;
  peRatio: number;
  dividendYieldPct: number;
  asOfLabel: string;
  about: string;
};
