const axios = require('axios');

let cached = null; // { crumb, cookie, expiresAt }

async function getYahooCrumb() {
  if (cached && cached.expiresAt > Date.now()) {
    return { crumb: cached.crumb, cookie: cached.cookie };
  }

  const warmup = await axios.get('https://fc.yahoo.com', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  });
  const warmupCookie = warmup.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

  // Step 2: use that cookie to request the crumb
  const response = await axios.get('https://query1.finance.yahoo.com/v1/test/getcrumb', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Cookie': warmupCookie,
    },
  });

  const crumb = response.data;
  const crumbCookie = response.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || warmupCookie;

  cached = {
    crumb,
    cookie: crumbCookie,
    expiresAt: Date.now() + 30 * 60 * 1000, // reuse for 30 min
  };

  return { crumb, cookie: crumbCookie };
}

module.exports = { getYahooCrumb };