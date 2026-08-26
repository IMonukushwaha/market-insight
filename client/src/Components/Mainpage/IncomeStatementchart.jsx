import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { formatCompactCurrency } from "./Formatcompactnumber";
import "../../Style/Mainpagecss/stockchart.css";

function buildRow(label, entry) {
  if (!entry || typeof entry !== "object") return null;
  const revenue = typeof entry.totalRevenue === "number" ? entry.totalRevenue : null;
  const netIncome = typeof entry.netIncome === "number" ? entry.netIncome : null;
  if (revenue === null && netIncome === null) return null;
  return { label, revenue, netIncome };
}

export default function IncomeStatementChart({ chartData }) {
  const income = chartData?.incomeStatement;
  if (!income || typeof income !== "object") return null;

  const rows = [
    buildRow(income.mostRecentAnnual?.endDate ? `FY ${income.mostRecentAnnual.endDate}` : "Annual", income.mostRecentAnnual),
    buildRow(income.mostRecentQuarterly?.endDate ? `Q ${income.mostRecentQuarterly.endDate}` : "Quarterly", income.mostRecentQuarterly),
  ].filter(Boolean);

  if (rows.length === 0) return null;

  return (
    <div className="stock-chart-card">
      <div className="stock-chart-header">
        <span className="stock-chart-name">Revenue vs Net Income</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={rows} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={formatCompactCurrency}
            width={60}
          />
          <Tooltip formatter={(v) => formatCompactCurrency(v)} />
          <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          <Bar dataKey="netIncome" name="Net Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Axis captions and legend rendered as plain HTML below the chart —
          avoids recharts' insideBottom label overlapping the tick labels */}
      <div className="chart-axis-caption">Reporting Period</div>
      <div className="chart-legend-row">
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: "#4f46e5" }} />
          Revenue
        </span>
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: "#22c55e" }} />
          Net Income
        </span>
      </div>
    </div>
  );
}