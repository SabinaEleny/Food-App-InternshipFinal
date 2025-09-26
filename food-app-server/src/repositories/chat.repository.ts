import { Types } from 'mongoose';
import {
  ConversationDocument,
  ConversationModel,
  MessageDocument,
  MessageModel,
} from '../models/chat.model';

export class ChatRepository {
  public async findConversationsByUserId(userId: Types.ObjectId): Promise<ConversationDocument[]> {
    return ConversationModel.find({ userId }).sort({ updatedAt: -1 }).lean();
  }

  public async findConversationById(
    conversationId: string,
    userId: Types.ObjectId,
  ): Promise<ConversationDocument | null> {
    return ConversationModel.findOne({ _id: conversationId, userId });
  }

  public async findLatestConversationByUserId(
    userId: Types.ObjectId,
  ): Promise<ConversationDocument | null> {
    return ConversationModel.findOne({ userId }).sort({ updatedAt: -1 });
  }

  public async createConversation(
    userId: Types.ObjectId,
    model: string,
  ): Promise<ConversationDocument> {
    return ConversationModel.create({ userId, model });
  }

  public async updateConversation(
    conversationId: Types.ObjectId,
    data: Partial<Pick<ConversationDocument, 'title' | 'summary'>>,
  ): Promise<void> {
    await ConversationModel.updateOne(
      { _id: conversationId },
      { $set: data, $currentDate: { updatedAt: true } },
    );
  }

  public async findMessagesByConversationId(conversationId: string): Promise<MessageDocument[]> {
    return MessageModel.find({ conversationId }).sort({ createdAt: 'asc' }).lean();
  }

  public async findLastNMessages(
    conversationId: Types.ObjectId,
    limit: number,
  ): Promise<MessageDocument[]> {
    const messages = await MessageModel.find({ conversationId })
      .sort({ createdAt: 'desc' })
      .limit(limit);
    return messages.reverse();
  }

  public async createMessage(
    conversationId: Types.ObjectId,
    role: 'user' | 'assistant',
    content: string,
  ): Promise<MessageDocument> {
    return MessageModel.create({ conversationId, role, content });
  }
}