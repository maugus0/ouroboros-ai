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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a project to organize your chats into groups.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="project-name">Name</Label>
              {trimmedName.length > PROJECT_NAME_MAX_LENGTH * 0.8 && (
                <span
                  className={`text-xs tabular-nums ${
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
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="project-description">Description (optional)</Label>
              {trimmedDescription.length > PROJECT_DESCRIPTION_MAX_LENGTH * 0.8 && (
                <span
                  className={`text-xs tabular-nums ${
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
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? "scale-110 border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isNameValid || !isDescriptionValid || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
