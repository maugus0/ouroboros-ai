import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ChatProvider } from "@/contexts/ChatContext";
import { DiscoveryProvider } from "@/contexts/DiscoveryContext";
import { ProjectProvider } from "@/contexts/ProjectContext";

export default function DashboardLayout() {
  return (
    <ProjectProvider>
      <ChatProvider>
        <DiscoveryProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-svh overflow-hidden">
              <DashboardHeader />
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <Outlet />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </DiscoveryProvider>
      </ChatProvider>
    </ProjectProvider>
  );
}
