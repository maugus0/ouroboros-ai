import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneInput } from "./PhoneInput";
import { OtpVerificationForm } from "./OtpVerificationForm";
import { MfaVerificationForm } from "./MfaVerificationForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import type { CountryCode } from "@/types/auth";
import { formatE164, getDefaultCountry, validatePhoneNumber } from "@/utils/phoneUtils";
import { Loader2, Eye, EyeOff } from "lucide-react";

type LoginMode = "phone" | "username";

export function LoginForm({ onToggle }: { onToggle: () => void }) {
  const { login, status, error, clearError, pendingPhone, pendingMfaPhone } = useAuth();

  const [mode, setMode] = useState<LoginMode>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(getDefaultCountry());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const isLoading = status === "loading";
  const isPendingOtp = status === "pending_otp";
  const isPendingMfa = status === "pending_mfa";

  const isIdentifierValid =
    mode === "phone" ? validatePhoneNumber(phoneNumber) : username.trim().length >= 3;
  const isFormValid = isIdentifierValid && password.length > 0;

  if (isPendingMfa && pendingMfaPhone) {
    return (
      <MfaVerificationForm maskedPhone={pendingMfaPhone} onBack={() => window.location.reload()} />
    );
  }

  if (isPendingOtp && pendingPhone) {
    return (
      <OtpVerificationForm phoneNumber={pendingPhone} onBack={() => window.location.reload()} />
    );
  }

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  const switchMode = (next: LoginMode) => {
    setMode(next);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!isFormValid) return;

    const payload =
      mode === "phone"
        ? { phone_number: formatE164(countryCode.dialCode, phoneNumber), password }
        : { username: username.trim(), password };

    try {
      await login(payload);
    } catch {
      // Error handled by context
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-5 sm:max-w-sm">
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back!</h1>
        <p className="text-[13px] text-muted-foreground sm:text-sm">
          Sign in to ORB with your phone number or username.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {mode === "phone" ? "Phone Number" : "Username"}
            </label>
            <button
              type="button"
              onClick={() => switchMode(mode === "phone" ? "username" : "phone")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Use {mode === "phone" ? "username" : "phone"} instead
            </button>
          </div>

          {mode === "phone" ? (
            <PhoneInput
              value={phoneNumber}
              countryCode={countryCode}
              onChange={(v) => {
                setPhoneNumber(v);
                clearError();
              }}
              onCountryChange={setCountryCode}
              disabled={isLoading}
            />
          ) : (
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearError();
              }}
              disabled={isLoading}
              placeholder="Enter your username"
              autoComplete="username"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              disabled={isLoading}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Create an account
        </button>
      </p>

      <p className="whitespace-nowrap text-center text-[11px] text-muted-foreground">
        By continuing, you agree to our{" "}
        <a href="#" className="underline underline-offset-2 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-2 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
