const axios = require('axios');
const { getYahooCrumb } = require('./yahooAuth');

// Cap how much of the free-text business description is kept -- the full
// field can run 1500+ characters and adds little value for a quick answer.
const MAX_SUMMARY_CHARS = 300;

async function getCompanyInfo(ticker) {
  console.log(`Retrieving Company Info of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  try {
    const { crumb, cookie } = await getYahooCrumb();

    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
      {
        params: {
          modules: 'assetProfile,summaryProfile,summaryDetail,defaultKeyStatistics,price',
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
      return `No company info available for ${ticker}`;
    }

    const { assetProfile = {}, summaryDetail = {}, defaultKeyStatistics = {}, price = {} } = result;

    const summary = assetProfile.longBusinessSummary;
    const truncatedSummary = summary
      ? summary.slice(0, MAX_SUMMARY_CHARS) + (summary.length > MAX_SUMMARY_CHARS ? '...' : '')
      : undefined;

    return {
      name:                price.longName,
      sector:              assetProfile.sector,
      industry:            assetProfile.industry,
      website:             assetProfile.website,
      country:             assetProfile.country,
      fullTimeEmployees:   assetProfile.fullTimeEmployees,
      businessSummary:     truncatedSummary,
      currency:            price.currency,
      marketCap:           summaryDetail.marketCap?.raw,
      previousClose:       summaryDetail.previousClose?.raw,
      open:                summaryDetail.open?.raw,
      dayLow:              summaryDetail.dayLow?.raw,
      dayHigh:             summaryDetail.dayHigh?.raw,
      fiftyTwoWeekLow:     summaryDetail.fiftyTwoWeekLow?.raw,
      fiftyTwoWeekHigh:    summaryDetail.fiftyTwoWeekHigh?.raw,
      volume:              summaryDetail.volume?.raw,
      averageVolume:       summaryDetail.averageVolume?.raw,
      dividendYield:       summaryDetail.dividendYield?.raw,
      trailingPE:          summaryDetail.trailingPE?.raw,
      forwardPE:           summaryDetail.forwardPE?.raw,
      trailingEps:         defaultKeyStatistics.trailingEps?.raw,
      forwardEps:          defaultKeyStatistics.forwardEps?.raw,
      beta:                defaultKeyStatistics.beta?.raw,
      sharesOutstanding:   defaultKeyStatistics.sharesOutstanding?.raw,
      bookValue:           defaultKeyStatistics.bookValue?.raw,
      priceToBook:         defaultKeyStatistics.priceToBook?.raw,
    };

  } catch (err) {
    console.error(`Failed to retrieve company info of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve company info. Please try again later.';
  }
}

module.exports = { getCompanyInfo };