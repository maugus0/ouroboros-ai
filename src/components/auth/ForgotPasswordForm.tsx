import { useEffect, useRef, useState } from "react";
import { PhoneInput } from "./PhoneInput";
import type { CountryCode } from "@/types/auth";
import { formatE164, getDefaultCountry, validatePhoneNumber } from "@/utils/phoneUtils";
import { authApi, getErrorMessage } from "@/api/authApi";
import { Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2, KeyRound } from "lucide-react";

type Step = "phone" | "otp" | "password" | "success";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<Step>("phone");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(getDefaultCountry());

  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [maskedPhone, setMaskedPhone] = useState("");

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (step === "otp") otpRefs.current[0]?.focus();
  }, [step]);

  const clearError = () => setError(null);

  // Step 1: submit phone number
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhoneNumber(phoneNumber)) return;

    setLoading(true);
    clearError();

    try {
      const e164 = formatE164(countryCode.dialCode, phoneNumber);
      const result = await authApi.forgotPassword({ phone_number: e164 });
      setPendingUserId(result.user_id);
      setMaskedPhone(result.phone_number);
      setResendCooldown(30);
      setStep("otp");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP then move to password step
  const handleOtpSubmit = async (code?: string) => {
    const otpCode = code ?? otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    clearError();
    setOtp(otpCode.split(""));
    setStep("password");
  };

  const handleOtpChange = (index: number, value: string) => {
    clearError();
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (value && index === 5 && next.every((d) => d !== "")) handleOtpSubmit(next.join(""));
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
      handleOtpSubmit(pasted);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    clearError();

    try {
      const e164 = formatE164(countryCode.dialCode, phoneNumber);
      await authApi.forgotPassword({ phone_number: e164 });
      setResendCooldown(30);
      setOtp(Array(6).fill(""));
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Step 3: submit new password with OTP
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!pendingUserId) return;

    setLoading(true);
    clearError();

    try {
      await authApi.forgotPasswordVerify({
        user_id: pendingUserId,
        otp_code: otp.join(""),
        new_password: newPassword,
      });
      setStep("success");
    } catch (err) {
      const msg = getErrorMessage(err);
      const lower = msg.toLowerCase();
      const isOtpIssue =
        lower.includes("otp") ||
        lower.includes("expired") ||
        lower.includes("too many") ||
        lower.includes("failed attempts");
      if (isOtpIssue) {
        setOtp(Array(6).fill(""));
        setStep("otp");
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-5 sm:max-w-sm">
      {/* Phone step */}
      {step === "phone" && (
        <>
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Forgot password?</h2>
            <p className="text-sm text-muted-foreground">
              Enter your phone number and we&apos;ll send you a code to reset your password.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Limited to once per week for security.
            </p>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-3.5">
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
                disabled={loading}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !validatePhoneNumber(phoneNumber)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                "Send reset code"
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </button>
        </>
      )}

      {/* OTP step */}
      {step === "otp" && (
        <>
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Enter reset code</h2>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{maskedPhone}</span>
            </p>
          </div>

          <div className="flex justify-center gap-1.5 sm:gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={handleOtpPaste}
                disabled={loading}
                className={`h-12 w-10 rounded-lg border bg-background text-center text-lg font-semibold transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 sm:h-14 sm:w-12 sm:text-xl ${error ? "shake border-destructive" : "border-input"}`}
              />
            ))}
          </div>

          {error && <p className="text-center text-sm text-destructive">{error}</p>}

          <button
            type="button"
            onClick={() => handleOtpSubmit()}
            disabled={loading || otp.some((d) => d === "")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              {resendCooldown > 0 ? (
                <span>Resend in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-primary hover:underline"
                >
                  Resend
                </button>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setOtp(Array(6).fill(""));
              clearError();
              setStep("phone");
            }}
            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Change phone number
          </button>
        </>
      )}

      {/* New password step */}
      {step === "password" && (
        <>
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Set new password</h2>
            <p className="text-sm text-muted-foreground">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label htmlFor="new-password" className="text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearError();
                  }}
                  disabled={loading}
                  placeholder="At least 8 characters"
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
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError();
                }}
                disabled={loading}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || newPassword.length < 8 || !confirmPassword}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              clearError();
              setStep("otp");
            }}
            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Re-enter code
          </button>
        </>
      )}

      {/* Success step */}
      {step === "success" && (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Password reset!</h2>
            <p className="text-sm text-muted-foreground">
              Your password has been changed successfully. All existing sessions have been revoked
              for security.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:h-11"
          >
            Back to login
          </button>
        </div>
      )}
    </div>
  );
}
