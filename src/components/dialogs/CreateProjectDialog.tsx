import { useState } from "react";
import { toast } from "sonner";
import { useProjects } from "@/contexts/ProjectContext";
import { getErrorMessage } from "@/api/client";
import { PROJECT_NAME_MAX_LENGTH, PROJECT_DESCRIPTION_MAX_LENGTH } from "@/types/chat.types";
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
import { Textarea } from "@/components/ui/textarea";

const COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
];

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const { createProject } = useProjects();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const isNameValid = trimmedName.length > 0 && trimmedName.length <= PROJECT_NAME_MAX_LENGTH;
  const isDescriptionValid = trimmedDescription.length <= PROJECT_DESCRIPTION_MAX_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameValid || !isDescriptionValid) return;

    setIsSubmitting(true);
    try {
      await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
        color,
      });
      toast.success("Project created");
      onOpenChange(false);
      setName("");
      setDescription("");
      setColor(COLORS[0]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName("");
      setDescription("");
      setColor(COLORS[0]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Create Project</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Create a project to organize your chats into groups.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="project-name" className="text-xs sm:text-sm">
                Name
              </Label>
              {trimmedName.length > PROJECT_NAME_MAX_LENGTH * 0.8 && (
                <span
                  className={`text-[10px] tabular-nums sm:text-xs ${
                    trimmedName.length > PROJECT_NAME_MAX_LENGTH
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {trimmedName.length}/{PROJECT_NAME_MAX_LENGTH}
                </span>
              )}
            </div>
            <Input
              id="project-name"
              placeholder="e.g., Singapore Scholarships"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={PROJECT_NAME_MAX_LENGTH + 10}
              className="text-sm"
              autoFocus
              required
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="project-description" className="text-xs sm:text-sm">
                Description (optional)
              </Label>
              {trimmedDescription.length > PROJECT_DESCRIPTION_MAX_LENGTH * 0.8 && (
                <span
                  className={`text-[10px] tabular-nums sm:text-xs ${
                    trimmedDescription.length > PROJECT_DESCRIPTION_MAX_LENGTH
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {trimmedDescription.length}/{PROJECT_DESCRIPTION_MAX_LENGTH}
                </span>
              )}
            </div>
            <Textarea
              id="project-description"
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={PROJECT_DESCRIPTION_MAX_LENGTH + 10}
              className="text-sm"
              rows={2}
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm">Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-6 w-6 shrink-0 rounded-full border-2 transition-transform hover:scale-110 sm:h-7 sm:w-7 ${
                    color === c ? "scale-110 border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
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
              disabled={!isNameValid || !isDescriptionValid || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
