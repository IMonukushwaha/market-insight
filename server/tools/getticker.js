const axios = require('axios');

async function getTicker(companyName, retries = 2) {
  console.log(`Retrieving Ticker of ${companyName}...`);

  if (!companyName || typeof companyName !== 'string') {
    return 'Error: Invalid company name provided. Please provide a valid company name.';
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(
        'https://query2.finance.yahoo.com/v1/finance/search',
        {
          params: { q: companyName, quotesCount: 1, newsCount: 0 },
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 15000,
        }
      );

      const quotes = response.data.quotes;
      if (!quotes || quotes.length === 0) {
        return `Error: Failed to retrieve ticker for ${companyName}.`;
      }
      return quotes[0].symbol;

    } catch (err) {
      console.error(`Attempt ${attempt + 1} failed for ${companyName}:`, err.message);
      if (attempt === retries) {
        return 'Error: Failed to retrieve ticker. Please try again later.';
      }
      // brief backoff before retrying
      await new Promise(res => setTimeout(res, 500 * (attempt + 1)));
    }
  }
}

module.exports = {getTicker};