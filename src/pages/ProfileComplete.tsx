import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileCompletionForm } from "@/components/auth/ProfileCompletionForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ProfileComplete() {
  const { status, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-8">
      <ProfileCompletionForm />
    </div>
  );
}
