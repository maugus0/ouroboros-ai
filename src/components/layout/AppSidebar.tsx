import { useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquarePlus,
  User,
  GraduationCap,
  Trophy,
  ClipboardList,
  Settings,
  HelpCircle,
  Brain,
  MoreHorizontal,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getInitials } from "@/lib/utils";
import { StarredChats } from "./sidebar/StarredChats";
import { ProjectList } from "./sidebar/ProjectList";
import { ChatHistory } from "./sidebar/ChatHistory";

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
  const { activeChatId, createChat, setActiveChatId } = useChat();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleNewChat = async () => {
    await createChat();
    closeMobileSidebar();
  };

  const handleChatClick = (chatId: string) => {
    setActiveChatId(chatId);
    navigate(`/dashboard/chat/${chatId}`);
    closeMobileSidebar();
  };

  const userName = user ? `${user.first_name} ${user.last_name}`.trim() : "User";
  const userIdentifier = user?.email ?? user?.phone_number ?? "";

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
        {/* Starred Chats */}
        <StarredChats onChatClick={handleChatClick} activeChatId={activeChatId} />

        {/* Projects */}
        <ProjectList onChatClick={handleChatClick} activeChatId={activeChatId} />

        <SidebarSeparator />

        {/* Chat History (unassigned chats) */}
        <ChatHistory onChatClick={handleChatClick} activeChatId={activeChatId} />

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
                    onClick={() => {
                      navigate(item.path);
                      closeMobileSidebar();
                    }}
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
                  onClick={() => {
                    navigate("/dashboard/settings");
                    closeMobileSidebar();
                  }}
                  tooltip="Settings"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/dashboard/assessments"}
                  onClick={() => {
                    navigate("/dashboard/assessments");
                    closeMobileSidebar();
                  }}
                  tooltip="Assessments"
                >
                  <Brain className="h-4 w-4" />
                  <span>Assessments</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/dashboard/help"}
                  onClick={() => {
                    navigate("/dashboard/help");
                    closeMobileSidebar();
                  }}
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
                <SidebarMenuButton size="lg" className="w-full">
                  <Avatar className="h-8 w-8 shrink-0 rounded-xl">
                    <AvatarImage src="/shadcn.jpg" />
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate font-semibold">{userName}</span>
                        </TooltipTrigger>
                        {userName.length > 18 && (
                          <TooltipContent side="top" align="start">
                            {userName}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate text-xs text-muted-foreground">
                            {userIdentifier}
                          </span>
                        </TooltipTrigger>
                        {userIdentifier.length > 22 && (
                          <TooltipContent side="top" align="start">
                            {userIdentifier}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <MoreHorizontal className="ml-auto h-4 w-4 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-dropdown-menu-trigger-width]">
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="h-9 w-9 shrink-0 rounded-xl">
                    <AvatarImage src="/shadcn.jpg" />
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-sm font-semibold" title={userName}>
                      {userName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground" title={userIdentifier}>
                      {userIdentifier}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/dashboard/settings");
                    closeMobileSidebar();
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/dashboard/billing");
                    closeMobileSidebar();
                  }}
                >
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
