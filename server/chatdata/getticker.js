const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_AI_KEY });

// get ticker for company's name
module.exports.getticker = async (companyName, history = []) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `- If a specific company name is identified, respond with ONLY the correct Yahoo Finance ticker symbol using these rules:
  - Indian stocks on NSE  → append .NS
  - Indian stocks on BSE only → append .BO
  - US stocks             → plain ticker
  - UK stocks             → append .L
  - German stocks         → append .DE
  - Japanese stocks       → append .T

- If no specific company can be identified even from conversational context, respond with EXACTLY: NONE
Respond with ONLY the ticker symbol or NONE. No explanation, no punctuation, no extra text.`,
      },
      ...history, // give it the conversation context
      { role: 'user', content: companyName },
    ],
  });

  const result = response.choices[0].message.content.trim().toUpperCase();
  return result === 'NONE' ? null : result;
};