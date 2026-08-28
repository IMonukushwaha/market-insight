const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

// Routes Yahoo Finance requests through a proxy when YAHOO_PROXY_URL is set
// Locally, where your IP usually isn't blocked, this env var can be left
// unset and requests go out directly — no proxy needed for local dev.

const proxyUrl = process.env.YAHOO_PROXY_URL;

const axiosOptions = {};
if (proxyUrl) {
  const agent = new HttpsProxyAgent(proxyUrl);
  axiosOptions.httpsAgent = agent;
  axiosOptions.httpAgent = agent;
  axiosOptions.proxy = false;
  console.log('Yahoo requests routed through proxy.');
} else {
  console.log('YAHOO_PROXY_URL not set — Yahoo requests going out directly.');
}

const yahooClient = axios.create(axiosOptions);

module.exports = { yahooClient };