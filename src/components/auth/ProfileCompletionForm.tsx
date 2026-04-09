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

const INTEREST_OPTIONS: { value: Interest; label: string; description: string }[] = [
  { value: "jobs", label: "Jobs", description: "Looking for job opportunities" },
  { value: "startups", label: "Startups", description: "Interested in startup ecosystem" },
  { value: "research", label: "Research", description: "Pursuing research opportunities" },
  { value: "degree", label: "Degree", description: "Seeking degree programs & scholarships" },
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

    // Save whatever the user has filled so far
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
        // Non-blocking -- let the user proceed even if partial save fails
      }
    }

    setIsSubmitting(false);
    skipProfileCompletion();
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Complete your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in all fields to unlock the full OuroborosAI experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <div className="grid grid-cols-2 gap-2">
            {GENDER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setGender(option.value);
                  clearError();
                }}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  gender === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
            }}
            disabled={isSubmitting}
            placeholder="you@example.com"
            className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${!isEmailValid ? "border-destructive" : "border-input"}`}
          />
          {!isEmailValid && <p className="text-xs text-destructive">Enter a valid email address</p>}
        </div>

        {/* Profession */}
        <div className="space-y-1">
          <label htmlFor="profession" className="text-sm font-medium">
            Profession
          </label>
          <input
            id="profession"
            type="text"
            value={profession}
            onChange={(e) => {
              setProfession(e.target.value);
              clearError();
            }}
            disabled={isSubmitting}
            placeholder="e.g. Software Engineer, Student, Researcher"
            maxLength={100}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>

        {/* Interest */}
        <div className="space-y-2">
          <label className="text-sm font-medium">What are you looking for?</label>
          <div className="grid grid-cols-2 gap-2">
            {INTEREST_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setInterest(option.value);
                  clearError();
                }}
                className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                  interest === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input hover:bg-muted"
                }`}
              >
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="block text-xs text-muted-foreground">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* About Me */}
        <div className="space-y-1">
          <label htmlFor="aboutMe" className="text-sm font-medium">
            About me
          </label>
          <textarea
            id="aboutMe"
            value={aboutMe}
            onChange={(e) => {
              setAboutMe(e.target.value);
              clearError();
            }}
            disabled={isSubmitting}
            placeholder="Tell us a bit about yourself..."
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <p className="text-right text-xs text-muted-foreground">{aboutMe.length}/500</p>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        {!canComplete && (
          <p className="text-center text-xs text-muted-foreground">
            All fields are required to complete your profile
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 font-medium hover:bg-muted disabled:opacity-50"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !canComplete}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
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
      </form>
    </div>
  );
}
