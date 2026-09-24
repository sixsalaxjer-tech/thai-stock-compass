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
  sector: string;
  price: number;
  priceAsOfLabel: string;
  priceSource: string;
  targetPrice: number;
  targetSource: string;
  targetAsOfLabel: string;
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
  asOfLabel: string;
  priceSource: string;
  targetPrice: number;
  targetSource: string;
  targetAsOfLabel: string;
  about: string;
};

export type GoldIndicatorSignal = "bullish" | "bearish" | "neutral";

export type GoldIndicator = {
  key: string;
  name: string;
  value: string;
  signal: GoldIndicatorSignal;
  signalLabel: string;
  description: string;
};

export type GoldZone = {
  price: number;
  rationale: string;
};

export type GoldAnalysis = {
  price: number;
  priceAsOfLabel: string;
  priceSource: string;
  trend: "uptrend" | "downtrend" | "neutral";
  trendLabel: string;
  buyZone: GoldZone;
  sellZone: GoldZone;
  indicators: GoldIndicator[];
};
