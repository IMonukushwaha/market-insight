const axios = require('axios');

async function getStockHistory(ticker, startDate, endDate) {
  console.log(`Retrieving Stock History of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  // ── Default: last 3 months if no dates provided ──────────────────────────
  const now   = new Date();
  const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  const end   = endDate   ? new Date(endDate)   : now;

  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Error: Invalid date format. Use YYYY-MM-DD.';
  }

  try {
    const response = await axios.get(
      `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}`,
      {
        params: {
          interval: '1d',
          period1 : Math.floor(start.getTime() / 1000),
          period2 : Math.floor(end.getTime()   / 1000),
        },
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 10000,
      }
    );

    const chartResult = response.data.chart.result[0];

    if (!chartResult) {
      return `No historical data available for ${ticker}`;
    }

    const timestamps = chartResult.timestamp;
    const quotes     = chartResult.indicators.quote[0];

    const historicalData = timestamps.map((ts, i) => ({
      date  : new Date(ts * 1000).toISOString().split('T')[0],
      open  : quotes.open[i]   ? parseFloat(quotes.open[i].toFixed(2))   : null,
      high  : quotes.high[i]   ? parseFloat(quotes.high[i].toFixed(2))   : null,
      low   : quotes.low[i]    ? parseFloat(quotes.low[i].toFixed(2))    : null,
      close : quotes.close[i]  ? parseFloat(quotes.close[i].toFixed(2))  : null,
      volume: quotes.volume[i] ?? null,
    }));

    return {
      ticker,
      from  : start.toISOString().split('T')[0],
      to    : end.toISOString().split('T')[0],
      count : historicalData.length,
      data  : historicalData,
    };

  } catch (err) {
    console.error(`Failed to retrieve stock History of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve stock History. Please try again later.';
  }
}

module.exports = { getStockHistory };