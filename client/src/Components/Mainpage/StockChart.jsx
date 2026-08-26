import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "../../Style/Mainpagecss/stockchart.css";

export default function StockChart({ chartData }) {
  const priceHistory = chartData?.history?.data;
  const currentPrice = typeof chartData?.price === "number" ? chartData.price : null;

  if (!priceHistory || priceHistory.length === 0) return null;

  return (
    <div className="stock-chart-card">
      <div className="stock-chart-header">
        <span className="stock-chart-name">{chartData?.ticker}</span>
        {currentPrice !== null && (
          <span className="stock-chart-price">${currentPrice.toFixed(2)}</span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={priceHistory} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            label={{ value: "Date", position: "insideBottom", offset: -10, fontSize: 12 }}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 11 }}
            label={{ value: "Price (USD)", angle: -90, position: "insideLeft", fontSize: 12 }}
          />
          <Tooltip formatter={(v) => `$${v}`} />
          <Line type="monotone" dataKey="close" stroke="#4f46e5" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}