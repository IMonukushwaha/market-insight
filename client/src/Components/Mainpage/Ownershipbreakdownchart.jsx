import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "../../Style/Mainpagecss/stockchart.css";

const COLORS = ["#4f46e5", "#22c55e", "#a3a3a3"];

export default function OwnershipBreakdownChart({ chartData }) {
  const breakdown = chartData?.majorShareholders;
  if (!breakdown || typeof breakdown !== "object") return null;

  const insiders = breakdown.insidersPercentHeld;
  const institutions = breakdown.institutionsPercentHeld;

  if (typeof insiders !== "number" && typeof institutions !== "number") return null;

  const insidersPct = typeof insiders === "number" ? insiders * 100 : 0;
  const institutionsPct = typeof institutions === "number" ? institutions * 100 : 0;
  const publicPct = Math.max(0, 100 - insidersPct - institutionsPct);

  const rows = [
    { name: "Institutions", value: parseFloat(institutionsPct.toFixed(2)) },
    { name: "Insiders", value: parseFloat(insidersPct.toFixed(2)) },
    { name: "Public / Other", value: parseFloat(publicPct.toFixed(2)) },
  ].filter((r) => r.value > 0);

  if (rows.length === 0) return null;

  return (
    <div className="stock-chart-card">
      <div className="stock-chart-header">
        <span className="stock-chart-name">Ownership Breakdown</span>
      </div>
      {/* extra height + top/bottom margin gives the outer % labels room so
          they don't get clipped at the edges of the card */}
      <ResponsiveContainer width="100%" height={320}>
        <PieChart margin={{ top: 30, right: 30, bottom: 20, left: 30 }}>
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={90}
            label={(d) => `${d.value}%`}
          >
            {rows.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}