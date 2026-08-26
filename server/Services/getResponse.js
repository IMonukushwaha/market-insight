const { responsechat } = require('./response');
const Chat = require('../models/chats');

async function getResponse(chatId, newPrompt) {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new Error('Chat not found');

  const { reply, chartData } = await responsechat(newPrompt);

  chat.messages.push({
    prompt: newPrompt,
    response: reply,
    chartData: chartData || null, // store structured data alongside the message
  });
  await chat.save();

  return { reply, chartData };
}

module.exports = { getResponse };