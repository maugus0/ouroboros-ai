import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderPlus,
  ChevronRight,
  Folder,
  MoreHorizontal,
  Pencil,
  Trash2,
  MessageSquare,
  MessageSquarePlus,
} from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import { useChat } from "@/contexts/ChatContext";
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
import { RenameProjectDialog } from "@/components/dialogs/RenameProjectDialog";
import type { Project } from "@/types/chat.types";

interface ProjectListProps {
  onChatClick: (chatId: string) => void;
  activeChatId: string | null;
}

export function ProjectList({ onChatClick, activeChatId }: ProjectListProps) {
  const navigate = useNavigate();
  const { projects, deleteProject } = useProjects();
  const { chats, createChat } = useChat();
  const [createOpen, setCreateOpen] = useState(false);
  const [renameProject, setRenameProject] = useState<Project | null>(null);

  const getProjectChats = (projectId: string) => chats.filter((c) => c.project_id === projectId);

  const handleNewChatInProject = async (projectId: string) => {
    await createChat(undefined, projectId);
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
                return (
                  <Collapsible key={project.id} asChild defaultOpen={false}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={project.name}>
                          <Folder
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
                          <DropdownMenuItem onClick={() => handleNewChatInProject(project.id)}>
                            <MessageSquarePlus className="mr-2 h-4 w-4" />
                            New Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setRenameProject(project)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteProject(project.id)}
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
      <RenameProjectDialog
        project={renameProject}
        open={renameProject !== null}
        onOpenChange={(open) => !open && setRenameProject(null)}
      />
    </>
  );
}
