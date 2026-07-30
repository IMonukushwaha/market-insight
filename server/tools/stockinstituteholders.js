const axios = require('axios');
const { getYahooCrumb } = require('./yahooAuth');

// No request-side limit exists for this module -- slice immediately after
const MAX_HOLDERS = 10;

async function getInstitutionalHolders(ticker) {
  console.log(`Retrieving Institutional Holders of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  try {
    const { crumb, cookie } = await getYahooCrumb();

    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
      {
        params: {
          modules: 'institutionOwnership',
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

    const ownership = response.data.quoteSummary.result?.[0]?.institutionOwnership;
    const holders    = ownership?.ownershipList;

    if (!holders || holders.length === 0) {
      return `No institutional holders available for ${ticker}`;
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
    console.error(`Failed to retrieve institutional holders of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve institutional holders. Please try again later.';
  }
}

module.exports = { getInstitutionalHolders };