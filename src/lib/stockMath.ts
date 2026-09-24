export function upsideFromTarget(price: number, targetPrice: number) {
  const priceDiff = targetPrice - price;
  const upsidePct = (priceDiff / price) * 100;
  return { priceDiff, upsidePct };
}
