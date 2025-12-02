interface SparklineProps {
  data: number[];
  label?: string;
}

export function Sparkline({ data, label }: SparklineProps) {
  const max = Math.max(...data, 1);
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1 || 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-2">
      {label && <p className="text-xs text-white/60">{label}</p>}
      <svg viewBox="0 0 100 100" className="w-full h-16">
        <defs>
          <linearGradient id="spark" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="1" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="url(#spark)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </div>
  );
}
