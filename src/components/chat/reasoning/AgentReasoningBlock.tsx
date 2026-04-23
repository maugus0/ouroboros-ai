import type { AgentReasoning } from "@/types/chat.types";
import { ThinkingBlock } from "./shared/ThinkingBlock";

interface AgentReasoningBlockProps {
  data: AgentReasoning;
}

function formatConfidence(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "";
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return `${pct}%`;
}

export function AgentReasoningBlock({ data }: AgentReasoningBlockProps) {
  const parseDecisions = data.parse_decisions ?? [];
  const clarificationReasons = data.clarification_reasons ?? [];
  const decisionFactors = data.decision_factors ?? [];
  const confidence = formatConfidence(data.confidence);

  const summaryParts: string[] = [];
  if (data.approach) {
    const shortApproach =
      data.approach.length > 40 ? data.approach.slice(0, 40) + "…" : data.approach;
    summaryParts.push(shortApproach);
  }
  if (confidence) {
    summaryParts.push(`(${confidence})`);
  }
  const summary = summaryParts.join(" ");

  return (
    <ThinkingBlock
      label="Agent reasoning"
      summary={summary}
      accentColor="text-rose-600 dark:text-rose-400"
    >
      <div className="space-y-2">
        <div>
          <span className="font-medium text-foreground/70">Approach:</span>{" "}
          <span>{data.approach}</span>
          {confidence && <span className="ml-1.5 text-muted-foreground/60">({confidence})</span>}
        </div>

        {data.next_field && (
          <div>
            <span className="font-medium text-foreground/70">Next field:</span>{" "}
            <span className="text-rose-600 dark:text-rose-400">
              {data.next_field.replace(/_/g, " ")}
            </span>
          </div>
        )}

        {parseDecisions.length > 0 && (
          <div>
            <span className="font-medium text-foreground/70">Parse decisions:</span>
            <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-muted-foreground/70">
              {parseDecisions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {clarificationReasons.length > 0 && (
          <div>
            <span className="font-medium text-foreground/70">Clarification reasons:</span>
            <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-muted-foreground/70">
              {clarificationReasons.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {decisionFactors.length > 0 && (
          <div>
            <span className="font-medium text-foreground/70">Decision factors:</span>
            <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-muted-foreground/70">
              {decisionFactors.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ThinkingBlock>
  );
}
