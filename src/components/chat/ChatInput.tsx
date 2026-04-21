import { useState, useRef, type ChangeEvent, type KeyboardEvent, type RefObject } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUp, Loader2, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CharCounter } from "@/components/ui/CharCounter";
import { getErrorMessage } from "@/api/client";
import { workflowsApi } from "@/api/workflowsApi";
import { MESSAGE_MAX_LENGTH } from "@/types/chat.types";

interface ChatInputProps {
  onSend: (content: string) => Promise<void> | void;
  onAssistantNotice: (content: string, metadata?: Record<string, unknown>) => Promise<void> | void;
  isStreaming: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function ChatInput({
  onSend,
  onAssistantNotice,
  isStreaming,
  fileInputRef,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isOverLimit = value.trim().length > MESSAGE_MAX_LENGTH;

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || isOverLimit || isUploading) return;

    try {
      await Promise.resolve(onSend(trimmed));
      setValue("");
      textareaRef.current?.focus();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const openFilePicker = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromise = workflowsApi.uploadProfileDocument({
        file,
        intent: "profile_completion",
        documentType: "cv",
        runGapAnalysis: true,
      });

      toast.promise(uploadPromise, {
        loading: `Uploading ${file.name}...`,
        success: () => `${file.name} uploaded for profile parsing`,
        error: (error) => getErrorMessage(error),
      });
      const uploadResult = await uploadPromise;

      const parsedProfileId = uploadResult?.data?.profile_id;
      const clarificationQueue = uploadResult?.data?.profile_data?.clarification_queue;
      const extractionSummary = uploadResult?.data?.profile_data?.extraction_summary;
      const confirmationFields = Array.isArray(extractionSummary?.needs_confirmation_fields)
        ? extractionSummary.needs_confirmation_fields
        : [];
      const firstClarification = Array.isArray(clarificationQueue)
        ? clarificationQueue[0]
        : undefined;

      let followUpPrompt = "";
      const missingFields: string[] = [];
      if (firstClarification?.question) {
        followUpPrompt = `Got your file ${file.name}. ${firstClarification.question}`;
        if (firstClarification.field) missingFields.push(firstClarification.field);
      } else if (firstClarification?.field) {
        followUpPrompt = `Got your file ${file.name}. Quick check: what is your ${firstClarification.field.replace(/_/g, " ")}?`;
        missingFields.push(firstClarification.field);
      } else if (confirmationFields.length > 0) {
        followUpPrompt = `Got your file ${file.name}. One quick confirmation: what is your ${confirmationFields[0].replace(/_/g, " ")}?`;
        missingFields.push(confirmationFields[0]);
      } else if (parsedProfileId) {
        followUpPrompt = `Got your file ${file.name}. Parsing is complete. If all looks good, we can continue to scholarship or program discovery.`;
      } else {
        followUpPrompt = `Got your file ${file.name}. Parsing is complete. If all looks good, we can continue to scholarship or program discovery.`;
      }

      await Promise.resolve(
        onAssistantNotice(followUpPrompt, {
          source: "profile_upload_followup",
          intent: "profile_completion",
          notice_title: "Profile Completion",
          uploaded_file_name: file.name,
          profile_gate: {
            allowed: false,
            reason: "profile_incomplete",
            missing_fields: missingFields,
            missing_required_fields: missingFields,
            missing_optional_fields: [],
          },
        })
      );
    } catch {
      // toast.promise already exposes the failure state.
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="shrink-0 border-t bg-background px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-1.5 rounded-2xl border bg-card px-2 py-1.5 shadow-sm focus-within:ring-1 focus-within:ring-ring sm:gap-2 sm:px-3 sm:py-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Upload CV or supporting document"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={openFilePicker}
            disabled={isUploading}
            aria-label="Upload CV or supporting document"
            title="Upload CV or supporting document"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
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
            disabled={!value.trim() || isStreaming || isOverLimit || isUploading}
            onClick={() => {
              void handleSend();
            }}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-1.5 flex flex-col gap-1 sm:mt-2">
          <div className="flex items-start justify-end gap-3">
            <CharCounter
              value={value}
              maxLength={MESSAGE_MAX_LENGTH}
              threshold={0.95}
              className="shrink-0"
            />
          </div>
          <p className="text-center text-[10px] text-muted-foreground sm:text-xs">
            Ouroboros is AI and can make mistakes. Please double-check responses.
          </p>
        </div>
      </div>
    </div>
  );
}
