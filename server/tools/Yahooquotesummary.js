const axios = require('axios');
const { getYahooCrumb } = require('./yahooAuth');

// All the modules previously fetched via 9 SEPARATE quoteSummary requests,
// now combined into ONE request. Yahoo's endpoint supports comma-separated
// modules.
const MODULES = [
  'financialData',
  'incomeStatementHistory',
  'incomeStatementHistoryQuarterly',
  'cashflowStatementHistory',
  'cashflowStatementHistoryQuarterly',
  'assetProfile',
  'summaryProfile',
  'summaryDetail',
  'defaultKeyStatistics',
  'price',
  'institutionOwnership',
  'majorHoldersBreakdown',
  'fundOwnership',
  'insiderTransactions',
  'upgradeDowngradeHistory',
  'recommendationTrend',
].join(',');

const MAX_ITEMS = 10;
const MAX_SUMMARY_CHARS = 300;

function cleanEntry(entry) {
  const cleaned = {};
  for (const [key, value] of Object.entries(entry)) {
    if (key === 'endDate') {
      cleaned.endDate = value?.fmt;
    } else if (value && typeof value === 'object' && 'raw' in value) {
      cleaned[key] = value.raw;
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

// Individual section parsers, each mirroring the original tool file's shape
function parseBalanceSheet(financialData) {
  if (!financialData) return 'No balance sheet available';
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
}

function parseIncomeStatement(ticker, annualHist, quarterlyHist) {
  const annual    = annualHist?.incomeStatementHistory ?? [];
  const quarterly = quarterlyHist?.incomeStatementHistory ?? [];
  return {
    ticker,
    mostRecentAnnual:    annual[0]    ? cleanEntry(annual[0])    : null,
    mostRecentQuarterly: quarterly[0] ? cleanEntry(quarterly[0]) : null,
  };
}

function parseCashFlow(ticker, annualHist, quarterlyHist) {
  const annual    = annualHist?.cashflowStatements ?? [];
  const quarterly = quarterlyHist?.cashflowStatements ?? [];
  return {
    ticker,
    mostRecentAnnual:    annual[0]    ? cleanEntry(annual[0])    : null,
    mostRecentQuarterly: quarterly[0] ? cleanEntry(quarterly[0]) : null,
  };
}

function parseCompanyInfo(assetProfile = {}, summaryDetail = {}, defaultKeyStatistics = {}, price = {}) {
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
}

function parseInstitutionalHolders(institutionOwnership) {
  const holders = institutionOwnership?.ownershipList;
  if (!holders || holders.length === 0) return 'No institutional holders available';

  const top = holders.slice(0, MAX_ITEMS);
  return {
    totalHoldersOnRecord: holders.length,
    topHolders: top.map((holder) => ({
      organization: holder.organization,
      reportDate:   holder.reportDate?.fmt,
      position:     holder.position?.raw,
      value:        holder.value?.raw,
      pctHeld:      holder.pctHeld?.raw,
      pctChange:    holder.pctChange?.raw,
    })),
  };
}

function parseMajorShareholders(breakdown) {
  if (!breakdown) return 'No major share holders available';
  return {
    insidersPercentHeld:          breakdown.insidersPercentHeld?.raw,
    institutionsPercentHeld:      breakdown.institutionsPercentHeld?.raw,
    institutionsFloatPercentHeld: breakdown.institutionsFloatPercentHeld?.raw,
    institutionsCount:            breakdown.institutionsCount?.raw,
  };
}

function parseMutualFundHolders(fundOwnership) {
  const holders = fundOwnership?.ownershipList;
  if (!holders || holders.length === 0) return 'No mutual fund holders available';

  const top = holders.slice(0, MAX_ITEMS);
  return {
    totalHoldersOnRecord: holders.length,
    topHolders: top.map((holder) => ({
      organization: holder.organization,
      reportDate:   holder.reportDate?.fmt,
      position:     holder.position?.raw,
      value:        holder.value?.raw,
      pctHeld:      holder.pctHeld?.raw,
      pctChange:    holder.pctChange?.raw,
    })),
  };
}

function parseInsiderTransactions(insiderTransactions) {
  const transactions = insiderTransactions?.transactions;
  if (!transactions || transactions.length === 0) return 'No insider transactions available';

  const recent = transactions.slice(0, MAX_ITEMS);
  return {
    totalTransactionsOnRecord: transactions.length,
    mostRecent: recent.map((txn) => ({
      filerName:       txn.filerName,
      filerRelation:   txn.filerRelation,
      transactionText: txn.transactionText,
      shares:          txn.shares?.raw,
      value:           txn.value?.raw,
      startDate:       txn.startDate?.fmt,
      ownership:       txn.ownership,
    })),
  };
}

function parseAnalystRecommendations(upgradeDowngradeHistory) {
  const history = upgradeDowngradeHistory?.history;
  if (!history || history.length === 0) return 'No analyst recommendations available';

  const recent = history.slice(0, MAX_ITEMS);
  return {
    totalActionsOnRecord: history.length,
    mostRecent: recent.map((item) => ({
      firm:           item.firm,
      toGrade:        item.toGrade,
      fromGrade:      item.fromGrade,
      action:         item.action,
      epochGradeDate: new Date(item.epochGradeDate * 1000).toISOString().split('T')[0],
    })),
  };
}

function parseAnalystRecommendationsSummary(recommendationTrend) {
  const trend = recommendationTrend?.trend;
  if (!trend) return 'No analyst recommendations summary available';

  return trend.map((period) => ({
    period:     period.period,
    strongBuy:  period.strongBuy,
    buy:        period.buy,
    hold:       period.hold,
    sell:       period.sell,
    strongSell: period.strongSell,
  }));
}

//Single entry point: one HTTP request, all sections parsed.
async function getQuoteSummaryData(ticker) {
  if (!ticker || typeof ticker !== 'string') {
    throw new Error('Invalid ticker provided.');
  }

  const { crumb, cookie } = await getYahooCrumb();

  const response = await axios.get(
    `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
    {
      params: { modules: MODULES, crumb },
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
    throw new Error(`No quoteSummary data available for ${ticker}`);
  }

  return {
    balanceSheet:                   parseBalanceSheet(result.financialData),
    incomeStatement:                parseIncomeStatement(ticker, result.incomeStatementHistory, result.incomeStatementHistoryQuarterly),
    cashFlow:                       parseCashFlow(ticker, result.cashflowStatementHistory, result.cashflowStatementHistoryQuarterly),
    companyInfo:                    parseCompanyInfo(result.assetProfile, result.summaryDetail, result.defaultKeyStatistics, result.price),
    institutionalHolders:           parseInstitutionalHolders(result.institutionOwnership),
    majorShareholders:              parseMajorShareholders(result.majorHoldersBreakdown),
    mutualFundHolders:               parseMutualFundHolders(result.fundOwnership),
    insiderTransactions:            parseInsiderTransactions(result.insiderTransactions),
    analystRecommendations:         parseAnalystRecommendations(result.upgradeDowngradeHistory),
    analystRecommendationsSummary:  parseAnalystRecommendationsSummary(result.recommendationTrend),
  };
}

module.exports = { getQuoteSummaryData };