import apiClient from '@/api/api-client';
import type { ChatMessage, ConversationSummary } from '@/types';

export interface ChatResponse {
  conversationId: string;
  reply: string;
}

export interface SendMessagePayload {
  message: string;
  conversationId: string | null;
}

export const sendMessage = async (payload: SendMessagePayload): Promise<ChatResponse> => {
  const response = await apiClient.post<ChatResponse>('/chat', payload);
  return response.data;
};

export const fetchConversations = async (): Promise<ConversationSummary[]> => {
  const response = await apiClient.get<ConversationSummary[]>('/chat/conversations');
  return response.data;
};

export const fetchMessages = async (conversationId: string): Promise<ChatMessage[]> => {
  const response = await apiClient.get<ChatMessage[]>(`/chat/conversations/${conversationId}`);
  return response.data;
};