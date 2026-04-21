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
  type LucideIcon,
} from "lucide-react";

export const PROJECT_COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
] as const;

export const DEFAULT_PROJECT_COLOR = PROJECT_COLORS[0];

export interface ProjectIconConfig {
  id: string;
  icon: LucideIcon;
  label: string;
}

export const PROJECT_ICONS: ProjectIconConfig[] = [
  { id: "folder", icon: Folder, label: "Folder" },
  { id: "graduation-cap", icon: GraduationCap, label: "Education" },
  { id: "briefcase", icon: Briefcase, label: "Work" },
  { id: "book-open", icon: BookOpen, label: "Research" },
  { id: "file-text", icon: FileText, label: "Documents" },
  { id: "globe", icon: Globe, label: "Global" },
  { id: "heart", icon: Heart, label: "Favorites" },
  { id: "lightbulb", icon: Lightbulb, label: "Ideas" },
  { id: "star", icon: Star, label: "Important" },
  { id: "target", icon: Target, label: "Goals" },
  { id: "users", icon: Users, label: "Collaboration" },
  { id: "zap", icon: Zap, label: "Quick" },
];

export function getProjectIcon(iconId: string | null): LucideIcon {
  if (!iconId) return Folder;
  const found = PROJECT_ICONS.find((i) => i.id === iconId);
  return found?.icon ?? Folder;
}

export function getProjectIconConfig(iconId: string | null): ProjectIconConfig | undefined {
  if (!iconId) return undefined;
  return PROJECT_ICONS.find((i) => i.id === iconId);
}
