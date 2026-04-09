import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneInput } from "./PhoneInput";
import { OtpVerificationForm } from "./OtpVerificationForm";
import type { CountryCode } from "@/types/auth";
import { formatE164, getDefaultCountry, validatePhoneNumber } from "@/utils/phoneUtils";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";

export function SignUpForm({ onToggle }: { onToggle: () => void }) {
  const { signup, status, error, clearError, pendingPhone } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(getDefaultCountry());
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    username: false,
    phone: false,
    password: false,
    confirm: false,
  });

  const isLoading = status === "loading";
  const isPendingOtp = status === "pending_otp";

  const passwordRules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const isFirstNameValid = firstName.trim().length >= 1 && firstName.trim().length <= 50;
  const isLastNameValid = lastName.trim().length >= 1 && lastName.trim().length <= 50;
  const isUsernameValid = /^[a-zA-Z0-9_]{3,50}$/.test(username);
  const isPhoneValid = validatePhoneNumber(phoneNumber);

  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isUsernameValid &&
    isPhoneValid &&
    isPasswordValid &&
    password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!isFormValid) return;

    const e164Phone = formatE164(countryCode.dialCode, phoneNumber);

    try {
      await signup({
        username,
        phone_number: e164Phone,
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
    } catch {
      // Error handled by context
    }
  };

  if (isPendingOtp && pendingPhone) {
    return (
      <OtpVerificationForm phoneNumber={pendingPhone} onBack={() => window.location.reload()} />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-5 sm:max-w-sm">
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create an ORB Account!</h1>
        <p className="text-[13px] text-muted-foreground sm:text-sm">
          Enter your details below to get started with ORB.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="first-name" className="text-sm font-medium">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                clearError();
              }}
              onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
              disabled={isLoading}
              placeholder="Alice"
              autoComplete="given-name"
              className={`h-10 w-full rounded-lg border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${touched.firstName && !isFirstNameValid ? "border-destructive" : "border-input"}`}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="last-name" className="text-sm font-medium">
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                clearError();
              }}
              onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
              disabled={isLoading}
              placeholder="Smith"
              autoComplete="family-name"
              className={`h-10 w-full rounded-lg border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${touched.lastName && !isLastNameValid ? "border-destructive" : "border-input"}`}
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearError();
            }}
            onBlur={() => setTouched((t) => ({ ...t, username: true }))}
            disabled={isLoading}
            placeholder="like Maugus or IAMTOMATO"
            autoComplete="username"
            className={`h-10 w-full rounded-lg border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${touched.username && !isUsernameValid ? "border-destructive" : "border-input"}`}
          />
          {touched.username && !isUsernameValid && (
            <p className="text-xs text-destructive">
              3-50 characters, letters, numbers, and underscores only
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="phone-input" className="text-sm font-medium">
            Phone Number
          </label>
          <PhoneInput
            value={phoneNumber}
            countryCode={countryCode}
            onChange={(v) => {
              setPhoneNumber(v);
              clearError();
            }}
            onCountryChange={setCountryCode}
            error={touched.phone && !isPhoneValid ? "Enter a valid phone number" : undefined}
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              disabled={isLoading}
              placeholder="Create a password"
              autoComplete="new-password"
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

          {touched.password && (
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              {(
                [
                  { key: "minLength", label: "8+ characters" },
                  { key: "hasUpper", label: "Uppercase letter" },
                  { key: "hasLower", label: "Lowercase letter" },
                  { key: "hasNumber", label: "Number" },
                  { key: "hasSpecial", label: "Special character" },
                ] as const
              ).map(({ key, label }) => (
                <div
                  key={key}
                  className={`flex items-center gap-1 ${passwordRules[key] ? "text-green-600" : "text-muted-foreground"}`}
                >
                  {passwordRules[key] ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearError();
            }}
            onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
            disabled={isLoading}
            placeholder="Confirm your password"
            autoComplete="new-password"
            className={`h-10 w-full rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${touched.confirm && password !== confirmPassword ? "border-destructive" : "border-input"}`}
          />
          {touched.confirm && password !== confirmPassword && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Sign in
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
