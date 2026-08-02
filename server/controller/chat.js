const mongoose = require('mongoose');
const Chat = require('../models/chats.js');
const AppError = require('../utils/ExpressError.js');
const { getResponse } = require('../Services/getResponse.js');

module.exports.Prompt = async (req, res) => {
    const { prompt, chatId } = req.body;

    if (!prompt || !prompt.trim()) {
        throw new AppError(400, 'Prompt is required');
    }

    let chat;

    if (chatId && mongoose.Types.ObjectId.isValid(chatId)) {
        chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    }

    if (!chat) {
        chat = await Chat.create({
            user: req.user._id,
            title: prompt.slice(0, 40),
            messages: [],
        });
    }

    const reply = await getResponse(chat._id.toString(), prompt);

    res.status(200).json({
        chatId: chat._id,
        response: reply,
        title: chat.title,
    });
}

module.exports.retriveChat = async (req, res) => {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new AppError(400, 'Invalid chat id');
    }

    const chat = await Chat.findOne({ _id: chatId, user: req.user._id });

    if (!chat) {
        throw new AppError(404, 'Chat not found');
    }

    res.status(200).json({
        chatId: chat._id,
        title: chat.title,
        messages: chat.messages,
    });
}

module.exports.retriveRecentChatTitles = async (req, res) => {
    const chats = await Chat.find({ user: req.user._id })
        .select('_id title updatedAt')
        .sort({ updatedAt: -1 });

    res.status(200).json({ chats });
}