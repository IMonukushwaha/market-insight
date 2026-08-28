const { yahooClient } = require('./yahooHttpClient');

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let cached = null;
let cachedAt = 0;
const CACHE_TTL_MS = 25 * 60 * 1000; // 25 minutes

const ALLOWED_COOKIE_NAMES = ['A1', 'A3', 'A1S', 'B', 'T'];

function filterCookies(setCookieHeaders) {
  const kept = [];
  for (const raw of setCookieHeaders) {
    const pair = raw.split(';')[0];
    const name = pair.split('=')[0];
    if (ALLOWED_COOKIE_NAMES.includes(name)) {
      kept.push(pair);
    }
  }
  return kept.join('; ');
}

async function getYahooCrumb() {
  const now = Date.now();
  if (cached && now - cachedAt < CACHE_TTL_MS) {
    return cached;
  }

  const sessionResponse = await yahooClient.get('https://finance.yahoo.com', {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
  });

  const sessionCookies = sessionResponse.headers['set-cookie'];
  if (!sessionCookies || sessionCookies.length === 0) {
    // Temporary diagnostics — shows what Yahoo actually sent back through
    // the proxy, so we can tell a real block/captcha apart from something else.
    console.log('DEBUG — Yahoo session response status:', sessionResponse.status);
    console.log('DEBUG — Yahoo session response headers:', JSON.stringify(sessionResponse.headers, null, 2));
    console.log('DEBUG — Yahoo session response body (first 500 chars):', String(sessionResponse.data).slice(0, 500));
    throw new Error('Failed to establish Yahoo Finance session — no cookies returned.');
  }

  const cookieHeader = filterCookies(sessionCookies);
  if (!cookieHeader) {
    throw new Error('Failed to establish Yahoo Finance session — no usable auth cookies found.');
  }

  const crumbResponse = await yahooClient.get('https://query1.finance.yahoo.com/v1/test/getcrumb', {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cookie': cookieHeader,
    },
  });

  const crumb = crumbResponse.data;
  if (!crumb || typeof crumb !== 'string' || crumb.includes('<html')) {
    throw new Error('Failed to retrieve a valid Yahoo crumb.');
  }

  cached = { crumb, cookie: cookieHeader };
  cachedAt = now;
  return cached;
}

module.exports = { getYahooCrumb };