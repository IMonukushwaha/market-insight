const axios = require('axios');
const { getYahooCrumb } = require('./yahooAuth');

async function getMajorShareholders(ticker) {
  console.log(`Retrieving Major Share Holders of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  try {
    const { crumb, cookie } = await getYahooCrumb();

    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
      {
        params: {
          modules: 'majorHoldersBreakdown',
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

    const breakdown = response.data.quoteSummary.result?.[0]?.majorHoldersBreakdown;

    if (!breakdown) {
      return `No major share holders available for ${ticker}`;
    }

    return {
      insidersPercentHeld:          breakdown.insidersPercentHeld?.raw,
      institutionsPercentHeld:      breakdown.institutionsPercentHeld?.raw,
      institutionsFloatPercentHeld: breakdown.institutionsFloatPercentHeld?.raw,
      institutionsCount:            breakdown.institutionsCount?.raw,
    };

  } catch (err) {
    console.error(`Failed to retrieve major share holders of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve major share holders. Please try again later.';
  }
}

module.exports = { getMajorShareholders };