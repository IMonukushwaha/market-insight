import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "../../Style/Mainpagecss/stockchart.css";

// Yahoo's recommendationTrend periods come back as "0m", "-1m", "-2m", "-3m"
// meaning "this month", "1 month ago", etc. Translate to plain English.
function formatPeriodLabel(period) {
  if (typeof period !== "string") return period;

  if (period === "0m") return "This month";

  const match = period.match(/^-(\d+)m$/);
  if (match) {
    const n = parseInt(match[1], 10);
    return `${n} month${n > 1 ? "s" : ""} ago`;
  }

  return period; // fallback — show whatever Yahoo sent if format changes
}

export default function AnalystRecommendationChart({ chartData }) {
  const summary = chartData?.analystRecommendationsSummary;
  if (!Array.isArray(summary) || summary.length === 0) return null;

  const rows = summary
    .filter(
      (p) =>
        p &&
        typeof p === "object" &&
        [p.strongBuy, p.buy, p.hold, p.sell, p.strongSell].some((v) => typeof v === "number")
    )
    .map((p) => ({ ...p, periodLabel: formatPeriodLabel(p.period) }));

  if (rows.length === 0) return null;

  return (
    <div className="stock-chart-card">
      <div className="stock-chart-header">
        <span className="stock-chart-name">Analyst Recommendations</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={rows} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="periodLabel" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} width={40} />
          <Tooltip />
          <Bar dataKey="strongBuy" stackId="a" name="Strong Buy" fill="#16a34a" />
          <Bar dataKey="buy" stackId="a" name="Buy" fill="#4ade80" />
          <Bar dataKey="hold" stackId="a" name="Hold" fill="#facc15" />
          <Bar dataKey="sell" stackId="a" name="Sell" fill="#fb923c" />
          <Bar dataKey="strongSell" stackId="a" name="Strong Sell" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-axis-caption">Period</div>
      <div className="chart-legend-row">
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: "#16a34a" }} />
          Strong Buy
        </span>
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: "#4ade80" }} />
          Buy
        </span>
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: "#facc15" }} />
          Hold
        </span>
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: "#fb923c" }} />
          Sell
        </span>
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: "#ef4444" }} />
          Strong Sell
        </span>
      </div>
    </div>
  );
}