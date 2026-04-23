import type { OrchestratorThoughts } from "@/types/chat.types";
import { ThinkingBlock, formatConfidence } from "./shared";

interface OrchestratorThoughtsBlockProps {
  data: OrchestratorThoughts;
}

export function OrchestratorThoughtsBlock({ data }: OrchestratorThoughtsBlockProps) {
  const confidence = formatConfidence(data.intent_confidence);
  const summary = confidence
    ? `${data.intent.replace(/_/g, " ")} (${confidence})`
    : data.intent.replace(/_/g, " ");

  return (
    <ThinkingBlock
      label="Orchestrator thoughts"
      summary={summary}
      accentColor="text-violet-600 dark:text-violet-400"
    >
      <div className="space-y-2">
        <div>
          <span className="font-medium text-foreground/70">Intent:</span>{" "}
          <span className="text-violet-600 dark:text-violet-400">
            {data.intent.replace(/_/g, " ")}
          </span>
          {confidence && <span className="ml-1.5 text-muted-foreground/60">({confidence})</span>}
        </div>
        <div>
          <span className="font-medium text-foreground/70">Reasoning:</span>{" "}
          <span>{data.reasoning}</span>
        </div>
      </div>
    </ThinkingBlock>
  );
}
