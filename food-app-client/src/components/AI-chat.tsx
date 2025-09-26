import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bot, Loader2, MessageSquare, Plus, Send, User, X } from 'lucide-react';
import { useAiChat } from '@/hooks/use-ai-chat';
import type { ConversationSummary } from '@/types';

const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
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
  } = useAiChat(isOpen);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiReplying]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleUserSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="w-80 h-[28rem] bg-card text-card-foreground rounded-xl shadow-2xl border border-border flex flex-col animate-in fade-in-0 zoom-in-95">
          <div className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
            {activeConversationId ? (
              <button
                onClick={returnToConversationList}
                className="p-1 rounded-full text-muted-foreground hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="w-6" />
            )}

            <h3 className="font-bold text-lg">
              {activeConversationId ? 'Tastely Assistant' : 'Conversations'}
            </h3>

            <div className="flex items-center gap-1">
              {!activeConversationId && (
                <button
                  onClick={startNewConversation}
                  className="p-1 rounded-full text-muted-foreground hover:bg-muted"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeConversationId ? (
              <div className="p-4 space-y-4 h-full">
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={msg._id || `msg-${index}`}
                      className={`flex items-start gap-3 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          <Bot size={20} />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isAiReplying && (
                  <div className="flex items-start gap-3 justify-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Bot size={20} />
                    </div>
                    <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted text-muted-foreground flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="p-2 h-full">
                {isLoadingConversations ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations?.map((conv: ConversationSummary) => (
                      <button
                        key={conv._id}
                        onClick={() => selectConversation(conv._id)}
                        className="w-full text-left p-2 rounded-md hover:bg-muted truncate text-sm"
                      >
                        {conv.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {activeConversationId && (
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-input px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isAiReplying}
                />
                <button
                  type="submit"
                  className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed"
                  disabled={isAiReplying || !inputValue.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 bg-primary rounded-full shadow-lg text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform"
        >
          <MessageSquare size={32} />
        </button>
      )}
    </div>
  );
};

export default AiChat;