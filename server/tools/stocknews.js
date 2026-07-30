const axios = require('axios');
const NEWS_COUNT = 5;

async function getStockNews(ticker) {
  console.log(`Retrieving News of ${ticker}...`);

  if (!ticker || typeof ticker !== 'string') {
    return 'Error: Invalid ticker provided. Please provide a valid ticker symbol.';
  }

  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v1/finance/search`,
      {
        params: {
          q:           ticker,
          newsCount:   NEWS_COUNT,
          quotesCount: 0,
        },
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        timeout: 10000,
      }
    );

    const news = response.data.news;

    if (!news || news.length === 0) {
      return `No news available for ${ticker}`;
    }

    const cleanNews = news.map(article => ({
      title:       article.title,
      publisher:   article.publisher,
      link:        article.link,
      publishedAt: new Date(article.providerPublishTime * 1000).toISOString(),
    }));

    return cleanNews;

  } catch (err) {
    console.error(`Failed to retrieve news of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve news. Please try again later.';
  }
}

module.exports = { getStockNews };