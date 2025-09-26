import { InferSchemaType, model, Schema, Types } from 'mongoose';

const ConversationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, default: 'New Conversation' },
    model: { type: String },
    summary: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type ConversationDocument = InferSchemaType<typeof ConversationSchema> & {
  _id: Types.ObjectId;
};

export const ConversationModel = model('Conversation', ConversationSchema);

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type MessageDocument = InferSchemaType<typeof MessageSchema> & {
  _id: Types.ObjectId;
};

export const MessageModel = model('Message', MessageSchema);
