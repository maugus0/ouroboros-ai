import { useMemo, useState } from "react";
import { MessageSquare, MoreHorizontal, Trash2, Pencil, Star, FolderInput } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useProjects } from "@/contexts/ProjectContext";
import type { Chat } from "@/types/chat.types";
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
import { RenameChatDialog } from "@/components/dialogs/RenameChatDialog";

interface ChatHistoryProps {
  onChatClick: (chatId: string) => void;
  activeChatId: string | null;
}

function groupChatsByDate(chats: Chat[]): { label: string; chats: Chat[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 86400000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 86400000);

  const groups: { label: string; chats: Chat[] }[] = [
    { label: "Today", chats: [] },
    { label: "Yesterday", chats: [] },
    { label: "Previous 7 days", chats: [] },
    { label: "Previous 30 days", chats: [] },
    { label: "Older", chats: [] },
  ];

  for (const chat of chats) {
    const d = new Date(chat.updated_at);
    if (d >= today) groups[0].chats.push(chat);
    else if (d >= yesterday) groups[1].chats.push(chat);
    else if (d >= sevenDaysAgo) groups[2].chats.push(chat);
    else if (d >= thirtyDaysAgo) groups[3].chats.push(chat);
    else groups[4].chats.push(chat);
  }

  return groups.filter((g) => g.chats.length > 0);
}

export function ChatHistory({ onChatClick, activeChatId }: ChatHistoryProps) {
  const { chats, deleteChat, toggleStar, moveToProject } = useChat();
  const { projects } = useProjects();
  const [renameChat, setRenameChat] = useState<Chat | null>(null);

  const unassignedChats = useMemo(
    () => chats.filter((c) => !c.is_starred && !c.project_id),
    [chats]
  );

  const chatGroups = useMemo(() => groupChatsByDate(unassignedChats), [unassignedChats]);

  if (chatGroups.length === 0) return null;

  return (
    <>
      {chatGroups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.chats.map((chat) => (
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
                        <Star className="mr-2 h-4 w-4" />
                        Star
                      </DropdownMenuItem>
                      {projects.length > 0 && (
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <FolderInput className="mr-2 h-4 w-4" />
                            Move to Project
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {projects.map((project) => (
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
                      <DropdownMenuItem onClick={() => setRenameChat(chat)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
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
      ))}

      <RenameChatDialog
        chat={renameChat}
        open={renameChat !== null}
        onOpenChange={(open) => !open && setRenameChat(null)}
      />
    </>
  );
}
