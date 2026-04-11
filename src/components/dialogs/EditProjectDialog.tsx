import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Folder,
  GraduationCap,
  Briefcase,
  BookOpen,
  FileText,
  Globe,
  Heart,
  Lightbulb,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import { getErrorMessage } from "@/api/client";
import { formatDate } from "@/lib/utils";
import { PROJECT_NAME_MAX_LENGTH, PROJECT_DESCRIPTION_MAX_LENGTH } from "@/types/chat.types";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

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

const ICONS = [
  { id: "folder", Icon: Folder, label: "Folder" },
  { id: "graduation-cap", Icon: GraduationCap, label: "Education" },
  { id: "briefcase", Icon: Briefcase, label: "Work" },
  { id: "book-open", Icon: BookOpen, label: "Research" },
  { id: "file-text", Icon: FileText, label: "Documents" },
  { id: "globe", Icon: Globe, label: "Global" },
  { id: "heart", Icon: Heart, label: "Favorites" },
  { id: "lightbulb", Icon: Lightbulb, label: "Ideas" },
  { id: "star", Icon: Star, label: "Important" },
  { id: "target", Icon: Target, label: "Goals" },
  { id: "users", Icon: Users, label: "Collaboration" },
  { id: "zap", Icon: Zap, label: "Quick" },
];

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
  const { updateProject } = useProjects();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description ?? "");
      setColor(project.color ?? COLORS[0]);
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
      color !== (project.color ?? COLORS[0]) ||
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

  const selectedIcon = ICONS.find((i) => i.id === icon);
  const IconComponent = selectedIcon?.Icon ?? Folder;

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
              {COLORS.map((c) => (
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
              {ICONS.map(({ id, Icon, label }) => (
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
