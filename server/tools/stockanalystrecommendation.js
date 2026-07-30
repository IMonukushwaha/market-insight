const axios = require('axios');
const { getYahooCrumb } = require('./yahooAuth');

// Yahoo returns the ENTIRE upgrade/downgrade history for this module (in
// practice this can be 900+ entries going back years) -- there's no
// request-side param to limit it. So we slice immediately after the
// response arrives, before returning anything downstream.
const MAX_RECOMMENDATIONS = 10;

async function getAnalystRecommendations(ticker) {
  console.log(`Retrieving Analyst Recommendations of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  try {
    const { crumb, cookie } = await getYahooCrumb();

    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
      {
        params: {
          modules: 'upgradeDowngradeHistory',
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

    const history = response.data.quoteSummary.result?.[0]?.upgradeDowngradeHistory?.history;

    if (!history || history.length === 0) {
      return `No analyst recommendations available for ${ticker}`;
    }

    // Yahoo returns these newest-first already; keep only the most recent N.
    const recent = history.slice(0, MAX_RECOMMENDATIONS);

    return {
      totalActionsOnRecord: history.length,
      mostRecent: recent.map(item => ({
        firm:           item.firm,
        toGrade:        item.toGrade,
        fromGrade:      item.fromGrade,
        action:         item.action,
        epochGradeDate: new Date(item.epochGradeDate * 1000).toISOString().split('T')[0],
      })),
    };

  } catch (err) {
    console.error(`Failed to retrieve analyst recommendations of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve analyst recommendations. Please try again later.';
  }
}

module.exports = { getAnalystRecommendations };