import { useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquarePlus,
  MessageSquare,
  User,
  GraduationCap,
  Trophy,
  ClipboardList,
  Settings,
  HelpCircle,
  Brain,
  MoreHorizontal,
  Trash2,
  Pencil,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

function groupChatsByDate(
  chats: ReturnType<typeof useChat>["chats"]
): { label: string; chats: typeof chats }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 86400000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 86400000);

  const groups: { label: string; chats: typeof chats }[] = [
    { label: "Today", chats: [] },
    { label: "Yesterday", chats: [] },
    { label: "Previous 7 days", chats: [] },
    { label: "Previous 30 days", chats: [] },
    { label: "Older", chats: [] },
  ];

  for (const chat of chats) {
    const d = new Date(chat.updatedAt);
    if (d >= today) groups[0].chats.push(chat);
    else if (d >= yesterday) groups[1].chats.push(chat);
    else if (d >= sevenDaysAgo) groups[2].chats.push(chat);
    else if (d >= thirtyDaysAgo) groups[3].chats.push(chat);
    else groups[4].chats.push(chat);
  }

  return groups.filter((g) => g.chats.length > 0);
}

const navItems = [
  { label: "Profile", icon: User, path: "/dashboard/profile" },
  { label: "Programs", icon: GraduationCap, path: "/dashboard/programs" },
  { label: "Scholarships", icon: Trophy, path: "/dashboard/scholarships" },
  { label: "Applications", icon: ClipboardList, path: "/dashboard/applications" },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { chats, activeChatId, createChat, deleteChat, setActiveChatId } = useChat();

  const chatGroups = groupChatsByDate(chats);

  const handleNewChat = () => {
    createChat();
    navigate("/dashboard");
  };

  const handleChatClick = (chatId: string) => {
    setActiveChatId(chatId);
    navigate(`/dashboard/chat/${chatId}`);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img src="/orb.jpg" alt="" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-lg font-semibold tracking-tight">OuroborosAI</span>
        </div>
      </SidebarHeader>

      <div className="px-3 pb-2">
        <Button onClick={handleNewChat} className="w-full justify-start gap-2" variant="outline">
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <SidebarContent>
        {/* Chat history */}
        {chatGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      isActive={activeChatId === chat.id}
                      onClick={() => handleChatClick(chat.id)}
                      tooltip={chat.title}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <MoreHorizontal className="h-4 w-4" />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>
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

        <SidebarSeparator />

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Utilities */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/dashboard/settings"}
                  onClick={() => navigate("/dashboard/settings")}
                  tooltip="Settings"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/dashboard/assessments"}
                  onClick={() => navigate("/dashboard/assessments")}
                  tooltip="Assessments"
                >
                  <Brain className="h-4 w-4" />
                  <span>Assessments</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/dashboard/help"}
                  onClick={() => navigate("/dashboard/help")}
                  tooltip="Get Help"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Get Help</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-xl">
                    <AvatarImage src="/shadcn.jpg" />
                    <AvatarFallback>
                      {user ? getInitials(`${user.first_name} ${user.last_name}`) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">
                      {user ? `${user.first_name} ${user.last_name}` : "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email ?? user?.phone_number ?? ""}
                    </span>
                  </div>
                  <MoreHorizontal className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-dropdown-menu-trigger-width]">
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="h-9 w-9 rounded-xl">
                    <AvatarImage src="/shadcn.jpg" />
                    <AvatarFallback>
                      {user ? getInitials(`${user.first_name} ${user.last_name}`) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold">
                      {user ? `${user.first_name} ${user.last_name}` : "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email ?? user?.phone_number ?? ""}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/billing")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
