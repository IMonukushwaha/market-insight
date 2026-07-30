const axios = require('axios');

// Shared helper — gets a crumb + session cookie from Yahoo Finance.
async function getYahooCrumb() {
  const response = await axios.get(
    'https://query1.finance.yahoo.com/v1/test/getcrumb',
    {
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      withCredentials: true,
    }
  );

  return {
    crumb:  response.data,
    cookie: response.headers['set-cookie'],
  };
}

module.exports = { getYahooCrumb };