const { getStockPrice }   = require('../tools/stockprice.js');
const { getStockHistory } = require('../tools/stockhistory.js');
const { getStockNews }    = require('../tools/stocknews.js');
const { getBalanceSheet } = require('../tools/stockbalancesheet.js');

// Fetch ALL financial data for the ticker in parallel ──────────────
module.exports.companydata = async (ticker) => {
  console.log(`\n Fetching all data for ${ticker}...`);

  const [price, history, news, balanceSheet] = await Promise.allSettled([
    getStockPrice(ticker),
    getStockHistory(ticker),
    getStockNews(ticker),
    getBalanceSheet(ticker),
  ]);

  return {
    price       : price.status === 'fulfilled'        ? price.value        : null,
    history     : history.status === 'fulfilled'      ? history.value      : null,
    news        : news.status === 'fulfilled'          ? news.value         : null,
    balanceSheet: balanceSheet.status === 'fulfilled'  ? balanceSheet.value : null,
  };
}