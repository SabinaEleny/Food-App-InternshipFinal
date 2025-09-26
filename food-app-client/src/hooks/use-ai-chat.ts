import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type ChatResponse,
  fetchConversations,
  fetchMessages,
  sendMessage as sendMessageApi,
  type SendMessagePayload,
} from '@/services/chat.service';
import type { ChatMessage } from '@/types';

export const useAiChat = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: conversations, isLoading: isLoadingConversations, refetch: refetchConversations } = useQuery({
    queryKey: ['chatConversations'],
    queryFn: fetchConversations,
    enabled: isOpen,
  });

  const { data: fetchedMessages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['chatMessages', activeConversationId],
    queryFn: () => fetchMessages(activeConversationId!),
    enabled: !!activeConversationId && activeConversationId !== 'new',
  });

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  useEffect(() => {
    if(isOpen) {
      refetchConversations();
    } else {
      setActiveConversationId(null);
      setMessages([]);
    }
  }, [isOpen, refetchConversations]);

  const { mutate: sendMessage, isPending: isAiReplying } = useMutation<
    ChatResponse,
    Error,
    SendMessagePayload
  >({
    mutationFn: sendMessageApi,
    onSuccess: (data, variables) => {
      const isNewConversation = variables.conversationId === null;

      if (isNewConversation) {
        setActiveConversationId(data.conversationId);
        queryClient.invalidateQueries({ queryKey: ['chatMessages', data.conversationId] });
        queryClient.invalidateQueries({ queryKey: ['chatConversations'] });
      } else {
        const aiMessage: ChatMessage = {
          _id: `ai-${Date.now()}`,
          content: data.reply,
          role: 'assistant',
          conversationId: data.conversationId,
          createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    },
    onError: (error, variables) => {
      console.error('Failed to get AI response:', error);
      const errorMessage: ChatMessage = {
        _id: `error-${Date.now()}`,
        content: 'I seem to be having trouble connecting. Please try again.',
        role: 'assistant',
        conversationId: variables.conversationId || 'new',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleUserSendMessage = (text: string) => {
    if (!text.trim()) return;

    const conversationIdForApi = activeConversationId === 'new' ? null : activeConversationId;

    const userMessage: ChatMessage = {
      _id: `user-${Date.now()}`,
      content: text,
      role: 'user',
      conversationId: activeConversationId || 'new',
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    sendMessage({ message: text, conversationId: conversationIdForApi });
  };

  const startNewConversation = () => {
    setActiveConversationId('new');
    setMessages([
      {
        _id: 'welcome-new',
        content: 'Hey! I’m Tastely Assistant. Ask me anything about orders, complaints, or product info. How can I help you today?',
        role: 'assistant',
        conversationId: 'new',
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const selectConversation = (conversationId: string) => {
    if (activeConversationId === conversationId) return;
    setMessages([]);
    setActiveConversationId(conversationId);
  };

  const returnToConversationList = () => {
    setActiveConversationId(null);
    setMessages([]);
    refetchConversations();
  };

  return {
    conversations,
    isLoadingConversations,
    messages,
    isLoadingMessages,
    activeConversationId,
    selectConversation,
    startNewConversation,
    returnToConversationList,
    isAiReplying,
    handleUserSendMessage,
  };
};