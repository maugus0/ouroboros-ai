import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-svh lg:grid lg:grid-cols-2">
      <button
        type="button"
        onClick={() => setIsSignUp((v) => !v)}
        className="absolute right-4 top-4 z-30 text-sm font-medium underline-offset-4 hover:underline sm:right-6 sm:top-5 sm:text-base md:right-8 md:top-6 lg:text-foreground"
      >
        {isSignUp ? "Login" : "Register"}
      </button>

      {/* Left panel — hero image (desktop only) */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col">
        <img
          src="/ouroboros.png"
          alt="Ouroboros"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/50"
          aria-hidden
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10 lg:p-12">
          <div className="flex items-center gap-4">
            <img
              src="/orb.jpg"
              alt=""
              className="h-14 w-14 shrink-0 rounded-full object-cover shadow-lg ring-2 ring-white/40 md:h-16 md:w-16 lg:h-20 lg:w-20"
            />
            <span className="text-2xl font-semibold tracking-tight text-white drop-shadow-sm md:text-3xl lg:text-4xl">
              OuroborosAI
            </span>
          </div>
          <blockquote className="max-w-md space-y-3 font-serif">
            <p className="text-lg leading-relaxed tracking-tight text-white/95 drop-shadow-md md:text-xl lg:text-2xl">
              &ldquo;Reduce scholarship search time from weeks to minutes through our intelligent,
              coordinated AI agents.&rdquo;
            </p>
            <footer className="text-base font-medium not-italic tracking-wide text-white/90 drop-shadow-sm md:text-lg">
              OuroborosAI
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex min-h-svh flex-col items-center justify-center px-5 py-6 sm:px-8 sm:py-10 lg:min-h-0 lg:px-10 lg:py-12">
        {/* Mobile brand header — more engaging */}
        <div className="mb-5 flex flex-col items-center gap-2 sm:mb-8 lg:hidden">
          <div className="relative">
            <img
              src="/orb.jpg"
              alt=""
              className="h-16 w-16 rounded-2xl object-cover shadow-lg ring-1 ring-border sm:h-20 sm:w-20"
            />
            <div
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">OuroborosAI</h1>
          <p className="max-w-[260px] text-center text-xs text-muted-foreground sm:max-w-xs sm:text-sm">
            Intelligent scholarship discovery & application assistance
          </p>
        </div>

        {isSignUp ? (
          <SignUpForm onToggle={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onToggle={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
}
