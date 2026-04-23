import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getInitials, formatTime, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { ReasoningSection } from "@/components/chat/ReasoningSection";
import type { Message } from "@/types/chat.types";

interface MessageBubbleProps {
  message: Message;
  userName?: string;
  onRegenerate?: () => void;
  isLastAssistantMessage?: boolean;
}

export function MessageBubble({
  message,
  userName,
  onRegenerate,
  isLastAssistantMessage,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const metadata = message.metadata;
  const agentName = metadata?.agent_name;
  const isTemp = message.id.startsWith("temp-");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const timeDisplay = !isTemp && message.created_at ? formatTime(message.created_at) : null;
  const fullDateTime = !isTemp && message.created_at ? formatDateTime(message.created_at) : null;

  if (isUser) {
    return (
      <div className="flex justify-end gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
        <div className="flex max-w-[85%] flex-col items-end gap-1 sm:max-w-[75%]">
          <div className="rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm text-primary-foreground sm:px-4 sm:py-2.5">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          {timeDisplay && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[10px] text-muted-foreground">{timeDisplay}</span>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{fullDateTime}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Avatar className="hidden h-7 w-7 shrink-0 self-start rounded-xl sm:flex sm:h-8 sm:w-8">
          <AvatarImage src="/shadcn.jpg" />
          <AvatarFallback className="text-xs">
            {userName ? getInitials(userName) : "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="group flex gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-full bg-muted sm:h-8 sm:w-8">
        <img src="/orb.jpg" alt="" className="h-5 w-5 rounded-full object-cover sm:h-6 sm:w-6" />
      </div>
      <div className="min-w-0 flex-1">
        {(agentName || timeDisplay) && (
          <div className="mb-1 flex items-center gap-2">
            {agentName && (
              <span className="text-xs font-medium text-muted-foreground">{agentName}</span>
            )}
            {timeDisplay && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-[10px] text-muted-foreground">{timeDisplay}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{fullDateTime}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        <ReasoningSection metadata={metadata} />
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
        <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isLastAssistantMessage && onRegenerate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRegenerate}>
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Regenerate response</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
