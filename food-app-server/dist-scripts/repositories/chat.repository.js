"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const chat_model_1 = require("../models/chat.model");
class ChatRepository {
    async findConversationsByUserId(userId) {
        return chat_model_1.ConversationModel.find({ userId }).sort({ updatedAt: -1 }).lean();
    }
    async findConversationById(conversationId, userId) {
        return chat_model_1.ConversationModel.findOne({ _id: conversationId, userId });
    }
    async createConversation(userId, model) {
        return chat_model_1.ConversationModel.create({ userId, model });
    }
    async updateConversation(conversationId, data) {
        await chat_model_1.ConversationModel.updateOne({ _id: conversationId }, { ...data });
    }
    async findMessagesByConversationId(conversationId) {
        return chat_model_1.MessageModel.find({ conversationId }).sort({ createdAt: 'asc' }).lean();
    }
    async findLastNMessages(conversationId, limit) {
        const messages = await chat_model_1.MessageModel.find({ conversationId })
            .sort({ createdAt: 'desc' })
            .limit(limit);
        return messages.reverse();
    }
    async createMessage(conversationId, role, content) {
        return chat_model_1.MessageModel.create({ conversationId, role, content });
    }
}
exports.ChatRepository = ChatRepository;
