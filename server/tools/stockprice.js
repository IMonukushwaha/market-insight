const axios = require('axios');

async function getStockPrice(ticker){
    console.log(`Retrieving Stock Price of ${ticker}...`);

    // Validate ticker
    // return error if ticker if either empty or not  a string
    if (!ticker || typeof ticker !== 'string') {
        return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
    }

    try {
    const response = await axios.get(
      `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}`,
      {
        params: {
          interval: '1d',
          range:    '1d',
        },
        headers: {
          // Required — Yahoo blocks requests without a user agent
          'User-Agent': 'Mozilla/5.0',
        },
      }
    )

    const result = response.data.chart.result[0];
    const stockPrice = result.meta.regularMarketPrice;
    return stockPrice;

    }catch (err) {
    console.error(`Failed to retrieve stock price of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve stock price. Please try again later.';
  }
}

module.exports = {getStockPrice};