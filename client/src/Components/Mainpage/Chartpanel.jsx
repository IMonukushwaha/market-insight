import StockChart from "./StockChart";
import IncomeStatementChart from "./IncomeStatementchart";
import AnalystRecommendationChart from "./AnalystrecommendationChart";
import InstitutionalHoldersChart from "./Institutionalholderschart";
import OwnershipBreakdownChart from "./Ownershipbreakdownchart";

export default function ChartsPanel({ chartData }) {
  if (!chartData) return null;
  console.log("chartData received:", chartData);

  return (
    <div className="charts-panel">
      <StockChart chartData={chartData} />
      <IncomeStatementChart chartData={chartData} />
      <AnalystRecommendationChart chartData={chartData} />
      <InstitutionalHoldersChart chartData={chartData} />
      <OwnershipBreakdownChart chartData={chartData} />
    </div>
  );
}