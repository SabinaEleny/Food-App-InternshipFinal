"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const openai_1 = __importDefault(require("openai"));
const chat_repository_1 = require("../repositories/chat.repository");
const mail_service_1 = require("./mail.service");
const rag_1 = require("../ai/rag");
const complaintContacts = {
    MISSING_ITEM: { name: 'Andreea', email: 'andreea@tastely.com' },
    WRONG_ORDER: { name: 'Mihai', email: 'mihai@tastely.com' },
    LATE_DELIVERY: { name: 'Alex', email: 'alex@tastely.com' },
    OTHER: { name: 'Support', email: 'support@tastely.com' },
};
class ChatService {
    constructor() {
        this.CHAT_MODEL = 'google/gemini-flash-1.5';
        this.chatRepository = new chat_repository_1.ChatRepository();
        this.mailService = new mail_service_1.MailService();
        this.openai = new openai_1.default({
            baseURL: process.env.OPENROUTER_BASE_URL,
            apiKey: process.env.OPENROUTER_API_KEY,
        });
    }
    async getConversations(userId) {
        return this.chatRepository.findConversationsByUserId(userId);
    }
    async getMessages(userId, conversationId) {
        const conversation = await this.chatRepository.findConversationById(conversationId, userId);
        if (!conversation) {
            return { error: 'Conversation not found or access denied' };
        }
        return this.chatRepository.findMessagesByConversationId(conversationId);
    }
    async processMessage(user, message, conversationId) {
        const conv = await this._getOrCreateConversation(user._id, conversationId);
        const history = await this.chatRepository.findLastNMessages(conv._id, 10);
        const historyForAi = history.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        await this.chatRepository.createMessage(conv._id, 'user', message);
        const complaintResponse = await this._classifyAndHandleComplaint(historyForAi, message, user);
        if (complaintResponse) {
            await this.chatRepository.createMessage(conv._id, 'assistant', complaintResponse);
            return { conversationId: conv._id.toString(), reply: complaintResponse };
        }
        const standardReply = await this._getStandardReply(historyForAi, message);
        await this.chatRepository.createMessage(conv._id, 'assistant', standardReply);
        if (conv.title === 'New Conversation') {
            const newTitle = await this._generateTitle(message);
            await this.chatRepository.updateConversation(conv._id, { title: newTitle });
        }
        return { conversationId: conv._id.toString(), reply: standardReply };
    }
    async _getOrCreateConversation(userId, conversationId) {
        if (conversationId) {
            const conv = await this.chatRepository.findConversationById(conversationId, userId);
            if (conv)
                return conv;
        }
        return this.chatRepository.createConversation(userId, this.CHAT_MODEL);
    }
    async _classifyAndHandleComplaint(history, question, user) {
        const prompt = `You are a complaint classifier for a food delivery app. Is the following message a complaint? If not, respond with "null". If it is, classify it into one of these categories: ${Object.keys(complaintContacts).join(', ')} and summarize the problem. Respond ONLY with a JSON object like {"category": "CATEGORY", "problem": "Problem summary"}. Message: ${question}`;
        try {
            const response = await this.openai.chat.completions.create({
                model: this.CHAT_MODEL,
                messages: [{ role: 'system', content: prompt }],
                response_format: { type: 'json_object' },
            });
            const result = response.choices[0].message.content;
            if (!result || result.toLowerCase() === 'null')
                return null;
            const { category, problem } = JSON.parse(result);
            if (category && problem && complaintContacts[category]) {
                const contact = complaintContacts[category];
                await this.mailService.sendComplaintNotification({
                    userName: user.name,
                    userEmail: user.email,
                    problemDescription: problem,
                    category,
                    contact,
                });
                return `I am very sorry for the situation. I have notified ${contact.name}, and you will be contacted shortly to resolve the issue.`;
            }
        }
        catch {
            return null;
        }
        return null;
    }
    async _getStandardReply(history, message) {
        const { context } = await (0, rag_1.getContext)(message);
        const systemPrompt = 'You are a helpful AI assistant for Tastely. If context is provided, answer based on it. Otherwise, use your general knowledge.';
        const userContent = context ? `Context:\n${context}\n\nQuestion: ${message}` : message;
        const response = await this.openai.chat.completions.create({
            model: this.CHAT_MODEL,
            temperature: 0.3,
            messages: [
                { role: 'system', content: systemPrompt },
                ...history,
                { role: 'user', content: userContent },
            ],
        });
        return response.choices[0].message.content ?? 'I am unable to respond at this moment.';
    }
    async _generateTitle(message) {
        const prompt = `Create a short title (max 5 words) for a conversation starting with this message: "${message}". Respond with the title only.`;
        try {
            const response = await this.openai.chat.completions.create({
                model: this.CHAT_MODEL,
                messages: [{ role: 'system', content: prompt }],
            });
            return response.choices[0].message.content?.replace(/"/g, '') ?? 'New Chat';
        }
        catch {
            return 'New Chat';
        }
    }
}
exports.ChatService = ChatService;
