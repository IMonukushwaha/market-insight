// parseCompanyReport.js
// Converts the markdown-style company report string (from companydata())
// into a clean structured JS object usable for both:
//   1) a small metrics slice to send to the LLM
//   2) full structured data to send to the frontend for charts

function extractValue(text, label) {
  // Matches "| Label | Value |" rows, tolerant of unicode dashes/spaces
  const re = new RegExp(`\\|\\s*${label}\\s*\\|\\s*([^|]+?)\\s*\\|`, 'i');
  const match = text.match(re);
  return match ? match[1].trim() : null;
}

function parseNumber(str) {
  if (!str) return null;
  const cleaned = str.replace(/[$,%]/g, '').replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? str : num; // fall back to raw string if not parseable
}

function parsePriceHistory(text) {
  // Grabs rows like: | 2026-08-10 | 326.60 | 332.05 | 326.15 | 330.88 | 25,003,800 |
  const rows = [];
  const rowRe = /\|\s*(\d{4}[-‑]\d{2}[-‑]\d{2})\s*\|\s*\$?([\d,.]+)\s*\|\s*\$?([\d,.]+)\s*\|\s*\$?([\d,.]+)\s*\|\s*\$?([\d,.]+)\s*\|\s*([\d,]+)\s*\|/g;
  let m;
  while ((m = rowRe.exec(text)) !== null) {
    rows.push({
      date: m[1].replace('‑', '-'),
      open: parseFloat(m[2].replace(/,/g, '')),
      high: parseFloat(m[3].replace(/,/g, '')),
      low: parseFloat(m[4].replace(/,/g, '')),
      close: parseFloat(m[5].replace(/,/g, '')),
      volume: parseInt(m[6].replace(/,/g, ''), 10),
    });
  }
  return rows;
}

function parseNews(text) {
  // Grabs rows with a date-time, title, publisher, and markdown link
  const news = [];
  const newsSection = text.split(/3️⃣|Latest News/i)[1]?.split(/4️⃣/)[0] || '';
  const rowRe = /\|\s*([\d‑-]+\s[\d:]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*\[Read\]\s*\(([^)]+)\)/g;
  let m;
  while ((m = rowRe.exec(newsSection)) !== null) {
    news.push({
      published: m[1].trim(),
      title: m[2].trim(),
      publisher: m[3].trim(),
      link: m[4].trim(),
    });
  }
  return news;
}

function parseCompanyReport(rawText) {
  const text = rawText.replace(/‑/g, '-'); // normalize unicode dashes

  const snapshot = {
    currentPrice: parseNumber(extractValue(text, 'Current price')),
    previousClose: parseNumber(extractValue(text, 'Previous close')),
    open: parseNumber(extractValue(text, 'Open \\(today\\)')),
    dayRange: extractValue(text, 'Day[‑-]range') || extractValue(text, 'Day range'),
    week52Range: extractValue(text, '52[‑-]week (low / high|range)'),
    marketCap: extractValue(text, 'Market[‑-]cap'),
    volume: parseNumber(extractValue(text, 'Volume \\(today\\)')),
    avgVolume20d: parseNumber(extractValue(text, 'Avg\\. volume')),
    beta: parseNumber(extractValue(text, 'Beta')),
    trailingPE: parseNumber(extractValue(text, 'Trailing P/E')),
    forwardPE: parseNumber(extractValue(text, 'Forward P/E')),
  };

  const fundamentals = {
    targetPrice: extractValue(text, 'Target price \\(analyst consensus\\)'),
    recommendation: extractValue(text, 'Recommendation'),
    cash: extractValue(text, 'Cash & cash[‑-]equivalents'),
    totalDebt: extractValue(text, 'Total debt'),
    revenueFY: extractValue(text, 'Revenue \\(FY ?\\d{4}\\)'),
    grossProfit: extractValue(text, 'Gross profit'),
    ebitda: extractValue(text, 'EBITDA(?! margin)'),
    freeCashFlow: extractValue(text, 'Free cash flow'),
    operatingCashFlow: extractValue(text, 'Operating cash flow'),
    margins: extractValue(text, 'Margins'),
    growth: extractValue(text, 'Growth'),
  };

  const company = {
    name: (text.match(/^([^\n(]+)\s*\(Ticker:\s*([A-Z.]+)\)/m) || [])[1]?.trim(),
    ticker: (text.match(/Ticker:\s*([A-Z.]+)/) || [])[1],
    sector: extractValue(text, 'Sector / Industry'),
    employees: extractValue(text, 'Employees'),
    website: extractValue(text, 'Website'),
  };

  const priceHistory = parsePriceHistory(text);
  const news = parseNews(text);

  return { company, snapshot, fundamentals, priceHistory, news };
}

module.exports = { parseCompanyReport };