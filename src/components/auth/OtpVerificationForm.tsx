import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface OtpVerificationFormProps {
  phoneNumber: string;
  onBack?: () => void;
}

export function OtpVerificationForm({ phoneNumber, onBack }: OtpVerificationFormProps) {
  const { verifyOTP, resendOTP, error, clearError, status } = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isLoading = status === "loading";

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (code?: string) => {
    const otpCode = code ?? otp.join("");

    if (otpCode.length !== 6) {
      setLocalError("Please enter all 6 digits");
      return;
    }

    try {
      await verifyOTP(otpCode);
    } catch {
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    clearError();
    setLocalError(null);

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newOtp.every((d) => d !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleSubmit(pasted);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      await resendOTP();
      setResendCooldown(30);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch {
      // Error is set in context
    }
  };

  const displayError = localError || error;

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Verify your phone</h2>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{phoneNumber}</span>
        </p>
      </div>

      <div className="flex justify-center gap-1.5 sm:gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading}
            className={`h-12 w-10 rounded-lg border bg-background text-center text-lg font-semibold transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 sm:h-14 sm:w-12 sm:text-xl ${displayError ? "shake border-destructive" : "border-input"}`}
          />
        ))}
      </div>

      {displayError && <p className="text-center text-sm text-destructive">{displayError}</p>}

      <button
        type="button"
        onClick={() => handleSubmit()}
        disabled={isLoading || otp.some((d) => d === "")}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify"
        )}
      </button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          {resendCooldown > 0 ? (
            <span className="text-muted-foreground">Resend in {resendCooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="font-medium text-primary hover:underline disabled:opacity-50"
            >
              Resend
            </button>
          )}
        </p>
      </div>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="w-full text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Change phone number
        </button>
      )}
    </div>
  );
}
