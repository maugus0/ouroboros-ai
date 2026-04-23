import { GitBranch } from "lucide-react";
import type { RoutingDecision } from "@/types/chat.types";
import { ReasoningCard, ConfidenceIndicator, ChipList } from "./shared";

interface RoutingDecisionCardProps {
  data: RoutingDecision;
  defaultOpen?: boolean;
}

export function RoutingDecisionCard({ data, defaultOpen }: RoutingDecisionCardProps) {
  const alternatives = data.alternative_agents ?? [];
  const hasConfidence = typeof data.confidence === "number";

  return (
    <ReasoningCard
      title="Routing Decision"
      icon={GitBranch}
      iconColor="text-cyan-500 dark:text-cyan-400"
      accentColor="border-l-cyan-500/40 dark:border-l-cyan-400/40"
      defaultOpen={defaultOpen}
      headerRight={
        hasConfidence ? <ConfidenceIndicator value={data.confidence!} size="sm" /> : undefined
      }
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
            Selected Agent
          </span>
          <div className="inline-flex items-center gap-2 rounded-md bg-cyan-500/10 px-2.5 py-1.5 dark:bg-cyan-500/15">
            <div className="h-2 w-2 rounded-full bg-cyan-500" />
            <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
              {data.selected_agent.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
            Routing Reason
          </span>
          <p className="text-xs leading-relaxed text-foreground/80">{data.routing_reason}</p>
        </div>

        {alternatives.length > 0 && (
          <ChipList items={alternatives} variant="muted" label="Alternative Agents" />
        )}
      </div>
    </ReasoningCard>
  );
}
