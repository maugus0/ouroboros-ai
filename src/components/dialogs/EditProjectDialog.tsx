import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Folder } from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import { getErrorMessage } from "@/api/client";
import { formatDate } from "@/lib/utils";
import { PROJECT_NAME_MAX_LENGTH, PROJECT_DESCRIPTION_MAX_LENGTH } from "@/types/chat.types";
import type { Project } from "@/types/chat.types";
import {
  PROJECT_COLORS,
  PROJECT_ICONS,
  DEFAULT_PROJECT_COLOR,
  getProjectIcon,
} from "@/lib/projectTheme";
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
import { Separator } from "@/components/ui/separator";
import { CharCounter } from "@/components/ui/CharCounter";

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
  const { updateProject } = useProjects();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(DEFAULT_PROJECT_COLOR);
  const [icon, setIcon] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description ?? "");
      setColor(project.color ?? DEFAULT_PROJECT_COLOR);
      setIcon(project.icon);
    }
  }, [project]);

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const isNameValid = trimmedName.length > 0 && trimmedName.length <= PROJECT_NAME_MAX_LENGTH;
  const isDescriptionValid = trimmedDescription.length <= PROJECT_DESCRIPTION_MAX_LENGTH;

  const hasChanges =
    project &&
    (trimmedName !== project.name ||
      trimmedDescription !== (project.description ?? "") ||
      color !== (project.color ?? DEFAULT_PROJECT_COLOR) ||
      icon !== project.icon);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !isNameValid || !isDescriptionValid) return;

    setIsSubmitting(true);
    try {
      await updateProject(project.id, {
        name: trimmedName,
        description: trimmedDescription || undefined,
        color,
        icon: icon ?? undefined,
      });
      toast.success("Project updated");
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const IconComponent = getProjectIcon(icon);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] overflow-hidden sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10"
              style={{ backgroundColor: color + "20", color }}
            >
              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="truncate text-base sm:text-lg">Edit Project</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Update project details and appearance.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-project-name" className="text-xs sm:text-sm">
                Name
              </Label>
              <CharCounter value={name} maxLength={PROJECT_NAME_MAX_LENGTH} />
            </div>
            <Input
              id="edit-project-name"
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
              <Label htmlFor="edit-project-description" className="text-xs sm:text-sm">
                Description
              </Label>
              <CharCounter value={description} maxLength={PROJECT_DESCRIPTION_MAX_LENGTH} />
            </div>
            <Textarea
              id="edit-project-description"
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
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-6 w-6 shrink-0 rounded-full border-2 transition-transform hover:scale-110 sm:h-7 sm:w-7 ${
                    color === c ? "scale-110 border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm">Icon</Label>
            <div className="flex flex-wrap gap-1">
              {PROJECT_ICONS.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors sm:h-8 sm:w-8 ${
                    icon === id
                      ? "border-foreground bg-accent"
                      : "border-transparent hover:bg-accent"
                  }`}
                  onClick={() => setIcon(id)}
                  title={label}
                >
                  <Icon
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    style={{ color: icon === id ? color : undefined }}
                  />
                </button>
              ))}
              <button
                type="button"
                className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs transition-colors sm:h-8 sm:w-8 ${
                  icon === null
                    ? "border-foreground bg-accent"
                    : "border-transparent hover:bg-accent"
                }`}
                onClick={() => setIcon(null)}
                title="No icon"
              >
                <span className="text-muted-foreground">—</span>
              </button>
            </div>
          </div>

          {project && (
            <>
              <Separator />
              <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-muted-foreground sm:text-xs">
                <span>
                  {project.chat_count} {project.chat_count === 1 ? "chat" : "chats"}
                </span>
                <span className="truncate">Created {formatDate(project.created_at)}</span>
              </div>
            </>
          )}

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
              disabled={!isNameValid || !isDescriptionValid || !hasChanges || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
