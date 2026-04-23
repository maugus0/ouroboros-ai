import { useState, useMemo } from "react";
import { Sparkles, ChevronDown, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageMetadata } from "@/types/chat.types";
import { OrchestratorThoughtsCard } from "./OrchestratorThoughtsCard";
import { GateDecisionCard } from "./GateDecisionCard";
import { RoutingDecisionCard } from "./RoutingDecisionCard";
import { AgentReasoningCard } from "./AgentReasoningCard";

interface ReasoningSectionProps {
  metadata: MessageMetadata | null;
}

export function ReasoningSection({ metadata }: ReasoningSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  const hasContent = useMemo(() => {
    if (!metadata) return false;
    return !!(
      metadata.orchestrator_thoughts ||
      metadata.gate_decision ||
      metadata.routing_decision ||
      metadata.agent_reasoning
    );
  }, [metadata]);

  const sectionCount = useMemo(() => {
    if (!metadata) return 0;
    let count = 0;
    if (metadata.orchestrator_thoughts) count++;
    if (metadata.gate_decision) count++;
    if (metadata.routing_decision) count++;
    if (metadata.agent_reasoning) count++;
    return count;
  }, [metadata]);

  if (!hasContent || !metadata) {
    return null;
  }

  return (
    <div className="mb-3 mt-1">
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 via-background to-muted/20 shadow-sm transition-all duration-200",
          isExpanded && "border-border/70 shadow-md"
        )}
      >
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2 text-left transition-colors",
            "hover:bg-muted/40",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          )}
        >
          <div className="flex h-5 w-5 items-center justify-center text-primary/70">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="flex-1 text-xs font-medium text-foreground/80">
            Reasoning & Decision Process
          </span>
          <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {sectionCount} {sectionCount === 1 ? "step" : "steps"}
          </span>
          <div className="flex h-5 w-5 items-center justify-center text-muted-foreground/60">
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-border/40 px-3 pb-3 pt-2">
            <div className="mb-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setExpandAll((prev) => !prev)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground/70 transition-colors",
                  "hover:bg-muted/50 hover:text-muted-foreground"
                )}
              >
                {expandAll ? (
                  <>
                    <Minimize2 className="h-3 w-3" />
                    Collapse all
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3 w-3" />
                    Expand all
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              {metadata.orchestrator_thoughts && (
                <OrchestratorThoughtsCard
                  data={metadata.orchestrator_thoughts}
                  defaultOpen={expandAll}
                  key={`orchestrator-${expandAll}`}
                />
              )}

              {metadata.gate_decision && (
                <GateDecisionCard
                  data={metadata.gate_decision}
                  defaultOpen={expandAll}
                  key={`gate-${expandAll}`}
                />
              )}

              {metadata.routing_decision && (
                <RoutingDecisionCard
                  data={metadata.routing_decision}
                  defaultOpen={expandAll}
                  key={`routing-${expandAll}`}
                />
              )}

              {metadata.agent_reasoning && (
                <AgentReasoningCard
                  data={metadata.agent_reasoning}
                  defaultOpen={expandAll}
                  key={`agent-${expandAll}`}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
