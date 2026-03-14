import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const pageTitles: Record<string, string> = {
  "/dashboard": "Chat",
  "/dashboard/profile": "Profile",
  "/dashboard/programs": "Programs",
  "/dashboard/scholarships": "Scholarships",
  "/dashboard/applications": "Applications",
  "/dashboard/settings": "Settings",
};

export function DashboardHeader() {
  const location = useLocation();

  const isChatPage =
    location.pathname === "/dashboard" || location.pathname.startsWith("/dashboard/chat/");

  const title = isChatPage ? "Chat" : (pageTitles[location.pathname] ?? "OuroborosAI");

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="text-sm font-medium">{title}</h1>
    </header>
  );
}
