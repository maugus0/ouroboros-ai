import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, status } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (status === "pending_profile" && location.pathname !== "/profile/complete") {
    return <Navigate to="/profile/complete" replace />;
  }

  return <Outlet />;
}
