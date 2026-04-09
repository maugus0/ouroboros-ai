import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileCompletionForm } from "@/components/auth/ProfileCompletionForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ProfileComplete() {
  const { status, isLoading, user } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-6 sm:py-8">
      <div className="mb-5 flex flex-col items-center gap-1.5 sm:mb-6">
        <img
          src="/orb.jpg"
          alt=""
          className="h-12 w-12 rounded-xl object-cover shadow-md ring-1 ring-border sm:h-14 sm:w-14"
        />
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Welcome, {user?.first_name || "there"}!
        </h1>
        <p className="max-w-sm text-center text-xs text-muted-foreground sm:text-sm">
          Complete your profile so our AI agents can find the best matches for you.
        </p>
      </div>

      <ProfileCompletionForm />
    </div>
  );
}
