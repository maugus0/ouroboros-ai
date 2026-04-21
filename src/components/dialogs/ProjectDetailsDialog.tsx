import { useEffect, useCallback, useReducer, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  MessageSquare,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Palette,
} from "lucide-react";
import { projectsApi } from "@/api/projectsApi";
import { getErrorMessage } from "@/api/client";
import type { Project } from "@/types/chat.types";
import { getProjectIcon } from "@/lib/projectTheme";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate, formatDateTime } from "@/lib/utils";

interface ProjectIconProps {
  iconId: string | null;
  className?: string;
}

function ProjectIcon({ iconId, className }: ProjectIconProps) {
  const Icon = useMemo(() => getProjectIcon(iconId), [iconId]);
  // eslint-disable-next-line react-hooks/static-components -- Icon is intentionally dynamic based on iconId
  return <Icon className={className} />;
}

type FetchState = {
  data: Project | null;
  isLoading: boolean;
  error: string | null;
};

type FetchAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Project }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "RESET" };

function fetchReducer(state: FetchState, action: FetchAction): FetchState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { data: action.payload, isLoading: false, error: null };
    case "FETCH_ERROR":
      return { data: null, isLoading: false, error: action.payload };
    case "RESET":
      return { data: null, isLoading: false, error: null };
    default:
      return state;
  }
}

const DESCRIPTION_TRUNCATE_LENGTH = 200;

interface ProjectDetailsDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailsDialog({ project, open, onOpenChange }: ProjectDetailsDialogProps) {
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    isLoading: false,
    error: null,
  });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const fetchProject = useCallback(async (projectId: string) => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await projectsApi.get(projectId);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: getErrorMessage(err) });
    }
  }, []);

  useEffect(() => {
    if (open && project?.id) {
      fetchProject(project.id);
    }

    return () => {
      dispatch({ type: "RESET" });
    };
  }, [open, project?.id, fetchProject]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsDescriptionExpanded(false);
    }
    onOpenChange(newOpen);
  };

  const displayProject = state.data ?? project;

  if (!displayProject) return null;

  const projectColor = displayProject.color ?? "#3B82F6";
  const description = displayProject.description ?? "";
  const isDescriptionLong = description.length > DESCRIPTION_TRUNCATE_LENGTH;
  const displayDescription =
    isDescriptionExpanded || !isDescriptionLong
      ? description
      : description.slice(0, DESCRIPTION_TRUNCATE_LENGTH).trim() + "…";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-lg flex-col gap-0 overflow-hidden p-0">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 border-b px-6 py-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm"
              style={{ backgroundColor: projectColor + "15", color: projectColor }}
            >
              <ProjectIcon iconId={displayProject.icon} className="h-7 w-7" />
            </div>
            <div className="w-full max-w-full overflow-hidden px-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTitle className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                      {displayProject.name}
                    </DialogTitle>
                  </TooltipTrigger>
                  {displayProject.name.length > 30 && (
                    <TooltipContent side="bottom" className="max-w-sm">
                      <p className="break-words text-sm">{displayProject.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        {state.isLoading ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : state.error ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{state.error}</p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="space-y-4 px-6 py-4">
              {/* Description */}
              {description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Description
                  </h4>
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
                    {displayDescription}
                  </p>
                  {isDescriptionLong && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 py-1 text-xs font-medium text-primary hover:bg-transparent hover:text-primary/80"
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                      {isDescriptionExpanded ? (
                        <>
                          Show less <ChevronUp className="ml-1 h-3 w-3" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="ml-1 h-3 w-3" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}

              <Separator />

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Chats
                  </h4>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {displayProject.chat_count}{" "}
                      {displayProject.chat_count === 1 ? "chat" : "chats"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Color
                  </h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <div
                      className="h-4 w-4 rounded-full border border-border"
                      style={{ backgroundColor: projectColor }}
                    />
                    <span className="font-mono text-xs">{projectColor}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Created
                  </h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(displayProject.created_at)}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Updated
                  </h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDateTime(displayProject.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
