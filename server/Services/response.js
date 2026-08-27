require('dotenv').config();

const { getTicker } = require('../tools/getticker');
const { companydata } = require('../chatdata/collectedCompanyData');
const { SYSTEM_PROMPT_Market_Insight } = require('../chatdata/history');

const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_AI_KEY });

function extractKeyMetrics(ticker, data) {
  const price = typeof data.price === 'number' ? data.price : null;
  const hist = data.history && typeof data.history === 'object' ? data.history : null;

  return {
    ticker,
    currentPrice: price,
    periodHigh: hist?.periodHigh ?? null,
    periodLow: hist?.periodLow ?? null,
    percentChangeOverPeriod: hist?.percentChangeOverPeriod ?? null,
    historyFrom: hist?.from ?? null,
    historyTo: hist?.to ?? null,
    // First headline only, if news came back as an array
    topNewsHeadline: Array.isArray(data.news) ? data.news[0]?.title : null,
  };
}

module.exports.responsechat = async (newPrompt) => {
  try {
    console.log(`\nYou: ${newPrompt}`);
    const ticker = await getTicker(newPrompt);

    // ---- Case 1: No ticker resolved -> tell the user directly, no general chat ----
    if (!ticker || typeof ticker !== 'string' || ticker.startsWith('Error')) {
      const reply = 'Company not found. Please check the spelling or make sure the company is publicly listed. Try again with a specific company name, such as "Tesla" or "Apple".';
      return { reply };
    }

    // ---- Case 2: Ticker resolved -> stock insight pipeline ----
    console.log(`Resolved ticker: ${ticker}`);

    const data = await companydata(ticker);

    // Only send a small curated slice to the LLM
    const keyMetrics = extractKeyMetrics(ticker, data);

    const enrichedMessage = `The user asked: "${newPrompt}". This is about ${ticker}.
Key data:
${JSON.stringify(keyMetrics, null, 2)}

Write a short, natural, conversational summary (3-5 sentences). No tables, no markdown formatting, no bullet points. Sound like a knowledgeable friend explaining the stock, not a report.`;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_Market_Insight },
        { role: 'user', content: enrichedMessage },
      ],
      reasoning_format: "hidden",
    });

    const reply = response.choices[0].message.content;

    // Full structured data (price history array, news, holders, etc.) → frontend for charts
    return { reply, chartData: { ticker, ...data } };

  } catch (err) {
    console.error('Groq API error:', err.message);
    throw new Error('Failed to generate a response. Please try again.');
  }
};