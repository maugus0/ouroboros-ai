import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import ProgramsPage from "@/pages/ProgramsPage";
import ScholarshipsPage from "@/pages/ScholarshipsPage";
import ApplicationsPage from "@/pages/ApplicationsPage";
import SettingsPage from "@/pages/SettingsPage";
import GetHelpPage from "@/pages/GetHelpPage";
import AssessmentsPage from "@/pages/AssessmentsPage";
import BillingPage from "@/pages/BillingPage";
import ProfileComplete from "@/pages/ProfileComplete";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/profile/complete" element={<ProfileComplete />} />
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<ChatPage />} />
                    <Route path="/dashboard/chat/:chatId" element={<ChatPage />} />
                    <Route path="/dashboard/profile" element={<ProfilePage />} />
                    <Route path="/dashboard/programs" element={<ProgramsPage />} />
                    <Route path="/dashboard/scholarships" element={<ScholarshipsPage />} />
                    <Route path="/dashboard/applications" element={<ApplicationsPage />} />
                    <Route path="/dashboard/settings" element={<SettingsPage />} />
                    <Route path="/dashboard/help" element={<GetHelpPage />} />
                    <Route path="/dashboard/assessments" element={<AssessmentsPage />} />
                    <Route path="/dashboard/billing" element={<BillingPage />} />
                  </Route>
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
