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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Chat</DialogTitle>
          <DialogDescription>Give your conversation a new name.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rename-chat-title">Title</Label>
              {trimmedTitle.length > CHAT_TITLE_MAX_LENGTH * 0.8 && (
                <span
                  className={`text-xs tabular-nums ${
                    trimmedTitle.length > CHAT_TITLE_MAX_LENGTH
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {trimmedTitle.length}/{CHAT_TITLE_MAX_LENGTH}
                </span>
              )}
            </div>
            <Input
              id="rename-chat-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={CHAT_TITLE_MAX_LENGTH + 10}
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isTitleValid || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
