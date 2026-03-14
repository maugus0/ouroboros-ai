import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatPage() {
  const { chatId } = useParams<{ chatId?: string }>();
  const { user } = useAuth();
  const { activeChat, activeChatId, setActiveChatId, sendMessage, isStreaming } = useChat();

  useEffect(() => {
    if (chatId && chatId !== activeChatId) {
      setActiveChatId(chatId);
    } else if (!chatId && activeChatId) {
      setActiveChatId(null);
    }
  }, [chatId, activeChatId, setActiveChatId]);

  const messages = activeChat?.messages ?? [];
  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {isEmpty ? (
        <>
          <ChatEmptyState onSuggestionClick={sendMessage} />
          <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
        </>
      ) : (
        <>
          <ChatMessages messages={messages} isStreaming={isStreaming} userName={user?.name} />
          <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
        </>
      )}
    </div>
  );
}
