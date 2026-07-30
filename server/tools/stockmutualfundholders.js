const axios = require('axios');
const { getYahooCrumb } = require('./yahooAuth');

// No request-side limit exists for this module -- slice immediately after
const MAX_HOLDERS = 10;

async function getMutualFundHolders(ticker) {
  console.log(`Retrieving Mutual Fund Holders of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  try {
    const { crumb, cookie } = await getYahooCrumb();

    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
      {
        params: {
          modules: 'fundOwnership',
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

    const ownership = response.data.quoteSummary.result?.[0]?.fundOwnership;
    const holders    = ownership?.ownershipList;

    if (!holders || holders.length === 0) {
      return `No mutual fund holders available for ${ticker}`;
    }

    const top = holders.slice(0, MAX_HOLDERS);

    return {
      totalHoldersOnRecord: holders.length,
      topHolders: top.map(holder => ({
        organization: holder.organization,
        reportDate:   holder.reportDate?.fmt,
        position:     holder.position?.raw,
        value:        holder.value?.raw,
        pctHeld:      holder.pctHeld?.raw,
        pctChange:    holder.pctChange?.raw,
      })),
    };

  } catch (err) {
    console.error(`Failed to retrieve mutual fund holders of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve mutual fund holders. Please try again later.';
  }
}

module.exports = { getMutualFundHolders };