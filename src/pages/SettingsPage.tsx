import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { authApi, getErrorMessage } from "@/api/authApi";
import type { AuthSession } from "@/types/auth";
import {
  Loader2,
  Monitor,
  Smartphone,
  Globe,
  RefreshCw,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

function parseUserAgent(ua: string | null): { icon: typeof Monitor; label: string } {
  if (!ua) return { icon: Globe, label: "Unknown device" };

  const isMobile = /mobile|android|iphone|ipad/i.test(ua);
  const icon = isMobile ? Smartphone : Monitor;

  let browser = "Unknown browser";
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/edg/i.test(ua)) browser = "Edge";

  let os = "";
  if (/mac os/i.test(ua)) os = "macOS";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";

  return { icon, label: [browser, os].filter(Boolean).join(" on ") };
}

function formatRelativeTime(iso: string | null): string {
  if (!iso) return "Unknown";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user, refreshUser, logout } = useAuth();

  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [mfaSuccess, setMfaSuccess] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const data = await authApi.getSessions(true);
      data.sort(
        (a, b) =>
          new Date(b.last_active_at ?? b.created_at).getTime() -
          new Date(a.last_active_at ?? a.created_at).getTime()
      );
      setSessions(data);
    } catch {
      setSessionsError("Failed to load sessions");
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleMfaToggle = useCallback(
    async (enabled: boolean) => {
      setMfaLoading(true);
      setMfaError(null);
      setMfaSuccess(null);
      try {
        const result = await authApi.toggleMfa({ enabled });
        setMfaSuccess(result.message);
        await refreshUser();
        setTimeout(() => setMfaSuccess(null), 3000);
      } catch (err) {
        setMfaError(getErrorMessage(err));
      } finally {
        setMfaLoading(false);
      }
    },
    [refreshUser]
  );

  const handleResetPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setResetError(null);

      if (newPassword.length < 8) {
        setResetError("New password must be at least 8 characters");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setResetError("Passwords do not match");
        return;
      }

      setResetLoading(true);
      try {
        await authApi.resetPassword({
          current_password: currentPassword,
          new_password: newPassword,
        });
        setResetSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => logout(), 3000);
      } catch (err) {
        setResetError(getErrorMessage(err));
      } finally {
        setResetLoading(false);
      }
    },
    [currentPassword, newPassword, confirmNewPassword, logout]
  );

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Settings</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Manage your OuroborosAI preferences.
          </p>
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Appearance</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Customize the look and feel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="dark-mode" className="flex flex-col gap-0.5">
                <span className="text-sm">Dark mode</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Use dark theme across the application.
                </span>
              </Label>
              <Switch id="dark-mode" checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Security — MFA */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Security</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Protect your account with additional security measures.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <Label htmlFor="mfa-toggle" className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-sm">Two-factor authentication (2FA)</span>
                </div>
                <span className="text-xs font-normal text-muted-foreground">
                  Require a one-time code sent to your phone on every login.
                </span>
              </Label>
              <Switch
                id="mfa-toggle"
                checked={user?.mfa_enabled ?? false}
                onCheckedChange={handleMfaToggle}
                disabled={mfaLoading || !user?.phone_verified}
              />
            </div>
            {!user?.phone_verified && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                You must verify your phone number before enabling 2FA.
              </p>
            )}
            {mfaError && (
              <div className="rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
                {mfaError}
              </div>
            )}
            {mfaSuccess && (
              <div className="rounded-lg bg-green-500/10 p-2.5 text-xs text-green-700 dark:text-green-400">
                {mfaSuccess}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reset Password */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <div>
                <CardTitle className="text-base sm:text-lg">Change Password</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Update your password. Limited to once every 30 days. All active sessions will be
                  revoked for security.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {resetSuccess ? (
              <div className="space-y-2 rounded-lg bg-green-500/10 p-4 text-center">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Password changed successfully!
                </p>
                <p className="text-xs text-muted-foreground">
                  All sessions have been revoked. You will be redirected to login...
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="space-y-1">
                  <label htmlFor="current-password" className="text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setResetError(null);
                    }}
                    disabled={resetLoading}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="settings-new-password" className="text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="settings-new-password"
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setResetError(null);
                      }}
                      disabled={resetLoading}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="settings-confirm-password" className="text-sm font-medium">
                    Confirm New Password
                  </label>
                  <input
                    id="settings-confirm-password"
                    type={showPasswords ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      setResetError(null);
                    }}
                    disabled={resetLoading}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                </div>
                {resetError && (
                  <div className="rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
                    {resetError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={
                    resetLoading ||
                    !currentPassword ||
                    newPassword.length < 8 ||
                    !confirmNewPassword
                  }
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change password"
                  )}
                </button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg">Active Sessions</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Devices where you&apos;re currently logged in.
                </CardDescription>
              </div>
              <button
                onClick={fetchSessions}
                disabled={sessionsLoading}
                className="flex items-center gap-1.5 rounded-lg border border-input px-2.5 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${sessionsLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {sessionsLoading && sessions.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : sessionsError ? (
              <div className="rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
                {sessionsError}
              </div>
            ) : sessions.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No active sessions</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((session, idx) => {
                  const { icon: DeviceIcon, label: deviceLabel } = parseUserAgent(
                    session.user_agent
                  );
                  const isFirst = idx === 0;
                  return (
                    <div key={session.id}>
                      {idx > 0 && <Separator className="mb-3" />}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg bg-muted p-2">
                          <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium">{deviceLabel}</p>
                            {isFirst && (
                              <Badge variant="secondary" className="text-xs text-green-600">
                                Current
                              </Badge>
                            )}
                          </div>
                          <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                            {session.ip_address && <span>IP: {session.ip_address}</span>}
                            <span>
                              Active:{" "}
                              {formatRelativeTime(session.last_active_at ?? session.created_at)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Signed in: {formatDateTime(session.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
