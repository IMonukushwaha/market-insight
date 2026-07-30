const axios = require('axios');

// Only the most recent `lookbackDays` calendar days are fetched by default

const DEFAULT_LOOKBACK_DAYS = 14;
const MAX_CANDLES_RETURNED  = 10;

async function getStockHistory(ticker, startDate, endDate) {
  console.log(`Retrieving Stock History of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  // Default: last 14 calendar days instead of 3 months
  const now   = new Date();
  const start = startDate ? new Date(startDate) : new Date(now.getTime() - DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
  const end   = endDate   ? new Date(endDate)   : now;

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

    const chartResult = response.data.chart.result?.[0];

    if (!chartResult) {
      return `No historical data available for ${ticker}`;
    }

    const timestamps = chartResult.timestamp ?? [];
    const quotes      = chartResult.indicators.quote[0];

    let historicalData = timestamps.map((ts, i) => ({
      date  : new Date(ts * 1000).toISOString().split('T')[0],
      open  : quotes.open[i]   ? parseFloat(quotes.open[i].toFixed(2))   : null,
      high  : quotes.high[i]   ? parseFloat(quotes.high[i].toFixed(2))   : null,
      low   : quotes.low[i]    ? parseFloat(quotes.low[i].toFixed(2))    : null,
      close : quotes.close[i]  ? parseFloat(quotes.close[i].toFixed(2))  : null,
      volume: quotes.volume[i] ?? null,
    }));

    // Cap to the most recent N candles regardless of range requested;
    if (historicalData.length > MAX_CANDLES_RETURNED) {
      historicalData = historicalData.slice(-MAX_CANDLES_RETURNED);
    }

    const first = historicalData[0];
    const last  = historicalData[historicalData.length - 1];
    const closes = historicalData.map(d => d.close).filter(c => c !== null);
    const highs  = historicalData.map(d => d.high).filter(h => h !== null);
    const lows   = historicalData.map(d => d.low).filter(l => l !== null);

    return {
      ticker,
      from  : first?.date ?? start.toISOString().split('T')[0],
      to    : last?.date  ?? end.toISOString().split('T')[0],
      count : historicalData.length,
      periodHigh: highs.length ? Math.max(...highs) : null,
      periodLow : lows.length  ? Math.min(...lows)  : null,
      percentChangeOverPeriod: (first?.close && last?.close)
        ? `${(((last.close - first.close) / first.close) * 100).toFixed(2)}%`
        : null,
      data  : historicalData,
    };

  } catch (err) {
    console.error(`Failed to retrieve stock History of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve stock History. Please try again later.';
  }
}

module.exports = { getStockHistory };