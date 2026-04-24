import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, FileText, GraduationCap, Loader2, RefreshCw, Trophy } from "lucide-react";
import { toast } from "sonner";
import { applicationsApi } from "@/api/applicationsApi";
import { ASSISTANT_SYNC_EVENT, type AssistantSyncDetail } from "@/lib/assistantSync";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApplicationStatus, TrackedApplication } from "@/types/applications.types";

const statusLabel: Record<ApplicationStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  applied: "Applied",
  accepted: "Accepted",
  rejected: "Rejected",
};

const statusVariant: Record<
  ApplicationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  not_started: "outline",
  in_progress: "secondary",
  applied: "default",
  accepted: "default",
  rejected: "destructive",
};

function formatDate(value?: string | null): string {
  if (!value) return "No deadline";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}

function extractSopContent(app: TrackedApplication): string | null {
  const output = app.sop_output;
  const data = output?.data;
  if (typeof data === "object" && data !== null && "content" in data) {
    const content = (data as { content?: unknown }).content;
    return typeof content === "string" && content.trim() ? content : null;
  }
  return null;
}

function extractCoverLetterContent(app: TrackedApplication): string | null {
  const output = app.cover_letter_output;
  const data = output?.data;
  if (typeof data === "object" && data !== null && "content" in data) {
    const content = (data as { content?: unknown }).content;
    return typeof content === "string" && content.trim() ? content : null;
  }
  return null;
}

function extractChecklistItems(app: TrackedApplication): Array<{
  id?: string;
  description?: string;
  status?: string;
  category?: string;
  priority?: string;
}> {
  const output = app.checklist_output;
  const data = output?.data;
  if (typeof data !== "object" || data === null || !("items" in data)) return [];
  const items = (data as { items?: unknown }).items;
  return Array.isArray(items)
    ? items.filter(
        (item): item is Record<string, string> => typeof item === "object" && item !== null
      )
    : [];
}

function extractChecklistSummary(app: TrackedApplication): {
  overallStatus?: string;
  completion?: number | null;
} {
  const output = app.checklist_output;
  const data = output?.data;
  if (typeof data !== "object" || data === null) return {};
  const typed = data as { overall_status?: unknown; completion_percentage?: unknown };
  const completion =
    typeof typed.completion_percentage === "number" ? typed.completion_percentage : null;
  return {
    overallStatus: typeof typed.overall_status === "string" ? typed.overall_status : undefined,
    completion,
  };
}

function extractDeadlineSummary(app: TrackedApplication): {
  createdCount?: number;
  skippedDuplicates?: number;
} {
  const output = app.deadline_output;
  const data = output?.data;
  if (typeof data !== "object" || data === null) return {};
  const typed = data as { created_count?: unknown; skipped_duplicates?: unknown };
  return {
    createdCount: typeof typed.created_count === "number" ? typed.created_count : undefined,
    skippedDuplicates:
      typeof typed.skipped_duplicates === "number" ? typed.skipped_duplicates : undefined,
  };
}

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(null);
  const [selectedDeadlineId, setSelectedDeadlineId] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{
    title: string;
    description: string;
    content: string;
  } | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setApplications(await applicationsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    const focusApplicationId =
      (location.state as { focusApplicationId?: string } | null)?.focusApplicationId ?? pendingFocusId;
    if (!focusApplicationId || isLoading) return;

    const node = itemRefs.current[focusApplicationId];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedId(focusApplicationId);
      window.setTimeout(
        () => setHighlightedId((current) => (current === focusApplicationId ? null : current)),
        2200
      );
    }

    if (pendingFocusId === focusApplicationId) {
      setPendingFocusId(null);
    }
    navigate(location.pathname, { replace: true, state: null });
  }, [isLoading, location.pathname, location.state, navigate, pendingFocusId]);

  useEffect(() => {
    const handleAssistantSync = (event: Event) => {
      const detail = (event as CustomEvent<AssistantSyncDetail>).detail;
      if (!detail?.refreshTabs?.includes("applications")) return;
      if (detail.focusApplicationId) {
        setPendingFocusId(detail.focusApplicationId);
      }
      void loadApplications();
    };

    window.addEventListener(ASSISTANT_SYNC_EVENT, handleAssistantSync as EventListener);
    return () => {
      window.removeEventListener(ASSISTANT_SYNC_EVENT, handleAssistantSync as EventListener);
    };
  }, [loadApplications]);

  const replaceApplication = (updated: TrackedApplication) => {
    setApplications((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  };

  const runAction = async (
    app: TrackedApplication,
    action: "checklist" | "deadline" | "sop" | "cover_letter" | ApplicationStatus
  ) => {
    setBusyId(app.id);
    try {
      if (action === "checklist") {
        const response = await applicationsApi.createChecklist(app.id);
        replaceApplication(response.application);
        setSelectedChecklistId(response.application.id);
        toast.success("Checklist created");
      } else if (action === "deadline") {
        const response = await applicationsApi.syncDeadline(app.id);
        replaceApplication(response.application);
        setSelectedDeadlineId(response.application.id);
        toast.success("Deadlines synced");
      } else if (action === "sop") {
        const response = await applicationsApi.generateSop(app.id);
        replaceApplication(response.application);
        const content = extractSopContent(response.application);
        if (content) {
          setSelectedDocument({
            title: "Statement of Purpose",
            description: response.application.title,
            content,
          });
        }
        toast.success("SOP generated");
      } else if (action === "cover_letter") {
        const response = await applicationsApi.generateCoverLetter(app.id);
        replaceApplication(response.application);
        const content = extractCoverLetterContent(response.application);
        if (content) {
          setSelectedDocument({
            title: "Cover Letter",
            description: response.application.title,
            content,
          });
        }
        toast.success("Cover letter generated");
      } else {
        replaceApplication(await applicationsApi.updateStatus(app.id, action));
        toast.success("Status updated");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const selectedChecklistApp = useMemo(
    () => applications.find((item) => item.id === selectedChecklistId) ?? null,
    [applications, selectedChecklistId]
  );
  const selectedDeadlineApp = useMemo(
    () => applications.find((item) => item.id === selectedDeadlineId) ?? null,
    [applications, selectedDeadlineId]
  );

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Applications</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Track graduate applications you explicitly started.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadApplications} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <ClipboardList className="h-9 w-9 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">No applications started yet.</p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Start from a program match, then generate checklists, deadlines, and SOP drafts
                  here.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => navigate("/dashboard/programs")}>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  View Programs
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/scholarships")}>
                  <Trophy className="mr-2 h-4 w-4" />
                  View Scholarships
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {applications.map((app) => {
              const isBusy = busyId === app.id;
              const sopContent = extractSopContent(app);
              const coverLetterContent = extractCoverLetterContent(app);
              return (
                <Card key={app.id}>
                  <div
                    ref={(node) => {
                      itemRefs.current[app.id] = node;
                    }}
                    className={
                      highlightedId === app.id
                        ? "rounded-lg border border-emerald-300 bg-emerald-50/70 transition-colors"
                        : undefined
                    }
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="text-sm sm:text-base">{app.title}</CardTitle>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                            {app.provider ?? "Unknown provider"}
                          </p>
                        </div>
                        <Badge variant={statusVariant[app.status]} className="shrink-0 text-xs">
                          {statusLabel[app.status]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                        <span>
                          {app.match_score != null
                            ? `${Math.round(app.match_score)}% match`
                            : "No match score"}
                        </span>
                        <span>{formatDate(app.deadline)}</span>
                        <span>{app.checklist_output ? "Checklist ready" : "No checklist yet"}</span>
                        <span>
                          {app.deadline_output ? "Deadlines synced" : "Deadlines not synced"}
                        </span>
                        <span>{app.entity_type === "scholarship" ? "Scholarship" : "Program"}</span>
                      </div>

                      {sopContent && (
                        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                          <div className="mb-1 flex items-center gap-1 font-medium text-foreground">
                            <FileText className="h-3.5 w-3.5" />
                            SOP draft
                          </div>
                          <p className="line-clamp-4 whitespace-pre-wrap">{sopContent}</p>
                        </div>
                      )}

                      {coverLetterContent && (
                        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                          <div className="mb-1 flex items-center gap-1 font-medium text-foreground">
                            <FileText className="h-3.5 w-3.5" />
                            Cover letter draft
                          </div>
                          <p className="line-clamp-4 whitespace-pre-wrap">{coverLetterContent}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (app.checklist_output) {
                              setSelectedChecklistId(app.id);
                              return;
                            }
                            void runAction(app, "checklist");
                          }}
                          disabled={isBusy}
                        >
                          {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Checklist
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (app.deadline_output) {
                              setSelectedDeadlineId(app.id);
                              return;
                            }
                            void runAction(app, "deadline");
                          }}
                          disabled={isBusy}
                        >
                          Deadline
                        </Button>
                        {app.entity_type === "program" && (
                          <Button
                            size="sm"
                            onClick={() => void runAction(app, "sop")}
                            disabled={isBusy}
                          >
                            Generate SOP
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => void runAction(app, "cover_letter")}
                          disabled={isBusy}
                        >
                          Generate Cover Letter
                        </Button>
                        {sopContent && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setSelectedDocument({
                                title: "Statement of Purpose",
                                description: app.title,
                                content: sopContent,
                              })
                            }
                          >
                            View SOP
                          </Button>
                        )}
                        {coverLetterContent && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setSelectedDocument({
                                title: "Cover Letter",
                                description: app.title,
                                content: coverLetterContent,
                              })
                            }
                          >
                            View Letter
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" disabled={isBusy}>
                              Set Status
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {Object.entries(statusLabel).map(([value, label]) => (
                              <DropdownMenuItem
                                key={value}
                                onClick={() => runAction(app, value as ApplicationStatus)}
                              >
                                {label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(selectedChecklistApp)}
        onOpenChange={(open) => !open && setSelectedChecklistId(null)}
      >
        <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Checklist</DialogTitle>
            <DialogDescription>
              {selectedChecklistApp?.title ?? "Application checklist"}
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 space-y-4 overflow-y-auto pr-2">
            {selectedChecklistApp &&
              (() => {
                const items = extractChecklistItems(selectedChecklistApp);
                const summary = extractChecklistSummary(selectedChecklistApp);
                return (
                  <>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span>Overall status: {summary.overallStatus ?? "not_started"}</span>
                      <span>
                        Completion:{" "}
                        {summary.completion != null ? `${Math.round(summary.completion)}%` : "0%"}
                      </span>
                    </div>
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No checklist items available yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div
                            key={item.id ?? `${item.description ?? "item"}-${index}`}
                            className="rounded-md border p-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {item.description ?? "Checklist item"}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {item.category ?? "general"} • {item.priority ?? "normal"}
                                </p>
                              </div>
                              <Badge variant="outline" className="shrink-0">
                                {item.status ?? "pending"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedDeadlineApp)}
        onOpenChange={(open) => !open && setSelectedDeadlineId(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Deadline Sync</DialogTitle>
            <DialogDescription>
              {selectedDeadlineApp?.title ?? "Application deadline details"}
            </DialogDescription>
          </DialogHeader>
          {selectedDeadlineApp &&
            (() => {
              const summary = extractDeadlineSummary(selectedDeadlineApp);
              return (
                <div className="space-y-4 text-sm">
                  <div className="rounded-md border p-3">
                    <p className="font-medium text-foreground">Tracked deadline</p>
                    <p className="mt-1 text-muted-foreground">
                      {formatDate(selectedDeadlineApp.deadline)}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border p-3">
                      <p className="font-medium text-foreground">Created deadlines</p>
                      <p className="mt-1 text-muted-foreground">{summary.createdCount ?? 0}</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="font-medium text-foreground">Skipped duplicates</p>
                      <p className="mt-1 text-muted-foreground">{summary.skippedDuplicates ?? 0}</p>
                    </div>
                  </div>
                  <div className="rounded-md border bg-muted/30 p-3">
                    <p className="mb-2 font-medium text-foreground">Raw sync result</p>
                    <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground">
                      {JSON.stringify(selectedDeadlineApp.deadline_output, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedDocument)}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
      >
        <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title ?? "Document"}</DialogTitle>
            <DialogDescription>
              {selectedDocument?.description ?? "Generated document"}
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto rounded-md border bg-muted/20 p-4">
            <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground">
              {selectedDocument?.content ?? ""}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
