const axios = require('axios');
const { getYahooCrumb } = require('./yahooAuth');

// No request-side limit exists for this module, so we slice right after
const MAX_TRANSACTIONS = 10;

async function getInsiderTransactions(ticker) {
  console.log(`Retrieving Insider Transactions of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  try {
    const { crumb, cookie } = await getYahooCrumb();

    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
      {
        params: {
          modules: 'insiderTransactions',
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

    const transactions = response.data.quoteSummary.result?.[0]?.insiderTransactions?.transactions;

    if (!transactions || transactions.length === 0) {
      return `No insider transactions available for ${ticker}`;
    }

    const recent = transactions.slice(0, MAX_TRANSACTIONS);

    return {
      totalTransactionsOnRecord: transactions.length,
      mostRecent: recent.map(txn => ({
        filerName:       txn.filerName,
        filerRelation:   txn.filerRelation,
        transactionText: txn.transactionText,
        shares:          txn.shares?.raw,
        value:           txn.value?.raw,
        startDate:       txn.startDate?.fmt,
        ownership:       txn.ownership,
      })),
    };

  } catch (err) {
    console.error(`Failed to retrieve insider transactions of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve insider transactions. Please try again later.';
  }
}

module.exports = { getInsiderTransactions };