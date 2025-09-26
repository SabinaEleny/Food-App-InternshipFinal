import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { Types } from 'mongoose';
import { ChatRepository } from '../repositories/chat.repository';
import { MailService } from './mail.service';
import { getContext } from '../ai/rag';
import { UserDocument } from '../models/user.model';
import { OrderRepository } from '../repositories/order.repository';

const complaintContacts = {
  MISSING_ITEM: { name: 'Andreea', email: 'andreea@tastely.com' },
  WRONG_ORDER: { name: 'Mihai', email: 'mihai@tastely.com' },
  LATE_DELIVERY: { name: 'Alex', email: 'alex@tastely.com' },
  OTHER: { name: 'Support', email: 'support@tastely.com' },
};
type ComplaintCategory = keyof typeof complaintContacts;

type UserIntent = 'ANSWER_QUESTION' | 'GATHER_COMPLAINT_INFO' | 'CLASSIFY_AND_RESOLVE_COMPLAINT';

export class ChatService {
  private readonly chatRepository: ChatRepository;
  private readonly mailService: MailService;
  private readonly openai: OpenAI;
  private readonly orderRepository: OrderRepository;
  private readonly CHAT_MODEL = 'openai/gpt-4o-mini';

  constructor() {
    this.chatRepository = new ChatRepository();
    this.mailService = new MailService();
    this.orderRepository = new OrderRepository();
    this.openai = new OpenAI({
      baseURL: process.env.OPENROUTER_BASE_URL,
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }

  public async getConversations(userId: Types.ObjectId) {
    return this.chatRepository.findConversationsByUserId(userId);
  }

  public async getMessages(userId: Types.ObjectId, conversationId: string) {
    const conversation = await this.chatRepository.findConversationById(conversationId, userId);
    if (!conversation) {
      return { error: 'Conversation not found or access denied' };
    }
    return this.chatRepository.findMessagesByConversationId(conversationId);
  }

  public async processMessage(user: UserDocument, message: string, conversationId?: string | null) {
    const isNewConversation = !conversationId;
    const conv = await this._getOrCreateConversation(user._id, conversationId);

    await this.chatRepository.createMessage(conv._id, 'user', message);

    const history = await this.chatRepository.findLastNMessages(conv._id, 10);
    const historyForAi: ChatCompletionMessageParam[] = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const intent = await this._determineUserIntent(historyForAi);
    let reply = '';

    switch (intent) {
      case 'GATHER_COMPLAINT_INFO':
        reply =
          'I understand there seems to be an issue. Could you please provide more details? For example, was an item missing, was the order incorrect, or was it a delivery problem?';
        break;

      case 'CLASSIFY_AND_RESOLVE_COMPLAINT':
        reply =
          (await this._resolveComplaint(historyForAi, user)) ??
          "I see there's an issue, but I need more specific details to help. Could you explain further?";
        break;

      case 'ANSWER_QUESTION':
      default:
        reply = await this._getStandardReply(historyForAi, message);
        break;
    }

    await this.chatRepository.createMessage(conv._id, 'assistant', reply);

    if (isNewConversation) {
      const newTitle = await this._generateTitle(message);
      await this.chatRepository.updateConversation(conv._id, { title: newTitle });
    } else {
      await this.chatRepository.updateConversation(conv._id, {});
    }

    return { conversationId: conv._id.toString(), reply };
  }

  private async _getOrCreateConversation(userId: Types.ObjectId, conversationId?: string | null) {
    if (conversationId) {
      const existingConv = await this.chatRepository.findConversationById(conversationId, userId);
      if (existingConv) {
        return existingConv;
      }
    }

    const newConversation = await this.chatRepository.createConversation(userId, this.CHAT_MODEL);

    await this.chatRepository.createMessage(
      newConversation._id,
      'assistant',
      'Hey! I’m Tastely Assistant. Ask me anything about orders, complaints, or product info. How can I help you today?',
    );

    return newConversation;
  }

  private async _determineUserIntent(history: ChatCompletionMessageParam[]): Promise<UserIntent> {
    const conversationText = history.map((m) => `[${m.role}]: ${m.content}`).join('\n');

    const prompt = `You are an intent detection AI. Analyze the conversation history to determine the user's intent in their LATEST message, using the full context.
Rules:
1. If the user's latest message hints at a problem but is vague, the intent is GATHER_COMPLAINT_INFO.
2. If the AI's last message asked for details and the user now provides them, the intent is CLASSIFY_AND_RESOLVE_COMPLAINT.
3. If the user provides specific, actionable details about a problem from the start, the intent is CLASSIFY_AND_RESOLVE_COMPLAINT.
4. Otherwise, the intent is ANSWER_QUESTION.

Conversation History:
${conversationText}

Respond ONLY with: ANSWER_QUESTION, GATHER_COMPLAINT_INFO, or CLASSIFY_AND_RESOLVE_COMPLAINT.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.CHAT_MODEL,
        temperature: 0,
        messages: [{ role: 'system', content: prompt }],
      });
      const intent = response.choices[0].message.content?.trim() as UserIntent;
      if (
        ['ANSWER_QUESTION', 'GATHER_COMPLAINT_INFO', 'CLASSIFY_AND_RESOLVE_COMPLAINT'].includes(
          intent,
        )
      ) {
        return intent;
      }
    } catch (e) {
      console.error('Intent detection failed:', e);
    }

    return 'ANSWER_QUESTION';
  }

  private async _resolveComplaint(
    history: ChatCompletionMessageParam[],
    user: UserDocument,
  ): Promise<string | null> {
    const conversationText = history.map((m) => `[${m.role}]: ${m.content}`).join('\n');
    const prompt = `You are a complaint resolution AI. Analyze the ENTIRE conversation and classify the problem into one of these categories: ${Object.keys(complaintContacts).join(', ')}. Then, create a concise, one-sentence summary of the user's specific problem based on the details they provided.
    Conversation: ${conversationText}
    Respond ONLY with a JSON object like {"category": "CATEGORY", "problem": "Problem summary"}. If uncertain about the category, use "OTHER".`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.CHAT_MODEL,
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' },
      });
      const result = response.choices[0].message.content;

      if (!result) return null;

      const { category, problem } = JSON.parse(result) as {
        category: ComplaintCategory;
        problem: string;
      };

      if (category && problem && complaintContacts[category]) {
        const contact = complaintContacts[category];
        const latestOrder = await this.orderRepository.findLatestOrderByUserId(user._id);
        const lastUserMessage =
          history
            .filter((m) => m.role === 'user')
            .pop()
            ?.content?.toString() ?? '';

        await this.mailService.sendComplaintNotification({
          userName: user.name,
          userEmail: user.email,
          orderId: latestOrder?._id.toString() || 'Not Provided',
          problemDescription: problem,
          originalUserMessage: lastUserMessage,
          category,
          contact,
        });

        return `I am very sorry for the situation. I have notified ${contact.name}, and you will be contacted shortly to resolve the issue.`;
      }
    } catch (e) {
      console.error('Complaint resolution failed:', e);
    }

    return "I apologize, I'm having trouble processing that. I have notified our support team to look into this for you.";
  }

  private async _getStandardReply(
    history: ChatCompletionMessageParam[],
    message: string,
  ): Promise<string> {
    const { context } = await getContext(message);
    const systemPrompt =
      'You are a friendly and helpful AI assistant for Tastely, a food delivery app. Your tone should be conversational and helpful. If context is provided, answer based on it. Otherwise, use your general knowledge. Keep your answers concise.';
    const userContent = context ? `Context:\n${context}\n\nQuestion: ${message}` : message;

    const response = await this.openai.chat.completions.create({
      model: this.CHAT_MODEL,
      temperature: 0.5,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(0, -1),
        { role: 'user', content: userContent },
      ],
    });
    return response.choices[0].message.content ?? 'I am unable to respond at this moment.';
  }

  private async _generateTitle(message: string): Promise<string> {
    const prompt = `Create a short title (max 5 words) for a conversation starting with this message: "${message}". Respond with the title only.`;
    try {
      const response = await this.openai.chat.completions.create({
        model: this.CHAT_MODEL,
        messages: [{ role: 'system', content: prompt }],
      });
      return response.choices[0].message.content?.replace(/"/g, '') ?? 'New Chat';
    } catch {
      return 'New Chat';
    }
  }
}
