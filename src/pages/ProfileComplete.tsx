import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileCompletionForm } from "@/components/auth/ProfileCompletionForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";

export default function ProfileComplete() {
  const { status, isLoading, user } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  const fullName = user ? `${user.first_name} ${user.last_name}` : null;

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex min-h-svh max-w-2xl flex-col px-5 py-4 sm:justify-center sm:px-8 sm:py-6">
        {/* Header */}
        <div className="mb-3 text-center sm:mb-4">
          <div className="mb-3 flex justify-center sm:mb-4">
            <img
              src="/orb.jpg"
              alt=""
              className="h-12 w-12 rounded-2xl object-cover shadow-lg ring-1 ring-border/50 sm:h-14 sm:w-14"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome, {fullName || "there"}!
          </h1>

          <p className="mt-1.5 text-sm font-medium text-foreground/70 sm:mt-2 sm:text-base">
            Let&apos;s get you started with ORB.
          </p>
        </div>

        <Separator className="mb-3 sm:mb-4" />

        <p className="mb-3 text-center text-sm leading-relaxed text-muted-foreground sm:mb-4 sm:whitespace-nowrap sm:text-[15px]">
          Complete your profile with us so that our AI agents can find the best matches for you.
        </p>

        {/* Form */}
        <ProfileCompletionForm />
      </div>
    </div>
  );
}
