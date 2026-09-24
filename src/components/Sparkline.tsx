import type { SparklinePoint } from "@/lib/types";

export function Sparkline({
  points,
  width = 640,
  height = 120,
  ariaLabel,
}: {
  points: SparklinePoint[];
  width?: number;
  height?: number;
  ariaLabel: string;
}) {
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padY = 12;
  const stepX = points.length > 1 ? width / (points.length - 1) : width;

  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = padY + (1 - (p.value - min) / range) * (height - padY * 2);
    return { x, y };
  });

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(" ");

  const trendUp = values[values.length - 1] >= values[0];
  const strokeColor = trendUp ? "var(--up)" : "var(--down)";
  const last = coords[coords.length - 1];

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${width} ${height}`}
      className="h-28 w-full"
      preserveAspectRatio="none"
    >
      <path d={path} fill="none" stroke={strokeColor} strokeWidth={2} />
      {last ? (
        <circle cx={last.x} cy={last.y} r={3.5} fill={strokeColor} />
      ) : null}
    </svg>
  );
}
