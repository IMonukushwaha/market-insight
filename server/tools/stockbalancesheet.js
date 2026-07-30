const axios = require('axios');
const { getYahooCrumb } = require('./yahooAuth');

async function getBalanceSheet(ticker) {
  console.log(`Retrieving Balance Sheet of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  try {
    const { crumb, cookie } = await getYahooCrumb();

    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
      {
        params: {
          modules: 'financialData',
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

    const financialData = response.data.quoteSummary.result?.[0]?.financialData;

    if (!financialData) {
      return `No balance sheet available for ${ticker}`;
    }

    return {
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

  } catch (err) {
    console.error(`Failed to retrieve balance sheet of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve balance sheet. Please try again later.';
  }
}

module.exports = { getBalanceSheet };