import type { RoutingDecision } from "@/types/chat.types";
import { ThinkingBlock, formatConfidence } from "./shared";

interface RoutingDecisionBlockProps {
  data: RoutingDecision;
}

export function RoutingDecisionBlock({ data }: RoutingDecisionBlockProps) {
  const alternatives = data.alternative_agents ?? [];
  const confidence = formatConfidence(data.confidence);
  const summary = confidence
    ? `→ ${data.selected_agent.replace(/_/g, " ")} (${confidence})`
    : `→ ${data.selected_agent.replace(/_/g, " ")}`;

  return (
    <ThinkingBlock
      label="Routing decision"
      summary={summary}
      accentColor="text-cyan-600 dark:text-cyan-400"
    >
      <div className="space-y-2">
        <div>
          <span className="font-medium text-foreground/70">Selected agent:</span>{" "}
          <span className="text-cyan-600 dark:text-cyan-400">
            {data.selected_agent.replace(/_/g, " ")}
          </span>
          {confidence && <span className="ml-1.5 text-muted-foreground/60">({confidence})</span>}
        </div>
        <div>
          <span className="font-medium text-foreground/70">Reason:</span>{" "}
          <span>{data.routing_reason}</span>
        </div>
        {alternatives.length > 0 && (
          <div>
            <span className="font-medium text-foreground/70">Alternatives:</span>{" "}
            <span className="text-muted-foreground/60">
              {alternatives.map((a) => a.replace(/_/g, " ")).join(", ")}
            </span>
          </div>
        )}
      </div>
    </ThinkingBlock>
  );
}
