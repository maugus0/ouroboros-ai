import { Compass } from "lucide-react";
import type { OrchestratorThoughts } from "@/types/chat.types";
import { ReasoningCard, ConfidenceIndicator } from "./shared";

interface OrchestratorThoughtsCardProps {
  data: OrchestratorThoughts;
  defaultOpen?: boolean;
}

export function OrchestratorThoughtsCard({ data, defaultOpen }: OrchestratorThoughtsCardProps) {
  const hasConfidence = typeof data.intent_confidence === "number";

  return (
    <ReasoningCard
      title="Orchestrator Thoughts"
      icon={Compass}
      iconColor="text-violet-500 dark:text-violet-400"
      accentColor="border-l-violet-500/40 dark:border-l-violet-400/40"
      defaultOpen={defaultOpen}
      headerRight={
        hasConfidence ? (
          <ConfidenceIndicator value={data.intent_confidence!} size="sm" />
        ) : undefined
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                Intent
              </span>
            </div>
            <div className="rounded-md bg-violet-500/5 px-2.5 py-1.5 dark:bg-violet-500/10">
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                {data.intent.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
            Reasoning
          </span>
          <p className="text-xs leading-relaxed text-foreground/80">{data.reasoning}</p>
        </div>
      </div>
    </ReasoningCard>
  );
}
