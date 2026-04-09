import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Gender, Interest } from "@/types/auth";
import { Loader2 } from "lucide-react";

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: "jobs", label: "Jobs" },
  { value: "startups", label: "Startups" },
  { value: "research", label: "Research" },
  { value: "degree", label: "Degree" },
];

export function ProfileCompletionForm() {
  const { updateProfile, skipProfileCompletion, user, error, clearError } = useAuth();

  const [gender, setGender] = useState<Gender | "">(user?.gender ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [aboutMe, setAboutMe] = useState(user?.about_me ?? "");
  const [profession, setProfession] = useState(user?.profession ?? "");
  const [interest, setInterest] = useState<Interest | "">(user?.interest ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canComplete = gender && email && aboutMe && profession && interest && isEmailValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    try {
      await updateProfile({
        gender: gender || undefined,
        email: email || undefined,
        about_me: aboutMe || undefined,
        profession: profession || undefined,
        interest: interest || undefined,
      });
    } catch {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);

    const hasPartialData = gender || email || aboutMe || profession || interest;
    if (hasPartialData) {
      try {
        await updateProfile({
          gender: gender || undefined,
          email: email || undefined,
          about_me: aboutMe || undefined,
          profession: profession || undefined,
          interest: interest || undefined,
        });
      } catch {
        // Non-blocking
      }
    }

    setIsSubmitting(false);
    skipProfileCompletion();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
      {/* Gender — 2×2 grid keeps "Prefer not to say" on one line */}
      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium">Gender</legend>
        <div className="grid grid-cols-2 gap-2">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setGender(opt.value);
                clearError();
              }}
              className={`rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors ${
                gender === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Email + Profession side by side on sm+ */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="pc-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="pc-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
            }}
            disabled={isSubmitting}
            placeholder="you@example.com"
            className={`h-9 w-full rounded-lg border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${!isEmailValid ? "border-destructive" : "border-input"}`}
          />
          {!isEmailValid && <p className="text-xs text-destructive">Enter a valid email</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="pc-profession" className="text-sm font-medium">
            Profession
          </label>
          <input
            id="pc-profession"
            type="text"
            value={profession}
            onChange={(e) => {
              setProfession(e.target.value);
              clearError();
            }}
            disabled={isSubmitting}
            placeholder="e.g. Software Engineer"
            maxLength={100}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>
      </div>

      {/* Interest */}
      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium">What are you looking for?</legend>
        <div className="grid grid-cols-4 gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setInterest(opt.value);
                clearError();
              }}
              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors sm:text-sm ${
                interest === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* About Me */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="pc-aboutMe" className="text-sm font-medium">
            About me
          </label>
          <span className="text-xs text-muted-foreground">{aboutMe.length}/500</span>
        </div>
        <textarea
          id="pc-aboutMe"
          value={aboutMe}
          onChange={(e) => {
            setAboutMe(e.target.value);
            clearError();
          }}
          disabled={isSubmitting}
          placeholder="Tell us a bit about yourself..."
          rows={2}
          maxLength={500}
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-2.5 text-sm text-destructive">{error}</div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSubmitting}
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Skip for now
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !canComplete}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete profile"
          )}
        </button>
      </div>

      {!canComplete && (
        <p className="text-center text-[11px] text-muted-foreground">
          All fields are required to complete your profile
        </p>
      )}
    </form>
  );
}
