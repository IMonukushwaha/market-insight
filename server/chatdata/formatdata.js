// Format all data into a readable context block 
module.exports.formatAllData = (ticker, data) => {
  let context = `\n[FULL MARKET RESEARCH DATA FOR ${ticker}]\n`;

  context += data.price
    ? `\n Stock Price:\n${JSON.stringify(data.price, null, 2)}`
    : `\n Stock Price: Not available`;

  context += data.history
    ? `\n\n Historical Data:\n${JSON.stringify(data.history, null, 2)}`
    : `\n\n Historical Data: Not available`;

  context += data.news
    ? `\n\n Latest News:\n${JSON.stringify(data.news, null, 2)}`
    : `\n\n Latest News: Not available`;

  context += data.balanceSheet
    ? `\n\n Balance Sheet:\n${JSON.stringify(data.balanceSheet, null, 2)}`
    : `\n\n Balance Sheet: Not available`;

  context += `\n\n[END OF DATA]`;
  return context;
}