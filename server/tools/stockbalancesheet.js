const axios = require('axios');

// Step 1 — get crumb and cookie from Yahoo first
async function getYahooCrumb() {
  const response = await axios.get(
    'https://query1.finance.yahoo.com/v1/test/getcrumb',
    {
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      withCredentials: true,
    }
  );
  return {
    crumb:  response.data,
    cookie: response.headers['set-cookie'],
  };
}

async function getBalanceSheet(ticker) {
  console.log(`Retrieving Balance Sheet of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

//   const startTime = Date.now();
  const { crumb, cookie } = await getYahooCrumb();

  try {
    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
      {
        params: {
          modules: 'financialData',  // same as stock.balance_sheet
          crumb
        },
        headers: {
          'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept':          'application/json',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cookie':          cookie,
        },
      }
    );

    const financialData = response.data.quoteSummary.result[0].financialData;

    if (!financialData) {
      return `No balance sheet available for ${ticker}`;
    }

    const balanceSheet = {
      currentPrice:            financialData.currentPrice?.fmt,
      targetHighPrice:         financialData.targetHighPrice?.fmt,
      targetLowPrice:          financialData.targetLowPrice?.fmt,
      targetMeanPrice:         financialData.targetMeanPrice?.fmt,
      recommendationKey:       financialData.recommendationKey,
      numberOfAnalystOpinions: financialData.numberOfAnalystOpinions?.raw,
      totalCash:               financialData.totalCash?.fmt,
      totalCashPerShare:       financialData.totalCashPerShare?.fmt,
      totalDebt:               financialData.totalDebt?.fmt,
      totalRevenue:            financialData.totalRevenue?.fmt,
      grossProfits:            financialData.grossProfits?.fmt,
      ebitda:                  financialData.ebitda?.fmt,
      freeCashflow:            financialData.freeCashflow?.fmt,
      operatingCashflow:       financialData.operatingCashflow?.fmt,
      quickRatio:              financialData.quickRatio?.fmt,
      currentRatio:            financialData.currentRatio?.fmt,
      debtToEquity:            financialData.debtToEquity?.fmt,
      returnOnAssets:          financialData.returnOnAssets?.fmt,
      returnOnEquity:          financialData.returnOnEquity?.fmt,
      revenuePerShare:         financialData.revenuePerShare?.fmt,
      earningsGrowth:          financialData.earningsGrowth?.fmt,
      revenueGrowth:           financialData.revenueGrowth?.fmt,
      grossMargins:            financialData.grossMargins?.fmt,
      ebitdaMargins:           financialData.ebitdaMargins?.fmt,
      operatingMargins:        financialData.operatingMargins?.fmt,
      profitMargins:           financialData.profitMargins?.fmt,
      currency:                financialData.financialCurrency,
    };

    return balanceSheet;

  } catch (err) {
    console.error(`Failed to retrieve balance sheet of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve balance sheet. Please try again later.';
  }
}

module.exports = { getBalanceSheet };