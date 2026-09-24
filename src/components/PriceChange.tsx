function formatSigned(value: number, digits = 2) {
  const sign = value > 0 ? "+" : value < 0 ? "" : "±";
  return `${sign}${value.toFixed(digits)}`;
}

export function PriceChange({
  changeAbs,
  changePct,
  size = "md",
}: {
  changeAbs: number;
  changePct: number;
  size?: "sm" | "md" | "lg";
}) {
  const isUp = changeAbs > 0;
  const isDown = changeAbs < 0;
  const color = isUp ? "text-up" : isDown ? "text-down" : "text-text-muted";
  const arrow = isUp ? "▲" : isDown ? "▼" : "―";
  const sizeClass =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <span className={`tabular ${color} ${sizeClass} font-medium`}>
      {arrow} {formatSigned(changeAbs)} ({formatSigned(changePct)}%)
    </span>
  );
}
