import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Globe, Loader2, RefreshCw, Search } from "lucide-react";
import type { DashboardScholarship } from "@/types/results.types";
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

function formatAmount(item: DashboardScholarship): string {
  if (typeof item.funding_amount === "number") {
    const currency = typeof item.currency === "string" && item.currency ? item.currency : "USD";
    return `${currency} ${item.funding_amount.toLocaleString()}`;
  }
  const maybeRaw = item["amount"];
  if (typeof maybeRaw === "string" && maybeRaw.trim()) return maybeRaw;
  return "Amount unavailable";
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function formatMatch(item: DashboardScholarship): string {
  const score = toNumber(item.match?.match_score);
  if (score === null) return "N/A";
  return `${Math.round(score)}% match`;
}

export default function ScholarshipsPage() {
  const navigate = useNavigate();
  const [startingId, setStartingId] = useState<string | null>(null);
  const { dashboardData, isLoading, isDiscovering, error, runDiscovery, clearError } =
    useDiscovery();

  const dashboard = dashboardData?.dashboard;
  const scholarships = useMemo(() => dashboard?.scholarships?.items ?? [], [dashboard]);
  const isPartial = dashboard?.status === "partial" || dashboard?.status === "failed";
  const partialMessage = dashboard?.errors?.[0]?.message ?? "Some discovery agents did not finish.";

  const startApplication = useCallback(
    async (item: DashboardScholarship, idx: number) => {
      const fallbackName = typeof item.name === "string" && item.name ? item.name : "scholarship";
      const entityId = String(item.id ?? item.scholarship_id ?? `${fallbackName}-${idx}`);
      const title = (typeof item.name === "string" && item.name) || "Unnamed Scholarship";
      const provider =
        (typeof item.provider === "string" && item.provider) ||
        (typeof item["organization"] === "string" && item["organization"]) ||
        null;
      const deadline = typeof item.deadline === "string" && item.deadline ? item.deadline : null;
      const score = toNumber(item.match?.match_score);

      setStartingId(entityId);
      try {
        const application = await applicationsApi.start({
          entity_type: "scholarship",
          entity_id: entityId,
          title,
          provider,
          deadline,
          match_score: score,
          source_data: item as Record<string, unknown>,
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
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Scholarships</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Scholarships matched from your latest discovery run.
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
            Loading scholarships...
          </div>
        ) : !dashboardData?.has_results ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No discovery results yet. Run discovery to generate scholarship matches.
              </p>
              <Button onClick={runDiscovery} disabled={isDiscovering}>
                {isDiscovering ? "Running..." : "Run Discovery"}
              </Button>
            </CardContent>
          </Card>
        ) : scholarships.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No scholarships found for the latest criteria.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {scholarships.map((item, idx) => {
              const name = (typeof item.name === "string" && item.name) || "Unnamed Scholarship";
              const provider =
                (typeof item.provider === "string" && item.provider) || "Unknown Provider";
              const eligibility =
                (typeof item["eligibility"] === "string" && item["eligibility"]) ||
                (typeof item["eligibility_criteria"] === "string" &&
                  item["eligibility_criteria"]) ||
                "Eligibility details unavailable";

              return (
                <Card
                  key={String(item.id ?? `${name}-${idx}`)}
                  className="transition-colors hover:bg-accent/50"
                >
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-sm sm:text-base">{name}</CardTitle>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                          {provider}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {formatMatch(item)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            {formatAmount(item)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            {formatDateValue(item.deadline)}
                          </span>
                        </div>
                        <div className="flex items-start gap-1 text-xs text-muted-foreground sm:text-sm">
                          <Globe className="mt-0.5 h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                          <span>{eligibility}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          clearError();
                          void startApplication(item, idx);
                        }}
                        disabled={
                          startingId === String(item.id ?? item.scholarship_id ?? `${name}-${idx}`)
                        }
                      >
                        {startingId ===
                        String(item.id ?? item.scholarship_id ?? `${name}-${idx}`) ? (
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
