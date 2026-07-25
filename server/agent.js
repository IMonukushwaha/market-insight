const Groq = require('groq-sdk');
require('dotenv').config();

const { getticker } = require('./chatdata/getticker');
const { companydata } = require('./chatdata/financialdata');
const { formatAllData } = require('./chatdata/formatdata');
const { SYSTEM_PROMPT_Market_Insight, SYSTEM_PROMPT_Text } = require('./chatdata/history');

const groq = new Groq({ apiKey: process.env.GROQ_AI_KEY });

// keep only the last 4 exchanges to control token usage
const MAX_HISTORY_TURNS = 4;

module.exports.responsechat = async (userMessage, chatHistory = []) => {
  try {
    console.log(`\nYou: ${userMessage}`);
    const trimmedHistory = chatHistory.slice(-MAX_HISTORY_TURNS * 2);
    const ticker = await getticker(userMessage, trimmedHistory);
    
    // ---- Case 1: No ticker resolved → general chat query ----
    if (!ticker) {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_Text },
          ...trimmedHistory,
          { role: 'user', content: userMessage },
        ],
      });

      const reply = response.choices[0].message.content;
      return { reply, userMessage, type: 'text' };
    }

    // ---- Case 2: Ticker resolved → stock insight pipeline ----
    console.log(`Resolved ticker: ${ticker}`);

    const data = await companydata(ticker);
    const context = formatAllData(ticker, data);

    const enrichedMessage = `The user asked: "${userMessage}",This question is about the company with ticker ${ticker}. Here is the live market data you may use if relevant:
    ${context}`;

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
    console.error("Groq API error:", err.message);
    throw new Error("Failed to generate a response. Please try again.");
  }
};