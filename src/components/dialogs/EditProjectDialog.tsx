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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const selectedIcon = ICONS.find((i) => i.id === icon);
  const IconComponent = selectedIcon?.Icon ?? Folder;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: color + "20", color }}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>Update project details and appearance.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-project-name">Name</Label>
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
              id="edit-project-name"
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
              <Label htmlFor="edit-project-description">Description</Label>
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
              id="edit-project-description"
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={PROJECT_DESCRIPTION_MAX_LENGTH + 10}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? "scale-110 border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-1.5">
              {ICONS.map(({ id, Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                    icon === id
                      ? "border-foreground bg-accent"
                      : "border-transparent hover:bg-accent"
                  }`}
                  onClick={() => setIcon(id)}
                  title={label}
                >
                  <Icon className="h-4 w-4" style={{ color: icon === id ? color : undefined }} />
                </button>
              ))}
              <button
                type="button"
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-xs transition-colors ${
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
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {project.chat_count} {project.chat_count === 1 ? "chat" : "chats"}
                </span>
                <span>Created {formatDate(project.created_at)}</span>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isNameValid || !isDescriptionValid || !hasChanges || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
