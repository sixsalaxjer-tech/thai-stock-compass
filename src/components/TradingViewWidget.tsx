"use client";

import { useEffect, useRef } from "react";

export function TradingViewWidget({ symbol, label }: { symbol: string; label?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Guards against React Strict Mode's dev double-invoke: without this,
    // the external TradingView script's async init can race against a
    // second innerHTML reset and throw on a container it no longer finds.
    if (container.dataset.tvSymbol === symbol) return;
    container.innerHTML = "";
    container.dataset.tvSymbol = symbol;

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [[symbol]],
      chartOnly: false,
      width: "100%",
      height: "400",
      locale: "th",
      colorTheme: "dark",
      autosize: true,
      showVolume: false,
      isTransparent: true,
    });
    container.appendChild(script);
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container border border-line"
      aria-label={`กราฟราคา ${label ?? symbol} จาก TradingView`}
    />
  );
}
