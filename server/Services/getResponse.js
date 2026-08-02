const { responsechat } = require('./response');
const Chat = require('../models/chats');

async function getResponse(chatId, newPrompt) {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new Error('Chat not found');

  const { reply } = await responsechat(newPrompt);

  chat.messages.push({ prompt: newPrompt, response: reply});
  await chat.save();
  return reply;
}

module.exports = {getResponse};