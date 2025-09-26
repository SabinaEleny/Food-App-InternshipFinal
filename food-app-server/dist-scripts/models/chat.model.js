"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = exports.ConversationModel = void 0;
const mongoose_1 = require("mongoose");
const ConversationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, default: 'New Conversation' },
    model: { type: String },
    summary: { type: String, default: '' },
}, {
    timestamps: true,
    versionKey: false,
});
exports.ConversationModel = (0, mongoose_1.model)('Conversation', ConversationSchema);
const MessageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true,
    },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false,
});
exports.MessageModel = (0, mongoose_1.model)('Message', MessageSchema);
