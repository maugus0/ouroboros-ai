import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import type { Message } from "@/types/chat.types";

interface MessageBubbleProps {
  message: Message;
  userName?: string;
}

export function MessageBubble({ message, userName }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 px-4 py-3">
        <div className="max-w-[75%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <Avatar className="h-8 w-8 shrink-0 rounded-xl">
          <AvatarImage src="/shadcn.jpg" />
          <AvatarFallback className="text-xs">
            {userName ? getInitials(userName) : "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="group flex gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <img src="/orb.jpg" alt="" className="h-6 w-6 rounded-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        {message.agentName && (
          <p className="mb-1 text-xs font-medium text-muted-foreground">{message.agentName}</p>
        )}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
        <div className="mt-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
