import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Gender, Interest } from "@/types/auth";
import { parseUTC } from "@/utils/dateUtils";
import { getInitials } from "@/lib/utils";
import {
  Loader2,
  Pencil,
  X,
  Check,
  Phone,
  Mail,
  User,
  Briefcase,
  Compass,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

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

function formatGender(g: string | null): string {
  if (!g) return "Not set";
  return g.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatInterest(i: string | null): string {
  if (!i) return "Not set";
  return i.charAt(0).toUpperCase() + i.slice(1);
}

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  return parseUTC(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProfilePage() {
  const { user, updateProfile, refreshUser, error, clearError } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [gender, setGender] = useState<Gender | "">(user?.gender ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profession, setProfession] = useState(user?.profession ?? "");
  const [interest, setInterest] = useState<Interest | "">(user?.interest ?? "");
  const [aboutMe, setAboutMe] = useState(user?.about_me ?? "");

  const startEditing = () => {
    setFirstName(user?.first_name ?? "");
    setLastName(user?.last_name ?? "");
    setGender(user?.gender ?? "");
    setEmail(user?.email ?? "");
    setProfession(user?.profession ?? "");
    setInterest(user?.interest ?? "");
    setAboutMe(user?.about_me ?? "");
    clearError();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    clearError();
  };

  const handleSave = async () => {
    clearError();
    setIsSaving(true);

    try {
      await updateProfile({
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        gender: gender || undefined,
        email: email || undefined,
        about_me: aboutMe || undefined,
        profession: profession || undefined,
        interest: interest || undefined,
      });
      await refreshUser();
      setIsEditing(false);
    } catch {
      // Error handled by context
    } finally {
      setIsSaving(false);
    }
  };

  const fullName = user ? `${user.first_name} ${user.last_name}` : "User";

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Profile</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Your profile used by OuroborosAI agents.
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 rounded-lg border border-input px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={cancelEditing}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg border border-input px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Save
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        {/* User card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="h-14 w-14 rounded-xl sm:h-16 sm:w-16">
                <AvatarImage src="/shadcn.jpg" />
                <AvatarFallback className="text-base sm:text-lg">
                  {user ? getInitials(fullName) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-base sm:text-lg">{fullName}</CardTitle>
                    <CardDescription className="truncate">@{user?.username}</CardDescription>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Contact info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{user?.phone_number ?? "Not set"}</p>
              </div>
              {user?.phone_verified ? (
                <Badge variant="secondary" className="gap-1 text-xs text-green-600">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 text-xs">
                  <ShieldAlert className="h-3 w-3" />
                  Unverified
                </Badge>
              )}
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-0.5 h-8 w-full rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                ) : (
                  <p className="text-sm font-medium">{user?.email ?? "Not set"}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gender */}
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Gender</p>
                {isEditing ? (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {GENDER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setGender(opt.value)}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                          gender === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-input hover:bg-muted"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium">{formatGender(user?.gender ?? null)}</p>
                )}
              </div>
            </div>
            <Separator />
            {/* Profession */}
            <div className="flex items-start gap-3">
              <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Profession</p>
                {isEditing ? (
                  <input
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Software Engineer, Student"
                    maxLength={100}
                    className="mt-0.5 h-8 w-full rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                ) : (
                  <p className="text-sm font-medium">{user?.profession ?? "Not set"}</p>
                )}
              </div>
            </div>
            <Separator />
            {/* Interest */}
            <div className="flex items-start gap-3">
              <Compass className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Interest</p>
                {isEditing ? (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {INTEREST_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setInterest(opt.value)}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                          interest === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-input hover:bg-muted"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium">{formatInterest(user?.interest ?? null)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Me */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">About Me</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-1">
                <textarea
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-right text-xs text-muted-foreground">{aboutMe.length}/500</p>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {user?.about_me || "No bio yet."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Account info (read-only) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <dt className="text-xs text-muted-foreground">Username</dt>
                <dd className="text-sm font-medium">@{user?.username}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Profile Status</dt>
                <dd>
                  {user?.profile_completed ? (
                    <Badge variant="secondary" className="text-xs text-green-600">
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-amber-600">
                      Incomplete
                    </Badge>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Member Since</dt>
                <dd className="text-sm font-medium">{formatDate(user?.created_at ?? null)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Last Login</dt>
                <dd className="text-sm font-medium">{formatDate(user?.last_login ?? null)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
