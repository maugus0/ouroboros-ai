import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Chat, Message } from "@/types/chat.types";
import { mockChats } from "@/lib/mock-data";

interface ChatContextValue {
  chats: Chat[];
  activeChat: Chat | null;
  activeChatId: string | null;
  isStreaming: boolean;

  createChat: () => Chat;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function generateMockReply(userContent: string): string {
  const lower = userContent.toLowerCase();
  if (lower.includes("scholarship") || lower.includes("funding")) {
    return "I'll search our database for scholarships matching your profile. Based on your academic background and target programs, I'm finding several promising opportunities. Let me compile the results for you.";
  }
  if (lower.includes("cv") || lower.includes("resume")) {
    return "I'd be happy to help with your CV. Please share it and I'll analyze the structure, highlight strengths, and suggest improvements tailored to your target programs.";
  }
  if (lower.includes("sop") || lower.includes("statement")) {
    return "Great choice! A strong Statement of Purpose can make all the difference. Let me help you structure it effectively based on your profile and the program's expectations.";
  }
  return "I understand your request. Let me coordinate with our specialized agents to provide you with the most comprehensive assistance. Is there anything specific you'd like me to focus on?";
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? null,
    [chats, activeChatId]
  );

  const createChat = useCallback(() => {
    const newChat: Chat = {
      id: generateId(),
      title: "New conversation",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat;
  }, []);

  const deleteChat = useCallback(
    (id: string) => {
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (activeChatId === id) setActiveChatId(null);
    },
    [activeChatId]
  );

  const renameChat = useCallback((id: string, title: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      let chatId = activeChatId;

      const userMsg: Message = {
        id: generateId(),
        chatId: chatId ?? "",
        role: "user",
        content,
        createdAt: new Date(),
      };

      if (!chatId) {
        const newChat: Chat = {
          id: generateId(),
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [{ ...userMsg, chatId: "" }],
        };
        newChat.messages[0].chatId = newChat.id;
        chatId = newChat.id;
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(newChat.id);
      } else {
        setChats((prev) =>
          prev.map((c) => {
            if (c.id !== chatId) return c;
            const title =
              c.messages.length === 0
                ? content.slice(0, 50) + (content.length > 50 ? "..." : "")
                : c.title;
            return {
              ...c,
              title,
              updatedAt: new Date(),
              messages: [...c.messages, { ...userMsg, chatId: c.id }],
            };
          })
        );
      }

      setIsStreaming(true);
      const finalChatId = chatId;

      setTimeout(() => {
        const assistantMsg: Message = {
          id: generateId(),
          chatId: finalChatId,
          role: "assistant",
          content: generateMockReply(content),
          agentName: "Orchestrator Agent",
          createdAt: new Date(),
        };
        setChats((prev) =>
          prev.map((c) =>
            c.id === finalChatId
              ? {
                  ...c,
                  updatedAt: new Date(),
                  messages: [...c.messages, assistantMsg],
                }
              : c
          )
        );
        setIsStreaming(false);
      }, 1200);
    },
    [activeChatId]
  );

  const value = useMemo(
    () => ({
      chats,
      activeChat,
      activeChatId,
      isStreaming,
      createChat,
      deleteChat,
      renameChat,
      setActiveChatId,
      sendMessage,
    }),
    [
      chats,
      activeChat,
      activeChatId,
      isStreaming,
      createChat,
      deleteChat,
      renameChat,
      setActiveChatId,
      sendMessage,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
