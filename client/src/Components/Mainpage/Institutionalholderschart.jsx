import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCompactCurrency } from "./Formatcompactnumber";
import "../../Style/Mainpagecss/stockchart.css";

export default function InstitutionalHoldersChart({ chartData }) {
  const holders = chartData?.institutionalHolders;
  const topHolders = holders?.topHolders;

  if (!Array.isArray(topHolders) || topHolders.length === 0) return null;

  const rows = topHolders
    .filter((h) => h && typeof h.pctHeld === "number" && h.organization)
    .map((h) => ({
      name: h.organization.length > 18 ? h.organization.slice(0, 16) + "…" : h.organization,
      pctHeld: parseFloat((h.pctHeld * 100).toFixed(2)),
      value: typeof h.value === "number" ? h.value : null,
    }));

  if (rows.length === 0) return null;

  return (
    <div className="stock-chart-card">
      <div className="stock-chart-header">
        <span className="stock-chart-name">Top Institutional Holders</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={rows} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            unit="%"
            label={{ value: "% of Shares Held", position: "insideBottom", offset: -10, fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11 }}
            width={110}
            label={{ value: "Institution", angle: -90, position: "insideLeft", fontSize: 12 }}
          />
          <Tooltip
            formatter={(v, name, props) =>
              name === "pctHeld" ? [`${v}%`, "% Held"] : v
            }
            labelFormatter={(label, payload) => {
              const value = payload?.[0]?.payload?.value;
              return value ? `${label} — ${formatCompactCurrency(value)}` : label;
            }}
          />
          <Bar dataKey="pctHeld" fill="#4f46e5" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}