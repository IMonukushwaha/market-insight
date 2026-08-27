const { getStockPrice } = require('../tools/stockprice.js');
const { getStockHistory } = require('../tools/stockhistory.js');
const { getStockNews } = require('../tools/stocknews.js');
const { getQuoteSummaryData } = require('../tools/Yahooquotesummary.js');

module.exports.companydata = async (ticker) => {
  console.log(`\n Fetching all data for ${ticker}...`);

  const [price, history, news, quoteSummary] = await Promise.allSettled([
    getStockPrice(ticker),
    getStockHistory(ticker),
    getStockNews(ticker),
    getQuoteSummaryData(ticker),
  ]);

  const qs = quoteSummary.status === 'fulfilled' ? quoteSummary.value : null;
  const qsError = quoteSummary.status === 'rejected' ? quoteSummary.reason?.message : null;

  if (qsError) {
    console.error(`Failed to retrieve quoteSummary data for ${ticker}:`, qsError);
  }

  return {
    price:    price.status   === 'fulfilled' ? price.value   : null,
    history:  history.status === 'fulfilled' ? history.value : null,
    news:     news.status    === 'fulfilled' ? news.value    : null,

    balanceSheet:                   qs?.balanceSheet                  ?? (qsError ? 'Error: Failed to retrieve balance sheet. Please try again later.' : null),
    incomeStatement:                qs?.incomeStatement               ?? (qsError ? 'Error: Failed to retrieve income statement. Please try again later.' : null),
    cashFlow:                       qs?.cashFlow                      ?? (qsError ? 'Error: Failed to retrieve cash flow. Please try again later.' : null),
    companyInfo:                    qs?.companyInfo                   ?? (qsError ? 'Error: Failed to retrieve company info. Please try again later.' : null),
    institutionalHolders:           qs?.institutionalHolders          ?? (qsError ? 'Error: Failed to retrieve institutional holders. Please try again later.' : null),
    majorShareholders:              qs?.majorShareholders             ?? (qsError ? 'Error: Failed to retrieve major share holders. Please try again later.' : null),
    mutualFundHolders:              qs?.mutualFundHolders             ?? (qsError ? 'Error: Failed to retrieve mutual fund holders. Please try again later.' : null),
    insiderTransactions:            qs?.insiderTransactions           ?? (qsError ? 'Error: Failed to retrieve insider transactions. Please try again later.' : null),
    analystRecommendations:         qs?.analystRecommendations        ?? (qsError ? 'Error: Failed to retrieve analyst recommendations. Please try again later.' : null),
    analystRecommendationsSummary:  qs?.analystRecommendationsSummary ?? (qsError ? 'Error: Failed to retrieve analyst recommendations summary. Please try again later.' : null),
  };
}