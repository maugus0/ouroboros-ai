import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Settings</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Manage your OuroborosAI preferences.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Configure how you receive updates from OuroborosAI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="email-notifications" className="flex flex-col gap-0.5">
                <span className="text-sm">Email notifications</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Receive emails about new scholarship matches.
                </span>
              </Label>
              <Switch id="email-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="deadline-reminders" className="flex flex-col gap-0.5">
                <span className="text-sm">Deadline reminders</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Get notified before application deadlines.
                </span>
              </Label>
              <Switch id="deadline-reminders" defaultChecked />
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}
