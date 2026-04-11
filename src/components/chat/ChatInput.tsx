import { useState, useRef, type KeyboardEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUp, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MESSAGE_MAX_LENGTH } from "@/types/chat.types";

interface ChatInputProps {
  onSend: (content: string) => void;
  isStreaming: boolean;
}

const CHAR_COUNT_THRESHOLD = MESSAGE_MAX_LENGTH - 500;

export function ChatInput({ onSend, isStreaming }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmedLength = value.trim().length;
  const isOverLimit = trimmedLength > MESSAGE_MAX_LENGTH;
  const showCharCount = trimmedLength >= CHAR_COUNT_THRESHOLD;

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || isOverLimit) return;
    onSend(trimmed);
    setValue("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-1.5 rounded-2xl border bg-card px-2 py-1.5 shadow-sm focus-within:ring-1 focus-within:ring-ring sm:gap-2 sm:px-3 sm:py-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <TextareaAutosize
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Ouroboros..."
            maxRows={6}
            className="flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />

          <Button
            type="button"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            disabled={!value.trim() || isStreaming || isOverLimit}
            onClick={handleSend}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-1.5 flex items-center justify-between sm:mt-2">
          <p className="flex-1 text-center text-[10px] text-muted-foreground sm:text-xs">
            Ouroboros is AI and can make mistakes. Please double-check responses.
          </p>
          {showCharCount && (
            <span
              className={`text-[10px] tabular-nums sm:text-xs ${
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {trimmedLength.toLocaleString()}/{MESSAGE_MAX_LENGTH.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
