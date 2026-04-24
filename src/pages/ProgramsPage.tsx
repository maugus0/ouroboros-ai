import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, GraduationCap, Loader2, MapPin, RefreshCw, Search } from "lucide-react";
import type { DashboardProgram } from "@/types/results.types";
import { applicationsApi } from "@/api/applicationsApi";
import { getErrorMessage } from "@/api/client";
import { useDiscovery } from "@/contexts/DiscoveryContext";
import { toast } from "sonner";

function formatDateValue(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "No deadline";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function formatMatch(program: DashboardProgram): string {
  const score = toNumber(program.match?.match_score);
  if (score === null) return "N/A";
  return `${Math.round(score)}% match`;
}

export default function ProgramsPage() {
  const navigate = useNavigate();
  const [startingId, setStartingId] = useState<string | null>(null);
  const { dashboardData, isLoading, isDiscovering, error, runDiscovery, clearError } =
    useDiscovery();

  const dashboard = dashboardData?.dashboard;
  const programs = useMemo(() => dashboard?.programs?.items ?? [], [dashboard]);
  const isPartial = dashboard?.status === "partial" || dashboard?.status === "failed";
  const partialMessage = dashboard?.errors?.[0]?.message ?? "Some discovery agents did not finish.";

  const startApplication = useCallback(
    async (program: DashboardProgram, idx: number) => {
      const entityId = String(
        program.id ?? `${program.program_name ?? program.name ?? "program"}-${idx}`
      );
      const title =
        (typeof program.program_name === "string" && program.program_name) ||
        (typeof program.name === "string" && program.name) ||
        "Unnamed Program";
      const provider =
        (typeof program.institution_name === "string" && program.institution_name) ||
        (typeof program.university === "string" && program.university) ||
        null;
      const deadline =
        typeof program.deadline === "string" && program.deadline ? program.deadline : null;
      const score = toNumber(program.match?.match_score);

      setStartingId(entityId);
      try {
        const application = await applicationsApi.start({
          entity_type: "program",
          entity_id: entityId,
          title,
          provider,
          deadline,
          match_score: score,
          source_data: program as Record<string, unknown>,
        });
        toast.success("Application started");
        navigate("/dashboard/applications", {
          state: { focusApplicationId: application.id },
        });
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setStartingId(null);
      }
    },
    [navigate]
  );

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Programs</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Graduate programs discovered from your latest run.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={runDiscovery} disabled={isDiscovering}>
            {isDiscovering ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Run Discovery
          </Button>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        {isPartial && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            {partialMessage}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading programs...
          </div>
        ) : !dashboardData?.has_results ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No discovery results yet. Run discovery to generate program matches.
              </p>
              <Button onClick={runDiscovery} disabled={isDiscovering}>
                {isDiscovering ? "Running..." : "Run Discovery"}
              </Button>
            </CardContent>
          </Card>
        ) : programs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No programs found for the latest criteria.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {programs.map((program, idx) => {
              const name =
                (typeof program.program_name === "string" && program.program_name) ||
                (typeof program.name === "string" && program.name) ||
                "Unnamed Program";
              const university =
                (typeof program.institution_name === "string" && program.institution_name) ||
                (typeof program.university === "string" && program.university) ||
                "Unknown Institution";
              const location =
                (typeof program.institution_country === "string" && program.institution_country) ||
                (typeof program.location === "string" && program.location) ||
                "Unknown";

              return (
                <Card
                  key={String(program.id ?? `${name}-${idx}`)}
                  className="transition-colors hover:bg-accent/50"
                >
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-sm sm:text-base">{name}</CardTitle>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                          {university}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {formatMatch(program)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {formatDateValue(program.deadline)}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          Active
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          clearError();
                          void startApplication(program, idx);
                        }}
                        disabled={startingId === String(program.id ?? `${name}-${idx}`)}
                      >
                        {startingId === String(program.id ?? `${name}-${idx}`) ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Start Application
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
