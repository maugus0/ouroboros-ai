import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useProjects } from "@/contexts/ProjectContext";
import { getErrorMessage } from "@/api/client";
import { PROJECT_NAME_MAX_LENGTH } from "@/types/chat.types";
import type { Project } from "@/types/chat.types";
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

interface RenameProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameProjectDialog({ project, open, onOpenChange }: RenameProjectDialogProps) {
  const { updateProject } = useProjects();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
    }
  }, [project]);

  const trimmedName = name.trim();
  const isNameValid = trimmedName.length > 0 && trimmedName.length <= PROJECT_NAME_MAX_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !isNameValid) return;

    setIsSubmitting(true);
    try {
      await updateProject(project.id, { name: name.trim() });
      toast.success("Project renamed");
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
          <DialogTitle>Rename Project</DialogTitle>
          <DialogDescription>Give your project a new name.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rename-project-name">Name</Label>
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
              id="rename-project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={PROJECT_NAME_MAX_LENGTH + 10}
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isNameValid || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
