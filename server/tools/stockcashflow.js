const axios = require('axios');
const { getYahooCrumb } = require('./yahooAuth');

async function getCashFlow(ticker) {
  console.log(`Retrieving Cash Flow of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  try {
    const { crumb, cookie } = await getYahooCrumb();

    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
      {
        params: {
          modules: 'cashflowStatementHistory,cashflowStatementHistoryQuarterly',
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

    const result = response.data.quoteSummary.result?.[0];

    if (!result) {
      return `No cash flow available for ${ticker}`;
    }
    
    const annual    = result.cashflowStatementHistory?.cashflowStatements ?? [];
    const quarterly = result.cashflowStatementHistoryQuarterly?.cashflowStatements ?? [];

    return {
      ticker,
      mostRecentAnnual:    annual[0]    ? cleanEntry(annual[0])    : null,
      mostRecentQuarterly: quarterly[0] ? cleanEntry(quarterly[0]) : null,
    };

  } catch (err) {
    console.error(`Failed to retrieve cash flow of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve cash flow. Please try again later.';
  }
}

function cleanEntry(entry) {
  const cleaned = {};
  for (const [key, value] of Object.entries(entry)) {
    if (key === 'endDate') {
      cleaned.endDate = value?.fmt;
    } else if (value && typeof value === 'object' && 'raw' in value) {
      cleaned[key] = value.raw;
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

module.exports = { getCashFlow };