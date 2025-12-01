"use client";

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";

const COLORS = {
  low: "#22d3ee",
  medium: "#f59e0b",
  high: "#f87171",
};

type Props = {
  data: { label: string; value: number; key: "low" | "medium" | "high" }[];
};

export function RiskDonut({ data }: Props) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={60} outerRadius={80} paddingAngle={4}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={COLORS[entry.key]} stroke="" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
