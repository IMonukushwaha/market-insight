const Groq = require('groq-sdk');
require('dotenv').config();

const { getTicker } = require('../tools/getticker');
const { companydata } = require('../chatdata/collectedCompanyData');
const { SYSTEM_PROMPT_Market_Insight } = require('../chatdata/history');

const groq = new Groq({ apiKey: process.env.GROQ_AI_KEY });

// keep only the last 4 exchanges to control token usage
const MAX_HISTORY_TURNS = 4;

module.exports.responsechat = async (userMessage, chatHistory = []) => {
  try {
    console.log(`\nYou: ${userMessage}`);
    const trimmedHistory = chatHistory.slice(-MAX_HISTORY_TURNS * 2);
    const ticker = await getTicker(userMessage, trimmedHistory);

    // ---- Case 1: No ticker resolved -> tell the user directly, no general chat ----
    if (!ticker || typeof ticker !== 'string' || ticker.startsWith('Error')) {
      const reply = 'Your query should include a company name, or the company name could not be found. Please try again with a specific company (e.g. "Tesla stock" or "Apple market insight").';
      return { reply, userMessage, type: 'text' };
    }

    // ---- Case 2: Ticker resolved -> stock insight pipeline ----
    console.log(`Resolved ticker: ${ticker}`);

    const data = await companydata(ticker);
    console.log(data);

    // Each source function now already returns concise, most-recent-only
    // data (see stockhistory.js, stockanalystrecommendation.js, etc), so no
    // extra summarization step is needed here before building the prompt.
    const enrichedMessage = `The user asked: "${userMessage}". This question is about the company with ticker ${ticker}. Here is the live market data you will use:
    ${JSON.stringify(data, null, 2)}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_Market_Insight },
        ...trimmedHistory,
        { role: 'user', content: enrichedMessage },
      ],
    });

    const reply = response.choices[0].message.content;

    return { reply, userMessage, type: 'stock_insight' };

  } catch (err) {
    console.error('Groq API error:', err.message);
    throw new Error('Failed to generate a response. Please try again.');
  }
};