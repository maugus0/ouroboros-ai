import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useChat } from "@/contexts/ChatContext";
import { getErrorMessage } from "@/api/client";
import { CHAT_TITLE_MAX_LENGTH } from "@/types/chat.types";
import type { Chat } from "@/types/chat.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CharCounter } from "@/components/ui/CharCounter";

interface RenameChatDialogProps {
  chat: Chat | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameChatDialog({ chat, open, onOpenChange }: RenameChatDialogProps) {
  const { renameChat } = useChat();
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (chat) {
      setTitle(chat.title ?? "");
    }
  }, [chat]);

  const trimmedTitle = title.trim();
  const isTitleValid = trimmedTitle.length > 0 && trimmedTitle.length <= CHAT_TITLE_MAX_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chat || !isTitleValid) return;

    setIsSubmitting(true);
    try {
      await renameChat(chat.id, title.trim());
      toast.success("Chat renamed");
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Rename Chat</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Give your conversation a new name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rename-chat-title" className="text-xs sm:text-sm">
                Title
              </Label>
              <CharCounter value={title} maxLength={CHAT_TITLE_MAX_LENGTH} />
            </div>
            <Input
              id="rename-chat-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={CHAT_TITLE_MAX_LENGTH + 10}
              className="text-sm"
              autoFocus
              required
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="sm:size-default"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="sm:size-default"
              disabled={!isTitleValid || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
