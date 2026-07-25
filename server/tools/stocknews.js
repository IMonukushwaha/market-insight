const axios = require('axios');

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
          newsCount:   10,      // number of news articles
          quotesCount: 0,       // we only want news, not quotes
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

    // Clean up — return only useful fields
    const cleanNews = news.map(article => ({
      title:       article.title,
      publisher:   article.publisher,
      link:        article.link,
      publishedAt: new Date(article.providerPublishTime * 1000).toISOString(), // unix → readable date
    }));

    // const endTime = Date.now();
    // console.log(`Retrieved ${cleanNews.length} news articles for ${ticker} in ${((endTime - startTime) / 1000).toFixed(3)} seconds`);

    return cleanNews;

  } catch (err) {
    console.error(`Failed to retrieve news of ${ticker}:`, err.message);
    return 'Error: Failed to retrieve news. Please try again later.';
  }
}

module.exports = { getStockNews };