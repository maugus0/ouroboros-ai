import { useState } from "react";
import {
  FolderPlus,
  ChevronRight,
  Folder,
  MoreHorizontal,
  Settings,
  Trash2,
  MessageSquare,
  MessageSquarePlus,
  Info,
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
import { toast } from "sonner";
import { useProjects } from "@/contexts/ProjectContext";
import { useChat } from "@/contexts/ChatContext";
import { getErrorMessage } from "@/api/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateProjectDialog } from "@/components/dialogs/CreateProjectDialog";
import { EditProjectDialog } from "@/components/dialogs/EditProjectDialog";
import { ProjectDetailsDialog } from "@/components/dialogs/ProjectDetailsDialog";
import type { Project } from "@/types/chat.types";

const PROJECT_ICONS: Record<string, LucideIcon> = {
  folder: Folder,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  "book-open": BookOpen,
  "file-text": FileText,
  globe: Globe,
  heart: Heart,
  lightbulb: Lightbulb,
  star: Star,
  target: Target,
  users: Users,
  zap: Zap,
};

function getProjectIcon(iconId: string | null): LucideIcon {
  if (iconId && PROJECT_ICONS[iconId]) {
    return PROJECT_ICONS[iconId];
  }
  return Folder;
}

interface ProjectListProps {
  onChatClick: (chatId: string) => void;
  activeChatId: string | null;
}

export function ProjectList({ onChatClick, activeChatId }: ProjectListProps) {
  const { projects, deleteProject } = useProjects();
  const { chats, createChat, unassignChatsFromProject } = useChat();
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [detailsProject, setDetailsProject] = useState<Project | null>(null);

  const getProjectChats = (projectId: string) => chats.filter((c) => c.project_id === projectId);

  const handleNewChatInProject = async (projectId: string) => {
    try {
      await createChat(undefined, projectId);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      unassignChatsFromProject(id);
      toast.success("Project deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarGroupAction onClick={() => setCreateOpen(true)} title="Create Project">
          <FolderPlus className="h-4 w-4" />
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            {projects.length === 0 ? (
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCreateOpen(true)}
                  className="text-muted-foreground"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Create a project</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              projects.map((project) => {
                const projectChats = getProjectChats(project.id);
                const ProjectIcon = getProjectIcon(project.icon);
                return (
                  <Collapsible key={project.id} asChild defaultOpen={false}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={project.name}>
                          <ProjectIcon
                            className="h-4 w-4"
                            style={{ color: project.color ?? undefined }}
                          />
                          <span className="truncate">{project.name}</span>
                          <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal className="h-4 w-4" />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem onClick={() => setDetailsProject(project)}>
                            <Info className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleNewChatInProject(project.id)}>
                            <MessageSquarePlus className="mr-2 h-4 w-4" />
                            New Chat
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setEditProject(project)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {projectChats.length === 0 ? (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                onClick={() => handleNewChatInProject(project.id)}
                                className="text-muted-foreground"
                              >
                                <MessageSquarePlus className="h-3.5 w-3.5" />
                                <span>Start a chat</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ) : (
                            projectChats.map((chat) => (
                              <SidebarMenuSubItem key={chat.id}>
                                <SidebarMenuSubButton
                                  isActive={activeChatId === chat.id}
                                  onClick={() => onChatClick(chat.id)}
                                >
                                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{chat.title ?? "Untitled"}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditProjectDialog
        project={editProject}
        open={editProject !== null}
        onOpenChange={(open) => !open && setEditProject(null)}
      />
      <ProjectDetailsDialog
        project={detailsProject}
        open={detailsProject !== null}
        onOpenChange={(open) => !open && setDetailsProject(null)}
      />
    </>
  );
}
