const axios = require('axios');
const { getYahooCrumb } = require('./yahooAuth');

async function getAnalystRecommendationsSummary(ticker) {
  console.log(`Retrieving Analyst Recommendations Summary of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  try {
    const { crumb, cookie } = await getYahooCrumb();

    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
      {
        params: {
          modules: 'recommendationTrend',
          crumb,
        },
        headers: {
          'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept':          'application/json',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cookie':          cookie,
        },
      }
    );

    const trend = response.data.quoteSummary.result?.[0]?.recommendationTrend?.trend;

    if (!trend) {
      return `No analyst recommendations summary available for ${ticker}`;
    }

    return trend.map(period => ({
      period:     period.period,
      strongBuy:  period.strongBuy,
      buy:        period.buy,
      hold:       period.hold,
      sell:       period.sell,
      strongSell: period.strongSell,
    }));

  } catch (err) {
    console.error(`Failed to retrieve analyst recommendations summary of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve analyst recommendations summary. Please try again later.';
  }
}

module.exports = { getAnalystRecommendationsSummary };