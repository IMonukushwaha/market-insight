const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {requireAuth} = require('../middlewares.js');
const chatcontrollers = require('../controller/chat.js');

router.post('/getprompt', requireAuth, wrapAsync(chatcontrollers.recievedPrompt));

router.get('/chat/:chatId', requireAuth, wrapAsync(chatcontrollers.retriveChat));

router.get('/chats', requireAuth, wrapAsync(chatcontrollers.retriveRecentChatTitles));

module.exports = router;