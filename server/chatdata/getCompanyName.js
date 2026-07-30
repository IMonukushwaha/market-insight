const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_AI_KEY });

// get company name
module.exports.companyName = async (companyName, history = []) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `Extract the real-world company name the user is asking about,
        even if their message contains extra filler words (e.g. "data", "stock", "market insight", "price", "info").
        Respond with ONLY the company's actual name — no filler words, no explanation, no punctuation.
        If no company is identifiable, respond with NONE.
Examples:
"microsoft data" -> Microsoft
"Tesla market insight" -> Tesla
"how's apple doing" -> Apple
"weather today" -> NONE`
      },
      ...history,
      { role: 'user', content: companyName },
    ],
  });

  const result = response.choices[0].message.content.trim().toUpperCase();
  return result === 'NONE' ? null : result;
};