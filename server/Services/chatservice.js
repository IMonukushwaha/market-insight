const { responsechat } = require('./response');
const Chat = require('../models/chats');

function buildMessageHistory(chatMessages) {
  const history = [];
 
  for (const msg of chatMessages) {
    history.push({ role: 'user', content: msg.prompt });
    history.push({ role: 'assistant', content: msg.response });
  }
 
  return history;
}

async function sendMessage(chatId, newPrompt) {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new Error('Chat not found');

  const history = buildMessageHistory(chat.messages);

  const { reply, userMessage } = await responsechat(newPrompt, history);

  chat.messages.push({ prompt: userMessage, response: reply});
  await chat.save();

  return reply;
}

module.exports = {sendMessage};