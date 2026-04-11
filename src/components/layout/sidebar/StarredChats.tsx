import { Star, MessageSquare, MoreHorizontal, Trash2, StarOff, FolderInput } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useProjects } from "@/contexts/ProjectContext";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StarredChatsProps {
  onChatClick: (chatId: string) => void;
  activeChatId: string | null;
}

export function StarredChats({ onChatClick, activeChatId }: StarredChatsProps) {
  const { starredChats, toggleStar, deleteChat, moveToProject } = useChat();
  const { projects } = useProjects();

  if (starredChats.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Star className="mr-1.5 h-3.5 w-3.5" />
        Starred
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {starredChats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                isActive={activeChatId === chat.id}
                onClick={() => onChatClick(chat.id)}
                tooltip={chat.title ?? "Untitled"}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{chat.title ?? "Untitled"}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal className="h-4 w-4" />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuItem onClick={() => toggleStar(chat.id)}>
                    <StarOff className="mr-2 h-4 w-4" />
                    Unstar
                  </DropdownMenuItem>
                  {projects.length > 0 && (
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <FolderInput className="mr-2 h-4 w-4" />
                        Move to Project
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {chat.project_id && (
                          <>
                            <DropdownMenuItem onClick={() => moveToProject(chat.id, null)}>
                              Remove from Project
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {projects
                          .filter((p) => p.id !== chat.project_id)
                          .map((project) => (
                            <DropdownMenuItem
                              key={project.id}
                              onClick={() => moveToProject(chat.id, project.id)}
                            >
                              <span
                                className="mr-2 h-2 w-2 rounded-full"
                                style={{ backgroundColor: project.color ?? "#6B7280" }}
                              />
                              {project.name}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => deleteChat(chat.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
