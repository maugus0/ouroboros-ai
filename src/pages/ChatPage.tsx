import { useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const { chatId } = useParams<{ chatId?: string }>();
  const { user } = useAuth();
  const {
    activeChatId,
    messages,
    setActiveChatId,
    sendMessage,
    isStreaming,
    isLoadingMessages,
    error,
    loadMessages,
    clearError,
  } = useChat();

  useEffect(() => {
    if (chatId && chatId !== activeChatId) {
      setActiveChatId(chatId);
    } else if (!chatId && activeChatId) {
      setActiveChatId(null);
    }
  }, [chatId, activeChatId, setActiveChatId]);

  const isEmpty = messages.length === 0 && !isLoadingMessages;
  const showLoading = isLoadingMessages && messages.length === 0;
  const showError = error && messages.length === 0 && !isLoadingMessages;

  const handleRetry = () => {
    if (activeChatId) {
      clearError();
      loadMessages(activeChatId);
    }
  };

  const lastUserMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        return messages[i].content;
      }
    }
    return null;
  }, [messages]);

  const handleRegenerate = useCallback(() => {
    if (lastUserMessage && !isStreaming) {
      sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, isStreaming, sendMessage]);

  if (showLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm font-medium">Failed to load messages</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {isEmpty ? (
        <>
          <ChatEmptyState onSuggestionClick={sendMessage} />
          <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
        </>
      ) : (
        <>
          <ChatMessages
            messages={messages}
            isStreaming={isStreaming}
            userName={user?.first_name}
            onRegenerate={!isStreaming ? handleRegenerate : undefined}
          />
          <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
        </>
      )}
    </div>
  );
}
