const { getStockPrice }  = require('../tools/stockprice.js');
const { getStockHistory } = require('../tools/stockhistory.js');
const { getStockNews } = require('../tools/stocknews.js');
const { getBalanceSheet } = require('../tools/stockbalancesheet.js');
const { getIncomeStatement } = require('../tools/stockincomestatement.js');
const { getCashFlow } = require('../tools/stockcashflow.js');
const { getCompanyInfo } = require('../tools/companyinfo.js');
const { getInstitutionalHolders } = require('../tools/stockinstituteholders.js');
const { getMajorShareholders } = require('../tools/stockmajorshareholders.js');
const { getMutualFundHolders } = require('../tools/stockmutualfundholders.js');
const { getInsiderTransactions } = require('../tools/stockinsidetransactions.js');
const { getAnalystRecommendations } = require('../tools/stockanalystrecommendation.js');
const { getAnalystRecommendationsSummary } = require('../tools/stockanalystrecommendationsummary.js');

// Fetch ALL financial data for the ticker in parallel ──────────────
module.exports.companydata = async (ticker) => {
  console.log(`\n Fetching all data for ${ticker}...`);

  const [
    price,
    history,
    news,
    balanceSheet,
    incomeStatement,
    cashFlow,
    companyInfo,
    institutionalHolders,
    majorShareholders,
    mutualFundHolders,
    insiderTransactions,
    analystRecommendations,
    analystRecommendationsSummary,
  ] = await Promise.allSettled([
    getStockPrice(ticker),
    getStockHistory(ticker),
    getStockNews(ticker),
    getBalanceSheet(ticker),
    getIncomeStatement(ticker),
    getCashFlow(ticker),
    getCompanyInfo(ticker),
    getInstitutionalHolders(ticker),
    getMajorShareholders(ticker),
    getMutualFundHolders(ticker),
    getInsiderTransactions(ticker),
    getAnalystRecommendations(ticker),
    getAnalystRecommendationsSummary(ticker),
  ]);

  return {
    price:                          price.status                          === 'fulfilled' ? price.value                          : null,
    history:                        history.status                        === 'fulfilled' ? history.value                        : null,
    news:                           news.status                           === 'fulfilled' ? news.value                           : null,
    balanceSheet:                   balanceSheet.status                   === 'fulfilled' ? balanceSheet.value                   : null,
    incomeStatement:                incomeStatement.status                === 'fulfilled' ? incomeStatement.value                : null,
    cashFlow:                       cashFlow.status                       === 'fulfilled' ? cashFlow.value                       : null,
    companyInfo:                    companyInfo.status                    === 'fulfilled' ? companyInfo.value                    : null,
    institutionalHolders:           institutionalHolders.status           === 'fulfilled' ? institutionalHolders.value           : null,
    majorShareholders:              majorShareholders.status              === 'fulfilled' ? majorShareholders.value              : null,
    mutualFundHolders:              mutualFundHolders.status              === 'fulfilled' ? mutualFundHolders.value              : null,
    insiderTransactions:            insiderTransactions.status            === 'fulfilled' ? insiderTransactions.value            : null,
    analystRecommendations:         analystRecommendations.status         === 'fulfilled' ? analystRecommendations.value         : null,
    analystRecommendationsSummary:  analystRecommendationsSummary.status  === 'fulfilled' ? analystRecommendationsSummary.value  : null,
  };
}